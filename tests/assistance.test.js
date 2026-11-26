import test from "node:test";
import assert from "node:assert/strict";
import { createAssistanceHandler } from "../api/assistance.js";

test("assistance submissions save privately for review without Stripe or member access", async () => {
  const records = new Map();
  const database = { collection: name => ({ doc: id => `${name}/${id}` }), runTransaction: async fn => fn({ get: async ref => ({ data: () => records.get(ref) }), set: (ref,value) => records.set(ref,value), create: (ref,value) => records.set(ref,value) }) };
  const handler = createAssistanceHandler(() => database);
  const year = new Date().getUTCFullYear() - 10;
  const birthDate = `${year}-01-01`;
  const body = { name:"Test Guardian",email:"guardian@example.com",participantName:"Test Player",birthDate,age:10,gender:"Boy",phone:"5028074444",address:"Test",city:"Charlotte",state:"NC",zip:"28269",waiverAccepted:true,signature:"Test Guardian",agreementDate:new Date().toISOString().slice(0,10),photoPermission:"no",futureContact:"No",school:"Test School",grade:"5",emergencyName:"Contact",emergencyRelationship:"Relative",emergencyPhone:"5028074444",medicalConditions:"None" };
  const response = () => ({ setHeader(){}, status(code){this.code=code;return this;}, json(value){this.value=value;return this;} });
  const result=response(); await handler({ method:"POST",body },result);
  assert.equal(result.code,201);
  const saved=[...records.entries()].find(([key]) => key.startsWith("financialAssistanceRequests/"))[1];
  assert.equal(saved.status,"under_review"); assert.equal(saved.email,body.email);
  assert.equal(saved.application.medicalConditions,"None");
  assert.ok([...records.keys()].every(key => !/^(payments|registrations)\//.test(key)));
  const duplicate=response(); await handler({ method:"POST",body },duplicate); assert.equal(duplicate.code,429);
});
