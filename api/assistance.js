import { createSubmissionHandler } from './_lib/submissions.js';
export function createAssistanceHandler(databaseProvider, sendEmail) {
  return createSubmissionHandler({ databaseProvider, sendEmail, assistanceOnly: true });
}
const assistance = createAssistanceHandler();
const applications = createSubmissionHandler();
export default function handler(request, response) {
  return request.body?.applicationType && request.body.applicationType !== 'financial-assistance' ? applications(request, response) : assistance(request, response);
}
