export async function applyPaymentEvent(database, event) {
  const intent = event.data.object;
  const paymentRef = database.collection("payments").doc(intent.id);
  const eventRef = database.collection("stripeEvents").doc(event.id);
  const registrationRef = database.collection("registrations").doc(intent.id);
  return database.runTransaction(async transaction => {
    const [eventSnapshot, paymentSnapshot] = await Promise.all([transaction.get(eventRef), transaction.get(paymentRef)]);
    if (eventSnapshot.exists) return "duplicate";
    if (!paymentSnapshot.exists) throw new Error("Payment record not found; retry webhook.");
    const record = paymentSnapshot.data();
    if (record.amountCents !== intent.amount || record.currency !== intent.currency || record.reference !== intent.metadata?.reference) throw new Error("Payment record mismatch.");
    const paid = event.type === "payment_intent.succeeded";
    if (record.status !== "paid") transaction.update(paymentRef, { status: paid ? "paid" : "failed", updatedAt: new Date().toISOString() });
    if (paid && record.kind === "program") transaction.set(registrationRef, { email: record.email, guardianName: record.guardianName || record.name, participantName: record.participantName, age: record.age, phone: record.phone, programId: record.programId, programName: record.title, duration: record.duration, amountCents: record.amountCents, reference: record.reference, status: "awaiting_admin", paidAt: new Date().toISOString() }, { merge: true });
    if (!paid && record.kind === "program" && record.status !== "paid") transaction.set(registrationRef, { status: "payment_failed", updatedAt: new Date().toISOString() }, { merge: true });
    transaction.create(eventRef, { type: event.type, intentId: intent.id, processedAt: new Date().toISOString() });
    return paid ? "paid" : "failed";
  });
}
