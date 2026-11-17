import { paymentConfig, recordKey, redis, respondError, stripeClient } from "../_lib/payments.js";

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
    const intent = event.data.object;
    const key = recordKey(intent.id);
    const raw = await redis(["GET", key]);
    if (!raw) return response.status(500).json({ error: "Payment record not found; retry webhook." });
    const record = JSON.parse(raw);
    if (record.amountCents !== intent.amount || record.currency !== intent.currency || record.reference !== intent.metadata?.reference) return response.status(400).json({ error: "Payment record mismatch." });
    // SET NX makes repeated delivery harmless. The record is written before the event is acknowledged.
    const eventKey = `itabees:stripe-event:${event.id}`;
    const claimed = await redis(["SET", eventKey, "processing", "EX", 60, "NX"]);
    if (!claimed) return response.status(200).json({ received: true });
    try {
      if (record.status !== "paid") {
        record.status = event.type === "payment_intent.succeeded" ? "paid" : "failed";
        record.updatedAt = new Date().toISOString();
        await redis(["SET", key, JSON.stringify(record)]);
      }
      await redis(["SET", eventKey, "done", "EX", 60 * 60 * 24 * 90]);
    } catch (error) { await redis(["DEL", eventKey]); throw error; }
    return response.status(200).json({ received: true });
  } catch (error) {
    if (error.type === "StripeSignatureVerificationError") return response.status(400).json({ error: "Invalid Stripe signature." });
    return respondError(response, error);
  }
}
