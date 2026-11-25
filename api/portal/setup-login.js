import { timingSafeEqual } from "node:crypto";
import { auth, db } from "../_lib/firebase.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const { id, token, password } = request.body || {};
  if (typeof id !== "string" || !/^pi_[A-Za-z0-9]+$/.test(id) || typeof token !== "string" || !/^[0-9a-f-]{36}$/.test(token)) {
    return response.status(400).json({ error: "Open the login setup link from your payment confirmation email." });
  }
  try {
    const record = (await db().collection("payments").doc(id).get()).data();
    if (record?.kind !== "program" || record.status !== "paid" || !record.setupToken ||
      !timingSafeEqual(Buffer.from(record.setupToken), Buffer.from(token))) {
      return response.status(403).json({ error: "This login setup link is invalid." });
    }
    if (Date.now() - Date.parse(record.updatedAt) > 7 * 24 * 60 * 60 * 1000) {
      return response.status(410).json({ error: "This setup link has expired. Contact ItaBEES for help signing in." });
    }
    if (password === undefined) return response.status(200).json({ email: record.email });
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return response.status(400).json({ error: "Use a password between 8 and 128 characters." });
    }
    await auth().createUser({ email: record.email, password, emailVerified: true });
    return response.status(201).json({ email: record.email });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return response.status(409).json({ error: "You already have an account. Log in or reset your password." });
    }
    return response.status(503).json({ error: "Account setup is temporarily unavailable. Try your link again shortly." });
  }
}
