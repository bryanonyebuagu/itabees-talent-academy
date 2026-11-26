import { createHash, randomUUID } from "node:crypto";
import { db } from "./_lib/firebase.js";
import { registrationAnswers } from "./payments/create.js";

export function createAssistanceHandler(databaseProvider = db) { return async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const input = request.body || {};
    const name = String(input.name || "").trim().slice(0,120);
    const email = String(input.email || "").trim().toLowerCase().slice(0,254);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: "Enter a parent or guardian name and valid email." });
    let answers;
    try { answers = registrationAnswers(input,email,name); } catch (error) { return response.status(400).json({ error: error.message }); }
    const application = {};
    for (const key of ["school","grade","athleteEmail","gpa","club","division","coachName","coachPhone","coachEmail","emergencyName","emergencyRelationship","emergencyPhone","financialNeed","medicalConditions","medications","allergies","goals","documents", ...[1,2].flatMap(n => ["Name","Role","Phone","Email"].map(part => `reference${n}${part}`))]) application[key] = String(input[key] || "").trim().slice(0,2000);
    if (["school","grade","emergencyName","emergencyRelationship","emergencyPhone"].some(key => !application[key])) return response.status(400).json({ error: "Complete school and emergency contact information." });
    const database = databaseProvider();
    const id = randomUUID();
    const limitRef = database.collection("assistanceSubmissionLimits").doc(createHash("sha256").update(email).digest("hex"));
    const saved = await database.runTransaction(async transaction => {
      const previous = (await transaction.get(limitRef)).data();
      if (previous && Date.now() - previous.lastSubmittedAt < 60000) return false;
      transaction.set(limitRef,{ lastSubmittedAt: Date.now() });
      transaction.create(database.collection("financialAssistanceRequests").doc(id),{ ...answers, application, applicationType:"financial-assistance", status:"under_review", createdAt:new Date().toISOString() });
      return true;
    });
    if (!saved) return response.status(429).json({ error:"Please wait a minute before submitting again." });
    return response.status(201).json({ submitted:true });
  } catch { return response.status(503).json({ error:"Your request could not be saved. Please try again or contact the academy." }); }
}; }
export default createAssistanceHandler();
