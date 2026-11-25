export async function sendSupportEmail({ to, subject, text, idempotencyKey }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SUPPORT_FROM_EMAIL;
  if (!key || !from) throw new Error("Support email is not configured.");
  const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ from, to, subject, text }) });
  if (!result.ok) throw new Error("Support email could not be delivered.");
  return result.json();
}

export function registrationLink(path, params, token) {
  const origin = process.env.PUBLIC_SITE_URL;
  if (!origin) throw new Error("PUBLIC_SITE_URL is required.");
  const url = new URL(path, origin);
  url.search = new URLSearchParams(params).toString();
  url.hash = new URLSearchParams({ token }).toString();
  return url.toString();
}
