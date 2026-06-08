import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
    // We read the secret key from environment variables (loaded from .env.local by Next.js).
    // This is the correct and secure way — never hardcode secrets in code.
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
        // Helpful message for beginners: common issue is forgetting to restart the dev server
        // after editing .env.local, or the key name being slightly wrong.
        throw new Error(
            "STRIPE_SECRET_KEY is not set. " +
            "Add it to your .env.local file (STRIPE_SECRET_KEY=sk_test_...) and fully restart the development server (npm run dev)."
        );
    }

    if (!stripeClient) {
        stripeClient = new Stripe(secretKey);
    }

    return stripeClient;
}
