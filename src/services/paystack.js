const sessionEndpoint = import.meta.env.VITE_PAYSTACK_SESSION_ENDPOINT;
const verifyEndpoint = import.meta.env.VITE_PAYSTACK_VERIFY_ENDPOINT;

export class PaymentSetupError extends Error {}

export async function initializeDonation(payload) {
  if (!sessionEndpoint) throw new PaymentSetupError("Online payments are not active yet. The academy must connect its Paystack checkout backend.");
  const response = await fetch(sessionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.authorization_url) throw new Error(result.message || "Unable to start the payment. Please try again.");
  const url = new URL(result.authorization_url);
  if (url.protocol !== "https:" || !url.hostname.endsWith("paystack.com")) throw new Error("Invalid payment destination.");
  return url.href;
}

export async function verifyDonation(reference) {
  if (!verifyEndpoint) throw new PaymentSetupError("Payment verification is not configured yet.");
  const url = new URL(verifyEndpoint, window.location.origin);
  url.searchParams.set("reference", reference);
  const response = await fetch(url.href, { method: "GET" });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Payment verification failed.");
  return result.status === "success";
}
