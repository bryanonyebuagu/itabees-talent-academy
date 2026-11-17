export async function sendSupportEmail({ to, subject, text, idempotencyKey }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SUPPORT_FROM_EMAIL;
  if (!key || !from) throw new Error("Support email is not configured.");
  const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ from, to, subject, text }) });
  if (!result.ok) throw new Error("Support email could not be delivered.");
  return result.json();
}
