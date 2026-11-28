import { db, requireUser } from "../_lib/firebase.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  try {
    const user = await requireUser(request, "admin");
    if (!user) return response.status(403).json({ error: "Administrator access is required." });
    const database = db();
    const [registrations, tickets, assistance, applications] = await Promise.all([database.collection("registrations").orderBy("createdAt", "desc").get(), database.collection("supportTickets").orderBy("updatedAt", "desc").get(), database.collection("financialAssistanceRequests").orderBy("createdAt", "desc").get(), database.collection("programApplications").orderBy("createdAt", "desc").get()]);
    return response.status(200).json({ applicationRequests: applications.docs.map(doc => ({ id: doc.id, ...doc.data() })), registrations: registrations.docs.map(doc => ({ id: doc.id, ...doc.data() })), tickets: tickets.docs.map(doc => ({ id: doc.id, ...doc.data() })), assistanceRequests: assistance.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch { return response.status(503).json({ error: "Admin information is temporarily unavailable." }); }
}
