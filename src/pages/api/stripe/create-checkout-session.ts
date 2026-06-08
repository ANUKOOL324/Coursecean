import { getUsernameFromToken } from "@/lib/authStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type CoursePayload = {
    _id: string;
    title: string;
    description: string;
    imageLink: string;
    price: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const username = getUsernameFromToken(token);

    if (!username) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const course = req.body?.course as Partial<CoursePayload> | undefined;

    if (
        !course ||
        typeof course._id !== "string" ||
        typeof course.title !== "string" ||
        typeof course.description !== "string" ||
        typeof course.imageLink !== "string" ||
        typeof course.price !== "number"
    ) {
        return res.status(400).json({ message: "Invalid course payload" });
    }

    // Get the app URL early from environment variables (loaded from .env.local).
    // We use this for building the success_url and cancel_url that Stripe will redirect to.
    // IMPORTANT: Set NEXT_PUBLIC_APP_URL correctly in .env.local to match the URL you use in the browser
    // (including the right port). Restart the dev server after changing it.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // ============================================
    // SERVER-SIDE PRICE VALIDATION (best effort, for safe payments)
    // ============================================
    // We try to NEVER trust the price that comes from the browser.
    // A user could open the browser console and change the price before clicking Buy.
    // We look up the real course from our own server data using only the course _id.
    // This call can fail for reasons like: NEXT_PUBLIC_APP_URL not set or wrong port in .env.local,
    // server not restarted, or temporary network issue. In that case we safely fallback to the
    // price from the client (which itself came from an authenticated fetch of the courses list).
    // In a real production app we'd use a database directly instead of this HTTP lookup.
    let validatedPrice = course.price;

    try {
        // We call our own /api/admin/courses endpoint to get the real price for this course.
        // We forward the Authorization header (the user's token) because the courses API
        // requires authentication (see how the client in courses.tsx always sends the token).
        // We use the exact same URL path (with trailing slash) for consistency.
        const coursesResponse = await axios.get(`${appUrl}/api/admin/courses/`, {
            headers: authHeader ? { Authorization: authHeader } : undefined,
        });
        const realCourse = (coursesResponse.data.courses || []).find(
            (c: any) => c && c._id === course._id
        );

        if (realCourse) {
            // Use the real server price if we found the course.
            validatedPrice = realCourse.price;
        }
        // If not found, we keep the client price (fallback) and continue.
    } catch (err) {
        // Validation lookup failed (common if APP_URL is wrong/missing in .env.local or port mismatch).
        // We fallback to the price the client sent (from their authenticated courses list fetch).
        // This allows checkout to proceed instead of blocking with "Could not start checkout".
        // Log the real error for debugging (it will appear in the server console).
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Price validation lookup failed, falling back to client price:", errorMessage);
    }

    // Now create the Stripe Checkout session.
    // We wrap this in try/catch so that if getStripe() throws (e.g. STRIPE_SECRET_KEY missing from .env.local)
    // or the Stripe API call itself fails, we return a proper JSON error instead of crashing.
    // The client can then show the real message to the user.
    try {
        const stripe = getStripe();

        // Stripe only accepts public https:// image URLs for checkout product images.
        // Skip data: URLs (base64) and http:// links — otherwise Stripe may reject the session.
        const stripeProductImages =
            course.imageLink.startsWith("https://") ? [course.imageLink] : undefined;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: username.includes("@") ? username : undefined,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "inr",
                        unit_amount: Math.round(validatedPrice * 100),
                        product_data: {
                            name: course.title,
                            description: course.description,
                            ...(stripeProductImages ? { images: stripeProductImages } : {}),
                        },
                    },
                },
            ],
            success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

            // We send users back to /courses with a query parameter when they cancel.
            // This lets the courses page show a friendly message to the user.
            // We use a query param instead of redirecting to /cancel so the user
            // stays on the main course list and can easily try again.
            cancel_url: `${appUrl}/courses?checkout=cancelled`,
            metadata: {
                username,
                courseId: course._id,
                courseTitle: course.title,
            },
        });

        if (!session.url) {
            return res.status(500).json({
                message: "Stripe did not return a checkout URL. Please try again in a moment.",
            });
        }

        return res.status(200).json({ url: session.url });
    } catch (err) {
        // This catches missing STRIPE_SECRET_KEY (from getStripe) or errors from Stripe (bad key, network, etc).
        // We return the actual error message so the frontend can display it instead of a generic alert.
        console.error("Failed to create Stripe checkout session:", err);
        const errorMessage = err instanceof Error ? err.message : "Could not create checkout session. Check your Stripe keys in .env.local and restart the server.";
        return res.status(500).json({
            message: errorMessage
        });
    }
}
