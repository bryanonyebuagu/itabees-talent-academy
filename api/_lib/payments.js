import Stripe from "stripe";

export function stripeClient() {
  const { secret } = paymentConfig();
  return new Stripe(secret);
}

export function paymentConfig() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const live = secret?.startsWith("sk_live_") && publishableKey?.startsWith("pk_live_");
  const test = secret?.startsWith("sk_test_") && publishableKey?.startsWith("pk_test_");
  if ((!live && !test) || !webhookSecret?.startsWith("whsec_")) throw new Error("Matching Stripe keys and a webhook signing secret are required.");
  if (live && process.env.STRIPE_LIVE_ENABLED !== "true") throw new Error("Live Stripe payments are not enabled.");
  if (live && (!process.env.RESEND_API_KEY || !process.env.SUPPORT_FROM_EMAIL || !process.env.PUBLIC_SITE_URL)) throw new Error("Registration email must be configured before live payments are enabled.");
  return { secret, publishableKey, mode: live ? "live" : "test" };
}
export function respondError(response, error) {
  const setup = /not configured|required|not enabled|must be configured/.test(error.message || "");
  return response.status(setup ? 503 : 500).json({ error: setup ? error.message : "Payment service is temporarily unavailable." });
}
