import { markPurchased } from "@/lib/purchaseStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const sessionId = req.query.session_id;

    if (typeof sessionId !== "string" || !sessionId) {
        return res.status(400).json({ message: "session_id is required" });
    }

    try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed yet" });
        }

        const username = session.metadata?.username;
        const courseId = session.metadata?.courseId;
        const courseTitle = session.metadata?.courseTitle;

        if (!username || !courseId) {
            return res.status(400).json({
                message: "Payment was received but course details are missing. Please contact support.",
            });
        }

        markPurchased(username, courseId);

        return res.status(200).json({
            paid: true,
            username,
            courseId,
            courseTitle: courseTitle ?? "your course",
        });
    } catch (err) {
        // Return a clear message instead of crashing (e.g. missing STRIPE_SECRET_KEY).
        console.error("Failed to confirm Stripe payment:", err);
        const errorMessage = err instanceof Error
            ? err.message
            : "Could not verify payment with Stripe. Please try again.";
        return res.status(500).json({ message: errorMessage });
    }
}