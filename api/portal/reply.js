import { db, requireUser } from "../_lib/firebase.js";
import { sendSupportEmail } from "../_lib/mail.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const admin = await requireUser(request, "admin");
    if (!admin) return response.status(403).json({ error: "Administrator access is required." });
    const id = String(request.body?.ticketId || "");
    const message = String(request.body?.message || "").trim().slice(0, 4000);
    if (!/^[A-Za-z0-9]{20}$/.test(id) || message.length < 3) return response.status(400).json({ error: "Choose a ticket and write a reply." });
    const reference = db().collection("supportTickets").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) return response.status(404).json({ error: "Support ticket not found." });
    const ticket = snapshot.data();
    const messageId = crypto.randomUUID();
    await sendSupportEmail({ to: ticket.email, subject: `Re: ${ticket.subject}`, text: `${message}\n\nItaBEES Talent Academy Support`, idempotencyKey: `support-reply-${messageId}` });
    const now = new Date().toISOString();
    await reference.update({ messages: [...ticket.messages, { sender: "academy", body: message, sentAt: now }], status: "replied", updatedAt: now });
    return response.status(200).json({ sent: true });
  } catch (error) { return response.status(503).json({ error: error.message === "Support email is not configured." ? error.message : "The reply could not be sent." }); }
}
