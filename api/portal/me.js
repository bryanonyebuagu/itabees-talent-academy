import { db, requireUser } from "../_lib/firebase.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  try {
    const user = await requireUser(request);
    if (!user) return response.status(401).json({ error: "Sign in to view your dashboard." });
    if (!user.email_verified) return response.status(403).json({ error: "Verify your email before opening the dashboard." });
    const snapshot = await db().collection("registrations").where("email", "==", user.email.toLowerCase()).get();
    const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    const active = registrations.filter(item => item.status === "active");
    return response.status(200).json({ email: user.email, registrations: active, pendingApproval: registrations.some(item => item.status === "awaiting_admin") });
  } catch { return response.status(503).json({ error: "Dashboard information is temporarily unavailable." }); }
}
