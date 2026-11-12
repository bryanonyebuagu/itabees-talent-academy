import { createHash } from "node:crypto";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const email = String(request.body?.email || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server = process.env.MAILCHIMP_SERVER_PREFIX || apiKey?.split("-").at(-1);
  if (!apiKey || !audienceId || !/^[a-z]{2}\d+$/.test(server || "")) {
    return response.status(503).json({ error: "Newsletter signup is temporarily unavailable." });
  }

  const hash = createHash("md5").update(email).digest("hex");
  try {
    const upstream = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${hash}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, status_if_new: "subscribed" }),
      signal: AbortSignal.timeout(8000),
    });
    const result = await upstream.json();
    if (!upstream.ok) return response.status(502).json({ error: "We could not add your email. Please try again later." });
    if (result.status === "pending") return response.status(200).json({ status: "pending" });
    if (result.status !== "subscribed") return response.status(409).json({ error: "This email needs a new subscription confirmation. Please contact the academy." });
    return response.status(200).json({ status: "subscribed" });
  } catch {
    return response.status(502).json({ error: "Newsletter signup is temporarily unavailable. Please try again later." });
  }
}
