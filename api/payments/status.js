import { paymentConfig, respondError } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  try {
    paymentConfig();
    const id = String(request.query?.id || "");
    const token = String(request.query?.token || "");
    if (!/^pi_[A-Za-z0-9]+$/.test(id) || !/^[0-9a-f-]{36}$/.test(token)) return response.status(400).json({ error: "Invalid payment reference." });
    const snapshot = await db().collection("payments").doc(id).get();
    if (!snapshot.exists) return response.status(404).json({ error: "Payment record not found." });
    const record = snapshot.data();
    if (record.accessToken !== token) return response.status(403).json({ error: "Payment record is not available." });
    const { accessToken, setupToken, phone, guardianName, ...publicRecord } = record;
    return response.status(200).json(publicRecord);
  } catch (error) { return respondError(response, error); }
}
