import test from "node:test";
import assert from "node:assert/strict";
import { applySubscriptionEvent, subscriptionIdFromEvent } from "../api/_lib/subscriptionEvent.js";

function databaseWithRegistration(seed) {
  const records = { registrations: new Map([["pi_first", seed]]), stripeEvents: new Map() };
  const ref = (name, id) => ({ name, id });
  const database = {
    collection(name) {
      return {
        doc(id) { return ref(name, id); },
        where(field, _operator, value) {
          assert.equal(field, "subscriptionId");
          return { limit() { return { async get() {
            const match = [...records.registrations].find(([, record]) => record.subscriptionId === value);
            return { empty: !match, docs: match ? [{ ref: ref("registrations", match[0]) }] : [] };
          } }; } };
        },
      };
    },
    async runTransaction(callback) {
      const transaction = {
        async get({ name, id }) { return { exists: records[name].has(id), data: () => records[name].get(id) }; },
        update({ name, id }, changes) { records[name].set(id, { ...records[name].get(id), ...changes }); },
        create({ name, id }, value) { records[name].set(id, value); },
      };
      return callback(transaction);
    },
  };
  return { database, records };
}

test("subscription renewal, failure, recovery, cancellation, and stale delivery", async () => {
  const { database, records } = databaseWithRegistration({ subscriptionId: "sub_abc", status: "active", approvedAt: "today", paidAt: "today" });
  const invoice = (id, type, created) => ({ id, type, created, data: { object: { paid: type === "invoice.paid", amount_paid: 5900, parent: { subscription_details: { subscription: "sub_abc" } } } } });
  assert.equal(subscriptionIdFromEvent(invoice("one", "invoice.paid", 1)), "sub_abc");
  assert.equal(await applySubscriptionEvent(database, invoice("one", "invoice.paid", 1)), "processed");
  assert.equal(records.registrations.get("pi_first").billingStatus, "current");
  assert.equal(await applySubscriptionEvent(database, invoice("two", "invoice.payment_failed", 2)), "processed");
  assert.equal(records.registrations.get("pi_first").status, "billing_past_due");
  assert.equal(await applySubscriptionEvent(database, invoice("three", "invoice.paid", 3)), "processed");
  assert.equal(records.registrations.get("pi_first").status, "active");
  assert.equal(await applySubscriptionEvent(database, invoice("one", "invoice.paid", 1)), "duplicate");
  assert.equal(await applySubscriptionEvent(database, invoice("stale", "invoice.payment_failed", 2)), "stale");
  assert.equal(records.registrations.get("pi_first").status, "active");
  const canceled = { id: "four", type: "customer.subscription.deleted", created: 4, data: { object: { id: "sub_abc" } } };
  assert.equal(await applySubscriptionEvent(database, canceled), "processed");
  assert.equal(records.registrations.get("pi_first").status, "canceled");
});
