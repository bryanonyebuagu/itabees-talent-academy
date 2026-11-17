import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export function adminApp() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Firebase backend is not configured.");
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function db() { return getFirestore(adminApp()); }
export function auth() { return getAuth(adminApp()); }

export async function requireUser(request, role) {
  const match = /^Bearer (.+)$/.exec(request.headers.authorization || "");
  if (!match) return null;
  const user = await auth().verifyIdToken(match[1], true);
  if (role === "admin" && user.admin !== true) return null;
  return user;
}

export async function requireApprovedMember(request) {
  const user = await requireUser(request);
  if (!user?.email_verified) return null;
  if (user.admin === true) return user;
  const snapshot = await db().collection("registrations").where("email", "==", user.email.toLowerCase()).get();
  return snapshot.docs.some(doc => doc.data().status === "active") ? user : null;
}
