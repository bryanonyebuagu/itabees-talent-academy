// Demonstration fees only. Replace these server-owned amounts before accepting live payments.
export const CHECKOUT_PROGRAMS = [
  { id: "player-development", name: "Player Development Academy", description: "Year-round supplemental technical training and game understanding.", amountCents: 4500, duration: "12 weeks (sample)" },
  { id: "small-group", name: "Individual & Small Group Training", description: "Personalized coaching to build technical ability and confidence.", amountCents: 7500, duration: "6 weeks (sample)" },
  { id: "camps-clinics", name: "Soccer Camps & Clinics", description: "Seasonal camps and focused development experiences.", amountCents: 9000, duration: "5 days (sample)" },
  { id: "leadership", name: "Leadership & Character Development", description: "Mentorship and life skills alongside athletic growth.", amountCents: 3500, duration: "4 weeks (sample)" },
  { id: "international", name: "International Development & Exposure", description: "Global training and development experiences.", amountCents: 4000, duration: "8 weeks (sample)" },
  { id: "goalkeeper-clinic", name: "Goalkeeper Development Clinic", description: "Position-specific practice and guidance for aspiring goalkeepers.", amountCents: 3500, duration: "4 weeks (sample)" },
  { id: "weekend-skills", name: "Weekend Skills Academy", description: "Additional weekend touches and technical development.", amountCents: 4000, duration: "8 weeks (sample)" },
];

export const formatCheckoutAmount = cents => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
