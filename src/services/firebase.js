import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

export const firebaseReady = Object.values(config).every(Boolean);
export const memberAuth = firebaseReady ? getAuth(initializeApp(config)) : null;

export async function authorizedFetch(url, options = {}) {
  const token = await memberAuth?.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in first.");
  return fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
}
