import { markPurchased } from "@/lib/purchaseStore";
import { getStripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const sessionId = request.query.session_id;

  if (typeof sessionId !== "string" || !sessionId) {
    return response.status(400).json({ message: "session_id is required" });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return response.status(400).json({ message: "Payment not completed yet" });
    }

    const username = session.metadata?.username;
    const courseId = session.metadata?.courseId;
    const courseTitle = session.metadata?.courseTitle;

    if (!username || !courseId) {
      return response.status(400).json({
        message: "Payment was received but course details are missing. Please contact support.",
      });
    }

    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    // Use await for markPurchased database write
    await markPurchased(username, courseId, sessionId, amountPaid);

    return response.status(200).json({
      paid: true,
      username,
      courseId,
      courseTitle: courseTitle ?? "your course",
    });
  } catch (error) {
    console.error("Failed to confirm Stripe payment:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Could not verify payment with Stripe. Please try again.";
    return response.status(500).json({ message: errorMessage });
  }
}