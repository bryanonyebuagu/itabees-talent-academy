import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssistanceHandler } from '../api/assistance.js';
import { applicationFixture, databaseFixture, responseFixture } from './application-fixture.js';

test('assistance submissions save the full shared form for review without Stripe or member access', async () => {
  const { records, database } = databaseFixture();
  const mail = [];
  const handler = createAssistanceHandler(() => database, async message => mail.push(message));
  const body = applicationFixture({ sourceType: 'supplemental-training', financialAssistance: 'Yes', financialNeed: 'Family needs support', assistanceType: 'Reduced program fee' });
  const unagreed = responseFixture(); await handler({ method: 'POST', body: { ...body, waiverAccepted: false } }, unagreed);
  assert.equal(unagreed.code,400); assert.equal(records.size,0);
  const missingReason = responseFixture(); await handler({ method: 'POST', body: { ...body, financialNeed: '' } }, missingReason);
  assert.equal(missingReason.code,400); assert.equal(records.size,0);
  const result = responseFixture(); await handler({ method: 'POST', body }, result);
  assert.equal(result.code,201);
  const saved = [...records.entries()].find(([key]) => key.startsWith('financialAssistanceRequests/'))[1];
  assert.equal(saved.status,'under_review'); assert.equal(saved.email,body.email);
  assert.equal(saved.application.assistanceType,'Reduced program fee');
  assert.equal(saved.comments,'Peanut allergy');
  assert.equal(saved.photoPermission,false); assert.equal(saved.waiverVersion,'2026-11-28');
  assert.equal(saved.application.playingLevel,'Competitive');
  assert.ok([...records.keys()].every(key => !/^(payments|registrations)\//.test(key)));
  assert.equal(mail.length,1); assert.equal(mail[0].to,body.email);
  assert.match(mail[0].text,/5 to 7 business days/);
  const duplicate=responseFixture(); await handler({ method:'POST', body },duplicate); assert.equal(duplicate.code,429);
});
