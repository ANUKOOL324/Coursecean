import { markPurchased } from "@/lib/purchaseStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(request: NextApiRequest) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return response.status(500).json({
      message:
        "STRIPE_WEBHOOK_SECRET is not set. " +
        "Add it to your .env.local file and fully restart the development server (npm run dev). " +
        "For local testing you get this value by running `stripe listen --forward-to localhost:3000/api/stripe/webhook`."
    });
  }

  const stripe = getStripe();
  const signature = request.headers["stripe-signature"];

  if (typeof signature !== "string") {
    return response.status(400).json({ message: "Missing Stripe signature" });
  }

  try {
    const rawBody = await readRawBody(request);
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      const username = session.metadata?.username;
      const courseId = session.metadata?.courseId;
      const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

      if (username && courseId) {
        // Use await to save purchase in MongoDB
        await markPurchased(username, courseId, session.id, amountPaid);
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return response.status(400).json({ message: "Webhook error" });
  }
}
