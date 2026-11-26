import test from "node:test";
import assert from "node:assert/strict";
import { createAssistanceHandler } from "../api/assistance.js";

test("assistance submissions save privately for review without Stripe or member access", async () => {
  const records = new Map();
  const database = { collection: name => ({ doc: id => `${name}/${id}` }), runTransaction: async fn => fn({ get: async ref => ({ data: () => records.get(ref) }), set: (ref,value) => records.set(ref,value), create: (ref,value) => records.set(ref,value) }) };
  const handler = createAssistanceHandler(() => database);
  const year = new Date().getUTCFullYear() - 10;
  const birthDate = `${year}-01-01`;
  const body = { name:"Test Guardian",email:"guardian@example.com",participantName:"Test Player",birthDate,age:10,gender:"Boy",phone:"5028074444",address:"Test",city:"Charlotte",state:"NC",zip:"28269",waiverAccepted:true,school:"Test School",grade:"5",emergencyName:"Contact",emergencyRelationship:"Relative",emergencyPhone:"5028074444",medicalConditions:"None" };
  const response = () => ({ setHeader(){}, status(code){this.code=code;return this;}, json(value){this.value=value;return this;} });
  const unagreed=response(); await handler({ method:"POST",body:{...body,waiverAccepted:false} },unagreed);
  assert.equal(unagreed.code,400); assert.equal(records.size,0);
  const result=response(); await handler({ method:"POST",body },result);
  assert.equal(result.code,201);
  const saved=[...records.entries()].find(([key]) => key.startsWith("financialAssistanceRequests/"))[1];
  assert.equal(saved.status,"under_review"); assert.equal(saved.email,body.email);
  assert.equal(saved.application.medicalConditions,"None");
  assert.equal(saved.consentMethod,"checkbox");
  assert.equal(saved.photoPermission,null);
  assert.equal(saved.futureContact,null);
  assert.equal(saved.signature,undefined);
  assert.ok([...records.keys()].every(key => !/^(payments|registrations)\//.test(key)));
  const duplicate=response(); await handler({ method:"POST",body },duplicate); assert.equal(duplicate.code,429);
});
