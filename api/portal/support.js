import { db, requireApprovedMember } from "../_lib/firebase.js";
import { sendSupportEmail } from "../_lib/mail.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  try {
    const user = await requireApprovedMember(request);
    if (!user) return response.status(403).json({ error: "An approved member account is required for support." });
    const database = db();
    if (request.method === "GET") {
      const snapshot = await database.collection("supportTickets").where("uid", "==", user.uid).get();
      return response.status(200).json({ tickets: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)) });
    }
    if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
    const subject = String(request.body?.subject || "").trim().slice(0, 140);
    const message = String(request.body?.message || "").trim().slice(0, 4000);
    if (subject.length < 3 || message.length < 10) return response.status(400).json({ error: "Enter a subject and a message of at least 10 characters." });
    const now = new Date().toISOString();
    const reference = database.collection("supportTickets").doc();
    const ticket = { uid: user.uid, email: user.email, subject, messages: [{ sender: "member", body: message, sentAt: now }], status: "open", createdAt: now, updatedAt: now };
    await reference.set(ticket);
    let emailSent = false;
    if (process.env.SUPPORT_TO_EMAIL) {
      try { await sendSupportEmail({ to: process.env.SUPPORT_TO_EMAIL, subject: `ItaBEES support: ${subject}`, text: `From: ${user.email}\nTicket: ${reference.id}\n\n${message}`, idempotencyKey: `support-${reference.id}` }); emailSent = true; }
      catch { /* Ticket remains available in the admin dashboard. */ }
    }
    return response.status(201).json({ id: reference.id, emailSent, ticket });
  } catch { return response.status(503).json({ error: "Support is temporarily unavailable." }); }
}
