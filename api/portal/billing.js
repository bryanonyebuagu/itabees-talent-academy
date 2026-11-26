import { createHash } from "node:crypto";
import { db, requireUser } from "../_lib/firebase.js";
import { paymentConfig, stripeClient } from "../_lib/payments.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const user = await requireUser(request);
    if (!user?.email_verified) return response.status(403).json({ error: "Sign in with a verified email to manage billing." });
    const email = user.email.toLowerCase();
    const { mode } = paymentConfig();
    const emailHash = createHash("sha256").update(email).digest("hex");
    const customer = await db().collection("stripeCustomers").doc(`${mode}-${emailHash}`).get();
    if (!customer.exists) return response.status(404).json({ error: "No monthly billing account was found." });
    const origin = process.env.PUBLIC_SITE_URL;
    const session = await stripeClient().billingPortal.sessions.create({ customer: customer.data().id, return_url: `${origin}/dashboard/my-programmes` });
    return response.status(200).json({ url: session.url });
  } catch {
    return response.status(503).json({ error: "Billing management is temporarily unavailable. Contact ItaBEES support for help." });
  }
}
