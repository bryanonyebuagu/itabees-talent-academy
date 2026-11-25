// Published ItaBEES pricing. Checkout remains in Stripe test mode until live billing is configured.
export const CHECKOUT_PROGRAMS = [
  { id: "recreational-one-day", name: "Recreational Supplemental Training", description: "Group training · 1 day per week", amountCents: 6900, duration: "Monthly", siblingDiscountCents: 1000 },
  { id: "recreational-two-days", name: "Recreational Supplemental Training", description: "Group training · 2 days per week", amountCents: 10900, duration: "Monthly", siblingDiscountCents: 1000 },
  { id: "elite-one-day", name: "Elite Supplemental Training", description: "Group training · 1 day per week", amountCents: 8900, duration: "Monthly", siblingDiscountCents: 1000 },
  { id: "elite-two-days", name: "Elite Supplemental Training", description: "Group training · 2 days per week", amountCents: 13900, duration: "Monthly", siblingDiscountCents: 1000 },
  { id: "private-training-member", name: "One-on-One Soccer Training", description: "60-minute private session by request · active members", amountCents: 6000, duration: "Per session" },
  { id: "private-training-nonmember", name: "One-on-One Soccer Training", description: "60-minute private session by request · non-members", amountCents: 7500, duration: "Per session" },
  { id: "player-mentorship", name: "Private Player Mentorship", description: "30-minute virtual session with a current or former professional soccer player, by request", amountCents: 7500, duration: "Per session" },
];

export const PRICE_ON_REQUEST = [
  { name: "Soccer Clinics & Camps", description: "Scheduled events", price: "Pricing posted with each event" },
  { name: "International Soccer & Cultural Experiences", description: "Scheduled trips", price: "Pricing announced when trip details are confirmed" },
];

export const formatCheckoutAmount = cents => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
