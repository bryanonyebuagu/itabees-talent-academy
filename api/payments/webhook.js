import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";
import { applyPaymentEvent } from "../_lib/paymentEvent.js";
import { applySubscriptionEvent } from "../_lib/subscriptionEvent.js";

import { registrationLink, sendSupportEmail } from "../_lib/mail.js";

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();
  try {
    paymentConfig();
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const stripe = stripeClient();
    const event = stripe.webhooks.constructEvent(Buffer.concat(chunks), request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET?.trim());
    const paymentEvents = ["payment_intent.succeeded", "payment_intent.payment_failed", "payment_intent.canceled"];
    const subscriptionEvents = ["invoice.paid", "invoice.payment_failed", "customer.subscription.deleted"];
    if (!paymentEvents.includes(event.type) && !subscriptionEvents.includes(event.type)) return response.status(200).json({ received: true });
    const database = db();
    if (subscriptionEvents.includes(event.type)) {
      await applySubscriptionEvent(database, event);
      return response.status(200).json({ received: true });
    }
    const trackedPayment = await database.collection("payments").doc(event.data.object.id).get();
    if (!trackedPayment.exists && event.data.object.invoice) return response.status(200).json({ received: true });
    await applyPaymentEvent(database, event);
    if (event.type === "payment_intent.succeeded") {
      const id = event.data.object.id;
      const paymentRef = database.collection("payments").doc(id);
      const record = (await paymentRef.get()).data();
      if (record.kind === "program" && record.setupToken && !record.setupEmailSentAt) {
        const link = registrationLink("/setup-login", { id }, record.setupToken);
        await sendSupportEmail({ to: record.email, subject: "Set up your ItaBEES login", text: `Your payment for ${record.title} was confirmed. Set up your login here: ${link}
Already have an account? Use your existing login.`, idempotencyKey: `setup-${id}` });
        await paymentRef.update({ setupEmailSentAt: new Date().toISOString() });
      }
    }
    return response.status(200).json({ received: true });
  } catch (error) {
    if (error.type === "StripeSignatureVerificationError") return response.status(400).json({ error: "Invalid Stripe signature." });
    return respondError(response, error);
  }
}
