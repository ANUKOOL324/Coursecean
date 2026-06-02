import { getUsernameFromToken } from "@/lib/authStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

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

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: username.includes("@") ? username : undefined,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "inr",
                    unit_amount: Math.round(course.price * 100),
                    product_data: {
                        name: course.title,
                        description: course.description,
                        images: [course.imageLink],
                    },
                },
            },
        ],
        success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/courses?checkout=cancelled`,
        metadata: {
            username,
            courseId: course._id,
            courseTitle: course.title,
        },
    });

    return res.status(200).json({ url: session.url });
}
