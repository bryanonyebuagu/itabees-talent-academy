export const JERSEY_SIZES = ['3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', 'Other'];
export const PLAYING_LEVELS = ['New to soccer', 'Recreational', 'Competitive', 'Other'];
export const POSITIONS = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Unsure'];
export const PRIVATE_FOCUS = ['First touch and ball control', 'Dribbling', 'Passing and receiving', 'Shooting and finishing', 'Position-specific skills', 'Unsure'];
export const MENTORSHIP_FOCUS = ['Confidence', 'Setting goals', 'Training habits', 'Balancing school and soccer', 'College recruiting', 'Preparing for the next level', 'Unsure'];
export const ASSISTANCE_TYPES = ['Reduced program fee', 'Payment plan', 'Full fee assistance', 'Unsure'];
export const SESSION_FREQUENCIES = ['One session', 'Weekly', 'Every other week', 'Unsure'];
export const MEETING_FORMATS = ['Virtual', 'In person', 'Either'];
// Dates and any fees are confirmed by the academy. Mark a session "full" to accept waitlist entries.
export const CAMP_SESSIONS = [
  { id: 'soccer-camp', name: 'Soccer Camp', status: 'open' },
  { id: 'soccer-clinic', name: 'Soccer Clinic', status: 'open' },
];
export const FORM_TYPES = {
  'supplemental-training': { title: 'Supplemental Training Enrollment', button: 'Continue to Payment', description: 'Complete your player and parent information, then continue to secure monthly payment. Applying for assistance sends your application to academy review without payment.' },
  'financial-assistance': { title: 'Financial Assistance Application', button: 'Submit Assistance Application', description: 'Apply before paying. Your application goes directly to academy review and requires no payment.' },
  'private-training': { title: 'Private Training Request', button: 'Request Private Training', description: 'Tell us what your player wants to work on. This is a request; the academy will email you to discuss availability and next steps. No payment is collected here.' },
  mentorship: { title: 'Private Player Mentorship Application', button: 'Apply for Mentorship', description: 'Share the guidance your player needs. The academy will review your application and follow up by email. No payment is collected here.' },
  'camps-clinics': { title: 'Camps & Clinics Registration', button: 'Register for Camp or Clinic', description: 'Choose a camp or clinic and register your player. The academy will follow up with session details and any applicable payment instructions. Full sessions accept waitlist entries.' },
  'international-experiences': { title: 'International Soccer & Cultural Experiences Interest Form', button: 'Submit Travel Interest', description: 'Tell us which trip interests your family. This is an interest form, not a confirmed booking or payment.' },
};
export const REQUEST_RECEIVED = 'Your request has been received! Thank you for your interest in ITABEES Talent Academy. Our team will review your request and follow up by email with next steps.';
export const ASSISTANCE_RECEIVED = 'Your application for financial assistance has been received! We will review the application within 5 to 7 business days, and a team member will reach out to discuss next steps.';
export const WAIVER_VERSION = '2026-11-28';
export function formTypeForProgram(program) {
  return program?.duration === 'Monthly' ? 'supplemental-training' : program?.id === 'player-mentorship' ? 'mentorship' : 'private-training';
}
export const initialApplication = {
  playerFirstName: '', playerLastName: '', birthDate: '', gender: '', club: '', playingLevel: '', positions: [], goals: '', existingParticipant: '', comments: '',
  guardianFirstName: '', guardianLastName: '', email: '', secondaryEmail: '', phone: '', secondaryPhone: '', address: '', city: '', state: '', zip: '',
  jerseySize: '', financialAssistance: '', financialNeed: '', assistanceType: '', trainingFocus: [], preferredSchedule: '', sessionFrequency: '', mentorshipFocus: [], mentorshipGoals: '', meetingFormat: '', campId: '', trip: '', guardianTravel: '', waiverAccepted: false, photoPermission: false,
};
