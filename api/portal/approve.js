import { db, requireUser } from "../_lib/firebase.js";
import { stripeClient } from "../_lib/payments.js";
import { sendSupportEmail } from "../_lib/mail.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const admin = await requireUser(request, "admin");
    if (!admin) return response.status(403).json({ error: "Administrator access is required." });
    const id = String(request.body?.registrationId || "");
    if (!/^pi_[A-Za-z0-9]+$/.test(id)) return response.status(400).json({ error: "Invalid registration." });
    const database = db();
    const registrationRef = database.collection("registrations").doc(id);
    const paymentRef = database.collection("payments").doc(id);
    const [registration, payment] = await Promise.all([registrationRef.get(), paymentRef.get()]);
    if (!registration.exists || !payment.exists || payment.data().status !== "paid") return response.status(409).json({ error: "A verified payment is required before approval." });
    const stripe = stripeClient();
    const intent = await stripe.paymentIntents.retrieve(id);
    if (intent.status !== "succeeded" || intent.amount !== payment.data().amountCents || intent.currency !== "usd") return response.status(409).json({ error: "Stripe has not confirmed this payment." });
    if (payment.data().subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(payment.data().subscriptionId);
      if (subscription.status !== "active") return response.status(409).json({ error: "The monthly subscription is not active." });
    }
    await registrationRef.update({ status: "active", approvedAt: new Date().toISOString(), approvedBy: admin.uid });
    let emailSent = false;
    try { await sendSupportEmail({ to: registration.data().email, subject: "Your ItaBEES registration is approved", text: `Your registration for ${registration.data().programName} has been approved. Sign in to your dashboard: ${process.env.PUBLIC_SITE_URL || "https://itabees-talent-academy.vercel.app"}/login`, idempotencyKey: `registration-approved-${id}` }); emailSent = true; }
    catch { /* Approval remains valid; the dashboard shows the updated status. */ }
    return response.status(200).json({ approved: true, emailSent });
  } catch { return response.status(503).json({ error: "Approval could not be completed." }); }
}
