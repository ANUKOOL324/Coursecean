import { markPurchased } from "@/lib/purchaseStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export const config = {
    api: {
        bodyParser: false,
    },
};

async function readRawBody(req: NextApiRequest) {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
        return res.status(500).json({ message: "STRIPE_WEBHOOK_SECRET is not set" });
    }

    const stripe = getStripe();
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string") {
        return res.status(400).json({ message: "Missing Stripe signature" });
    }

    try {
        const rawBody = await readRawBody(req);
        const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
            const session = event.data.object as Stripe.Checkout.Session;
            const username = session.metadata?.username;
            const courseId = session.metadata?.courseId;

            if (username && courseId) {
                markPurchased(username, courseId);
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        return res.status(400).json({ message: "Webhook error" });
    }
}
