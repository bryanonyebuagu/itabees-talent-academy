import test from 'node:test';
import assert from 'node:assert/strict';
import { createSubmissionHandler } from '../api/_lib/submissions.js';
import { applicationAnswers } from '../api/_lib/application.js';
import { applicationFixture, databaseFixture, responseFixture } from './application-fixture.js';

test('shared required answers and program-specific answers are validated on the server', () => {
  const body = applicationFixture();
  for (const key of ['playerFirstName','playerLastName','guardianFirstName','guardianLastName','existingParticipant','playingLevel']) assert.throws(() => applicationAnswers({ ...body, [key]: '' }, 'supplemental-training'));
  assert.throws(() => applicationAnswers({ ...body, positions: [] }, 'supplemental-training'));
  assert.throws(() => applicationAnswers({ ...body, birthDate: '2015-02-30' }, 'supplemental-training'));
  assert.throws(() => applicationAnswers({ ...body, jerseySize: 'Youth M' }, 'supplemental-training'));
  assert.throws(() => applicationAnswers({ ...body, financialAssistance: 'Yes' }, 'supplemental-training'));
  assert.throws(() => applicationAnswers(body, 'private-training'));
  assert.throws(() => applicationAnswers(body, 'mentorship'));
});

test('requests, camp registration, full-session waitlist and travel interest save private admin records without payment', async () => {
  const inputs = [
    ['private-training', { trainingFocus: ['Dribbling'], sessionFrequency: 'Weekly', preferredSchedule: 'Tuesday evenings' }, 'requested'],
    ['mentorship', { mentorshipFocus: ['Confidence','College recruiting'], meetingFormat: 'Virtual' }, 'requested'],
    ['camps-clinics', { campId: 'open' }, 'registered'],
    ['camps-clinics', { campId: 'full' }, 'waitlisted'],
    ['international-experiences', { trip: 'Family preferred trip', guardianTravel: 'Yes' }, 'interest_received'],
  ];
  for (const [type, extra, status] of inputs) {
    const { database, records } = databaseFixture(); const mail = [];
    const handler = createSubmissionHandler({ databaseProvider: () => database, sendEmail: async message => mail.push(message), camps: [{ id: 'open', name: 'Open Clinic', status: 'open' }, { id: 'full', name: 'Full Camp', status: 'full' }] });
    const result = responseFixture();
    await handler({ method: 'POST', body: applicationFixture({ ...extra, applicationType: type }) }, result);
    assert.equal(result.code,201,type); assert.equal(result.value.status,status,type);
    const saved = [...records.entries()].find(([key]) => key.startsWith('programApplications/'))[1];
    assert.equal(saved.status,status); assert.equal(saved.photoPermission,false); assert.deepEqual(saved.application.positions,['Forward','Midfielder']);
    assert.equal(mail.length,1); assert.equal(mail[0].to,'guardian@example.com');
    assert.ok([...records.keys()].every(key => !/^(payments|registrations)\//.test(key)));
  }
});

test('financial assistance from camps or travel preserves context and bypasses registration/payment', async () => {
  for (const [type, extra] of [['camps-clinics',{ campId:'soccer-camp' }],['international-experiences',{ trip:'Requested trip',guardianTravel:'No' }]]) {
    const { database, records } = databaseFixture();
    const handler = createSubmissionHandler({ databaseProvider: () => database, sendEmail: async () => {} });
    const result = responseFixture();
    await handler({ method:'POST', body: applicationFixture({ ...extra, applicationType:type, financialAssistance:'Yes', financialNeed:'Need support', assistanceType:'Payment plan' }) },result);
    assert.equal(result.code,201); assert.equal(result.value.assistance,true);
    assert.ok([...records.keys()].some(key => key.startsWith('financialAssistanceRequests/')));
    assert.ok([...records.keys()].every(key => !key.startsWith('programApplications/')));
  }
});

test('invalid camps cannot register; retrying a saved submission is idempotent and email failure does not lose it', async () => {
  const { database, records } = databaseFixture();
  const handler = createSubmissionHandler({ databaseProvider: () => database, sendEmail: async () => { throw new Error('mail unavailable'); } });
  const body = applicationFixture({ applicationType:'camps-clinics',campId:'unknown' });
  const invalid = responseFixture(); await handler({ method:'POST',body },invalid); assert.equal(invalid.code,400); assert.equal(records.size,0);
  body.campId='soccer-clinic'; body.submissionId='12345678-1234-1234-1234-123456789012';
  const first=responseFixture(); await handler({ method:'POST',body },first); assert.equal(first.code,201); assert.equal(first.value.emailSent,false);
  const retry=responseFixture(); await handler({ method:'POST',body },retry); assert.equal(retry.code,200);
  const changed=responseFixture(); await handler({ method:'POST',body:{ ...body,comments:'A different request' } },changed); assert.equal(changed.code,409);
  assert.equal([...records.keys()].filter(key => key.startsWith('programApplications/')).length,1);
});
