import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { initialApplication } from '../src/data/applicationForms.js';

test('all five program forms share the required player/parent structure and show only relevant questions', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: Wizard, ProgramFields } = await server.ssrLoadModule('/src/components/RegistrationWizard.jsx');
    const types = ['supplemental-training','private-training','mentorship','camps-clinics','international-experiences','financial-assistance'];
    for (const type of types) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Wizard, { initialType:type })));
      for (const field of ['playerFirstName','playerLastName','birthDate','gender','club','playingLevel','positions','goals','existingParticipant','comments']) assert.ok(html.includes(`name="${field}"`), `${type}: ${field}`);
      assert.ok(!html.includes('School name')); assert.ok(!html.includes('Soccer Background'));
      const details = renderToStaticMarkup(createElement(ProgramFields, { type, values:initialApplication, update:() => () => {} }));
      assert.equal(details.includes('name="jerseySize"'), ['supplemental-training','camps-clinics','international-experiences'].includes(type));
      assert.equal(details.includes('name="trainingFocus"'), type==='private-training');
      assert.equal(details.includes('name="mentorshipFocus"'), type==='mentorship');
      assert.equal(details.includes('name="campId"'), type==='camps-clinics');
      assert.equal(details.includes('name="trip"'), type==='international-experiences');
      assert.equal(details.includes('name="financialNeed"'), type==='financial-assistance');
      assert.ok(html.includes('aria-valuemax="3"'));
    }
  } finally { await server.close(); }
});
