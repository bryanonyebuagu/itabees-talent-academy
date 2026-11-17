import { auth } from "../api/_lib/firebase.js";

const email = process.env.ADMIN_EMAIL;
if (!email) throw new Error("Set ADMIN_EMAIL before granting admin access.");
try {
  const account = await auth().getUserByEmail(email);
  await auth().setCustomUserClaims(account.uid, { ...account.customClaims, admin: true });
  process.stdout.write(`Admin access granted to ${email}. Sign out and back in to refresh the account token.\n`);
} catch (error) {
  process.stderr.write(`Could not grant admin access: ${error.message}\n`);
  process.exitCode = 1;
}
