export const DONATION_CURRENCY = import.meta.env.VITE_DONATION_CURRENCY || "USD";
export const SUGGESTED_AMOUNTS = [500, 50, 100, 200, 1000];
export const FREQUENCIES = ["one-time", "monthly", "yearly"];

export function formatDonation(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: DONATION_CURRENCY, maximumFractionDigits: 2 }).format(Number(amount) || 0);
}

export function validDonation(amount, frequency) {
  const value = Number(amount);
  return Number.isFinite(value) && value >= 2 && value <= 1000000 && FREQUENCIES.includes(frequency);
}
