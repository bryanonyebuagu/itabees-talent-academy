import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";
import { applyPaymentEvent } from "../_lib/paymentEvent.js";

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();
  try {
    paymentConfig();
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const stripe = stripeClient();
    const event = stripe.webhooks.constructEvent(Buffer.concat(chunks), request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
    if (!["payment_intent.succeeded", "payment_intent.payment_failed", "payment_intent.canceled"].includes(event.type)) return response.status(200).json({ received: true });
    await applyPaymentEvent(db(), event);
    return response.status(200).json({ received: true });
  } catch (error) {
    if (error.type === "StripeSignatureVerificationError") return response.status(400).json({ error: "Invalid Stripe signature." });
    return respondError(response, error);
  }
}
