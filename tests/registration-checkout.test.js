import test from "node:test";
import assert from "node:assert/strict";
import { createPaymentHandler } from "../api/payments/create.js";
import { CHECKOUT_PROGRAMS } from "../src/data/checkoutPrograms.js";

test("three-step training application opens monthly Stripe payment without a verification-email wait", async () => {
  const records = new Map();
  const ref = path => ({ path, get: async () => ({ exists: records.has(path), data: () => records.get(path) }), create: async value => records.set(path, value), update: async value => records.set(path, { ...records.get(path), ...value }) });
  const database = {
    collection: name => ({ doc: id => ref(`${name}/${id}`), where: () => ({ get: async () => ({ docs: [] }) }) }),
    runTransaction: async fn => fn({ get: async item => ({ exists: records.has(item.path), data: () => records.get(item.path) }), set: (item, value) => records.set(item.path, { ...value, ...(value.expiresAt ? { expiresAt: { toMillis: () => value.expiresAt.getTime() } } : {}) }), create: (item, value) => records.set(item.path, { ...value, ...(value.expiresAt ? { expiresAt: { toMillis: () => value.expiresAt.getTime() } } : {}) }) }),
  };
  let subscriptionParams, productParams;
  const stripe = { customers: { create: async () => ({ id: "cus_guardian" }) }, products: { create: async input => { productParams = input; return { id: "prod_training" }; } }, subscriptions: { create: async input => { subscriptionParams = input; return { id: "sub_training", latest_invoice: { confirmation_secret: { client_secret: "pi_training_secret_test" } } }; } } };
  const handler = createPaymentHandler({ databaseProvider: () => database, configProvider: () => ({ publishableKey: "pk_test_example", mode: "test" }), stripeProvider: () => stripe });
  const body = { kind: "program", applicationType: "supplemental-training", programId: "recreational-one-day", name: "Test Guardian", email: "guardian@example.com", participantName: "Test Athlete", birthDate: `${new Date().getUTCFullYear() - 10}-01-01`, gender: "Girl", phone: "5028074444", address: "Test address", city: "Charlotte", state: "NC", zip: "28269", waiverAccepted: true, jerseySize: "Youth M", club: "Test FC", goals: "Build confidence", allergies: "Peanuts", emergencyName: "Test Contact", emergencyRelationship: "Relative", emergencyPhone: "5028074444" };
  const response = () => ({ setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.value = value; return this; } });
  const invalid = response();
  await handler({ method: "POST", body: { ...body, jerseySize: "" } }, invalid);
  assert.equal(invalid.code, 400);
  assert.equal(records.size, 0);
  const result = response();
  await handler({ method: "POST", body }, result);
  assert.equal(result.code, 200);
  assert.equal(result.value.verificationSent, undefined);
  assert.equal(result.value.clientSecret, "pi_training_secret_test");
  assert.equal(result.value.recurring, true);
  assert.match(subscriptionParams.description, /^ItaBEES Talent Academy/);
  assert.match(productParams.name, /^ItaBEES Talent Academy/);
  assert.equal(subscriptionParams.items[0].price_data.recurring.interval, "month");
  assert.equal(subscriptionParams.items[0].price_data.unit_amount, 6900);
  assert.equal(subscriptionParams.cancel_at, undefined);
  const saved = records.get("registrations/pi_training");
  assert.equal(saved.application.jerseySize, "Youth M");
  assert.equal(saved.application.allergies, "Peanuts");
  assert.equal(saved.application.existingParticipant, undefined);
  assert.equal(saved.age, 10);
  assert.equal(saved.status, "payment_pending");
  assert.ok(CHECKOUT_PROGRAMS.filter(program => program.name.includes("Supplemental")).every(program => program.duration === "Monthly"));
});

import { createStatusHandler } from "../api/payments/status.js";
test("login setup redirect is available only after confirmed payment and with the private payment token", async () => {
  const accessToken = "12345678-1234-1234-1234-123456789012";
  const record = { kind: "program", status: "pending", accessToken, setupToken: "87654321-1234-1234-1234-123456789012" };
  const handler = createStatusHandler({ databaseProvider: () => ({ collection: () => ({ doc: () => ({ get: async () => ({ exists: true, data: () => record }) }) }) }), configProvider: () => ({}) });
  const response = () => ({ setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.value = value; return this; } });
  const query = { id: "pi_training", token: accessToken };
  const unpaid = response(); await handler({ method: "GET", query }, unpaid);
  assert.equal(unpaid.value.setupUrl, undefined);
  record.status = "paid";
  const paid = response(); await handler({ method: "GET", query }, paid);
  assert.match(paid.value.setupUrl, /^\/setup-login\?id=pi_training#token=/);
  const denied = response(); await handler({ method: "GET", query: { ...query, token: record.setupToken } }, denied);
  assert.equal(denied.code, 403);
  assert.equal(denied.value.setupUrl, undefined);
});
