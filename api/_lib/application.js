import { ASSISTANCE_TYPES, CAMP_SESSIONS, JERSEY_SIZES, MEETING_FORMATS, MENTORSHIP_FOCUS, PLAYING_LEVELS, POSITIONS, PRIVATE_FOCUS, SESSION_FREQUENCIES, WAIVER_VERSION } from '../../src/data/applicationForms.js';
const clean = (value, max = 120) => typeof value === 'string' ? value.trim().slice(0, max) : '';
function required(input, key, label, max = 120) {
  const value = clean(input[key], max);
  if (!value) throw new Error(`Complete ${label}.`);
  return value;
}
function choice(input, key, options, label) {
  const value = required(input, key, label);
  if (!options.includes(value)) throw new Error(`Choose a valid ${label}.`);
  return value;
}
function multiple(input, key, options, label) {
  const values = input[key];
  if (!Array.isArray(values) || !values.length || values.some(value => !options.includes(value))) throw new Error(`Select ${label}.`);
  return [...new Set(values)];
}
export function applicationAnswers(input, type, camps = CAMP_SESSIONS) {
  const playerFirstName = required(input, 'playerFirstName', 'player first name');
  const playerLastName = required(input, 'playerLastName', 'player last name');
  const guardianFirstName = required(input, 'guardianFirstName', 'parent/guardian first name');
  const guardianLastName = required(input, 'guardianLastName', 'parent/guardian last name');
  const birthDate = required(input, 'birthDate', 'date of birth', 10);
  const date = new Date(`${birthDate}T12:00:00Z`), today = new Date();
  const age = today.getUTCFullYear() - date.getUTCFullYear() - (today.getUTCMonth() < date.getUTCMonth() || today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate() ? 1 : 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== birthDate || age < 4 || age > 18) throw new Error('Enter a valid player birth date (ages 4 to 18).');
  const email = required(input, 'email', 'preferred email address', 254).toLowerCase();
  const secondaryEmail = clean(input.secondaryEmail, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || secondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(secondaryEmail)) throw new Error('Enter valid email addresses.');
  const phone = required(input, 'phone', 'primary phone number', 30), secondaryPhone = clean(input.secondaryPhone, 30);
  if (!/^[+\d()\s.-]{7,30}$/.test(phone) || secondaryPhone && !/^[+\d()\s.-]{7,30}$/.test(secondaryPhone)) throw new Error('Enter valid phone numbers.');
  if (input.waiverAccepted !== true) throw new Error('Agree to the Participation Waiver and Release before submitting.');
  if (typeof input.photoPermission !== 'boolean') throw new Error('Choose your media permission.');
  const application = {
    playerFirstName, playerLastName, guardianFirstName, guardianLastName,
    club: clean(input.club), playingLevel: choice(input, 'playingLevel', PLAYING_LEVELS, 'current playing level'), positions: multiple(input, 'positions', POSITIONS, 'at least one preferred soccer position'), goals: clean(input.goals, 2000), existingParticipant: choice(input, 'existingParticipant', ['Yes', 'No'], 'existing participant status'),
  };
  if (['supplemental-training', 'camps-clinics', 'international-experiences'].includes(type)) {
    application.jerseySize = choice(input, 'jerseySize', JERSEY_SIZES, 'jersey size');
    application.financialAssistance = choice(input, 'financialAssistance', ['Yes', 'No'], 'financial assistance selection');
  }
  if (type === 'financial-assistance' || application.financialAssistance === 'Yes') {
    application.financialNeed = required(input, 'financialNeed', 'why you are applying for assistance', 2000);
    application.assistanceType = choice(input, 'assistanceType', ASSISTANCE_TYPES, 'assistance type');
  }
  if (type === 'private-training') {
    application.trainingFocus = multiple(input, 'trainingFocus', PRIVATE_FOCUS, 'at least one training focus');
    application.preferredSchedule = clean(input.preferredSchedule, 2000);
    application.sessionFrequency = choice(input, 'sessionFrequency', SESSION_FREQUENCIES, 'session frequency');
  } else if (type === 'mentorship') {
    application.mentorshipFocus = multiple(input, 'mentorshipFocus', MENTORSHIP_FOCUS, 'at least one area of guidance');
    application.mentorshipGoals = clean(input.mentorshipGoals, 2000);
    application.meetingFormat = choice(input, 'meetingFormat', MEETING_FORMATS, 'meeting format');
  } else if (type === 'camps-clinics') {
    const camp = camps.find(item => item.id === input.campId && ['open', 'full'].includes(item.status));
    if (!camp) throw new Error('Select an available camp or clinic.');
    Object.assign(application, { campId: camp.id, campName: camp.name, campStatus: camp.status });
  } else if (type === 'international-experiences') {
    application.trip = required(input, 'trip', 'the trip you are interested in');
    application.guardianTravel = choice(input, 'guardianTravel', ['Yes', 'No'], 'parent/guardian travel interest');
  }
  return { participantName: `${playerFirstName} ${playerLastName}`, guardianName: `${guardianFirstName} ${guardianLastName}`, email, secondaryEmail, phone, secondaryPhone, birthDate, age, gender: choice(input, 'gender', ['Boy', 'Girl'], 'gender'), address: required(input, 'address', 'address', 250), city: required(input, 'city', 'city'), state: required(input, 'state', 'state'), zip: required(input, 'zip', 'ZIP code', 20), comments: clean(input.comments, 2000), waiverAccepted: true, waiverVersion: WAIVER_VERSION, consentMethod: 'checkbox', agreementDate: today.toISOString(), photoPermission: input.photoPermission, applicationType: type, application };
}
