export function subscriptionIdFromEvent(event) {
  if (event.type === "customer.subscription.deleted") return event.data.object.id;
  const invoice = event.data.object;
  return invoice.subscription || invoice.parent?.subscription_details?.subscription || null;
}

export async function applySubscriptionEvent(database, event) {
  const subscriptionId = subscriptionIdFromEvent(event);
  if (!subscriptionId) return "ignored";
  const snapshot = await database.collection("registrations").where("subscriptionId", "==", subscriptionId).limit(1).get();
  if (snapshot.empty) return "ignored";
  const registrationRef = snapshot.docs[0].ref;
  const eventRef = database.collection("stripeEvents").doc(event.id);
  return database.runTransaction(async transaction => {
    const [previous, registration] = await Promise.all([transaction.get(eventRef), transaction.get(registrationRef)]);
    if (previous.exists) return "duplicate";
    if (!registration.exists) return "ignored";
    const item = registration.data();
    if (event.created && item.lastBillingEventCreated && event.created < item.lastBillingEventCreated) return "stale";
    const now = new Date().toISOString();
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      if (invoice.paid && invoice.amount_paid > 0 && item.status !== "canceled") transaction.update(registrationRef, {
        billingStatus: "current", lastInvoicePaidAt: now, lastBillingEventCreated: event.created || 0,
        ...(item.paidAt ? { status: item.approvedAt ? "active" : "awaiting_admin" } : {}),
      });
    } else if (event.type === "invoice.payment_failed") {
      transaction.update(registrationRef, { billingStatus: "past_due", status: "billing_past_due", lastBillingEventCreated: event.created || 0, updatedAt: now });
    } else if (event.type === "customer.subscription.deleted") {
      transaction.update(registrationRef, { billingStatus: "canceled", status: "canceled", lastBillingEventCreated: event.created || 0, updatedAt: now });
    }
    transaction.create(eventRef, { type: event.type, subscriptionId, processedAt: now });
    return "processed";
  });
}
