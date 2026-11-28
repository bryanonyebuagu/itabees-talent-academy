import { createHash, randomUUID } from 'node:crypto';
import { db } from './firebase.js';
import { sendSupportEmail } from './mail.js';
import { applicationAnswers } from './application.js';
import { CHECKOUT_PROGRAMS } from '../../src/data/checkoutPrograms.js';
import { ASSISTANCE_RECEIVED, CAMP_SESSIONS, FORM_TYPES, REQUEST_RECEIVED, formTypeForProgram } from '../../src/data/applicationForms.js';

export function createSubmissionHandler({ databaseProvider = db, sendEmail = sendSupportEmail, camps = CAMP_SESSIONS, assistanceOnly = false } = {}) {
  return async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
    try {
      const input = request.body || {};
      const sourceType = assistanceOnly ? input.sourceType || 'financial-assistance' : input.applicationType;
      if (!Object.hasOwn(FORM_TYPES, sourceType) || !assistanceOnly && ['supplemental-training','financial-assistance'].includes(sourceType)) return response.status(400).json({ error: 'Choose a valid application form.' });
      let answers;
      try { answers = applicationAnswers(input, sourceType, camps); } catch (error) { return response.status(400).json({ error: error.message }); }
      const assistance = assistanceOnly || answers.application.financialAssistance === 'Yes';
      if (assistance && (!answers.application.financialNeed || !answers.application.assistanceType)) return response.status(400).json({ error: 'Complete your financial assistance reason and assistance type.' });
      const program = CHECKOUT_PROGRAMS.find(item => item.id === input.programId);
      if (program && sourceType !== 'financial-assistance' && formTypeForProgram(program) !== sourceType) return response.status(400).json({ error: 'Choose the form that matches your selected program.' });
      const status = assistance ? 'under_review' : sourceType === 'camps-clinics' ? answers.application.campStatus === 'full' ? 'waitlisted' : 'registered' : sourceType === 'international-experiences' ? 'interest_received' : 'requested';
      const message = assistance ? ASSISTANCE_RECEIVED : status === 'waitlisted' ? 'Your waitlist request has been received! We will contact you by email if a place becomes available. A waitlist entry does not guarantee a place.' : sourceType === 'camps-clinics' ? 'Your camp or clinic registration has been received! Our team will email you with session details and any applicable payment instructions.' : sourceType === 'international-experiences' ? 'Your travel interest has been received! Our team will follow up by email with trip details and next steps. This is not a confirmed travel booking.' : REQUEST_RECEIVED;
      const id = /^[0-9a-f-]{36}$/.test(input.submissionId || '') ? input.submissionId : randomUUID();
      const payloadHash = createHash('sha256').update(JSON.stringify({ ...answers, agreementDate: undefined, programId: program?.id || '' })).digest('hex');
      const database = databaseProvider();
      const recordRef = database.collection(assistance ? 'financialAssistanceRequests' : 'programApplications').doc(id);
      const limitRef = database.collection('applicationSubmissionLimits').doc(createHash('sha256').update(`${answers.email}:${sourceType}`).digest('hex'));
      const result = await database.runTransaction(async transaction => {
        const [previous, existing] = await Promise.all([transaction.get(limitRef), transaction.get(recordRef)]);
        if (existing.exists) return existing.data().email === answers.email && existing.data().payloadHash === payloadHash ? 'duplicate' : 'conflict';
        if (previous.data() && Date.now() - previous.data().lastSubmittedAt < 60000) return 'limited';
        transaction.set(limitRef, { lastSubmittedAt: Date.now() });
        transaction.create(recordRef, { ...answers, payloadHash, sourceType, applicationType: assistance ? 'financial-assistance' : sourceType, programId: program?.id || '', programName: program?.name || FORM_TYPES[sourceType].title, status, createdAt: new Date().toISOString() });
        return 'saved';
      });
      if (result === 'conflict') return response.status(409).json({ error: 'This submission has already been received. Start a new form to submit a different application.' });
      if (result === 'limited') return response.status(429).json({ error: 'Please wait a minute before submitting again.' });
      let emailSent = false;
      try {
        await sendEmail({ to: answers.email, subject: `ItaBEES Talent Academy - ${assistance ? 'Financial assistance application received' : status === 'waitlisted' ? 'Waitlist request received' : FORM_TYPES[sourceType].title + ' received'}`, text: `${message}\n\nPlayer: ${answers.participantName}\n\nQuestions? info@itabeestalentacademy.com | 502-807-4444\nhttps://www.itabeestalentacademy.com`, idempotencyKey: `application-${id}` });
        emailSent = true;
      } catch { /* The application is saved even if email delivery is temporarily unavailable. */ }
      return response.status(result === 'saved' ? 201 : 200).json({ submitted: true, assistance, status, message, emailSent });
    } catch { return response.status(503).json({ error: 'Your application could not be saved. Please try again or contact info@itabeestalentacademy.com.' }); }
  };
}
