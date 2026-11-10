const nextDate = (daysAhead) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
};

export const demoPeople = {
  guardians: [
    { id: 'guardian-1', name: 'Nia Brooks', email: 'nia.brooks@example.com', phone: '(704) 555-0142', playerIds: ['player-1'], joined: nextDate(-64), lastContact: 'Programme welcome email · 2 days ago' },
    { id: 'guardian-2', name: 'Sofia Okafor', email: 'sofia.okafor@example.com', phone: '(704) 555-0188', playerIds: ['player-2'], joined: nextDate(-42), lastContact: 'Schedule enquiry · 5 days ago' },
    { id: 'guardian-3', name: 'Marcus Rivera', email: 'marcus.rivera@example.com', phone: '(980) 555-0126', playerIds: ['player-3'], joined: nextDate(-21), lastContact: 'Registration update · 1 week ago' },
  ],
  players: [
    { id: 'player-1', name: 'Daniel Brooks', initials: 'DB', ageGroup: 'U14', dateOfBirth: '2012-06-18', programmeIds: ['programme-1', 'programme-3'], groupId: 'group-1', guardianId: 'guardian-1', coachId: 'coach-1', status: 'Active', registered: nextDate(-64), note: 'Confident on the ball. Focus this block: receiving under pressure and scanning before the first touch.' },
    { id: 'player-2', name: 'Amara Okafor', initials: 'AO', ageGroup: 'U12', dateOfBirth: '2014-03-09', programmeIds: ['programme-2'], groupId: 'group-2', guardianId: 'guardian-2', coachId: 'coach-2', status: 'Active', registered: nextDate(-42), note: 'Excellent passing range. Continue developing decision-making in small-sided games.' },
    { id: 'player-3', name: 'Leo Rivera', initials: 'LR', ageGroup: 'U16', dateOfBirth: '2010-10-27', programmeIds: ['programme-3'], groupId: 'group-3', guardianId: 'guardian-3', coachId: 'coach-3', status: 'Pending', registered: nextDate(-21), note: 'Assessment planned. Build an individual development focus after the first session.' },
  ],
};

export const initialProgrammes = [
  { id: 'programme-1', name: 'Youth Development', category: 'Technical', ageGroup: 'U13–U15', description: 'Purposeful small-group work on ball mastery, decision-making and confidence.', locationId: 'location-1', duration: '12-week block', days: 'Monday · Thursday', coachIds: ['coach-1'], capacity: 24, enrolled: 18, status: 'Active', accent: 'lemon' },
  { id: 'programme-2', name: 'Foundation Skills', category: 'Foundations', ageGroup: 'U10–U12', description: 'A supportive introduction to strong habits, first touch and game understanding.', locationId: 'location-2', duration: '10-week block', days: 'Tuesday · Saturday', coachIds: ['coach-2'], capacity: 20, enrolled: 14, status: 'Active', accent: 'cyan' },
  { id: 'programme-3', name: 'Performance Pathway', category: 'Advanced', ageGroup: 'U14–U18', description: 'Individual feedback and higher-intensity training for ambitious players.', locationId: 'location-1', duration: '16-week block', days: 'Wednesday · Friday', coachIds: ['coach-3', 'coach-1'], capacity: 16, enrolled: 11, status: 'Open', accent: 'violet' },
];

export const coaches = [
  { id: 'coach-1', name: 'Marcus Thorne', initials: 'MT', specialty: 'Technical development', email: 'marcus.thorne@example.com', programmeIds: ['programme-1', 'programme-3'], groupIds: ['group-1'], image: 'coachMarcus' },
  { id: 'coach-2', name: 'Elena Rodriguez', initials: 'ER', specialty: 'Foundation coaching', email: 'elena.rodriguez@example.com', programmeIds: ['programme-2'], groupIds: ['group-2'], image: 'coachElena' },
  { id: 'coach-3', name: 'David Chen', initials: 'DC', specialty: 'Performance pathway', email: 'david.chen@example.com', programmeIds: ['programme-3'], groupIds: ['group-3'], image: 'coachDavid' },
];

export const groups = [
  { id: 'group-1', name: 'U14 Development', ageGroup: 'U14', programmeId: 'programme-1', coachId: 'coach-1' },
  { id: 'group-2', name: 'U12 Foundation', ageGroup: 'U12', programmeId: 'programme-2', coachId: 'coach-2' },
  { id: 'group-3', name: 'U16 Performance', ageGroup: 'U16', programmeId: 'programme-3', coachId: 'coach-3' },
];

export const locations = [
  { id: 'location-1', name: 'North Field', area: 'Charlotte, NC' },
  { id: 'location-2', name: 'Academy Training Ground', area: 'Charlotte, NC' },
  { id: 'location-3', name: 'Indoor Performance Studio', area: 'Charlotte, NC' },
];

export const initialSessions = [
  { id: 'session-1', title: 'Technical Development', programmeId: 'programme-1', groupId: 'group-1', coachId: 'coach-1', locationId: 'location-1', date: nextDate(1), start: '09:00', end: '10:30', description: 'First touch, passing patterns and receiving under pressure.' },
  { id: 'session-2', title: 'Tactical Training', programmeId: 'programme-1', groupId: 'group-1', coachId: 'coach-1', locationId: 'location-1', date: nextDate(3), start: '11:00', end: '12:30', description: 'Shape, movement and decisions in small-sided games.' },
  { id: 'session-3', title: 'Foundation Ball Mastery', programmeId: 'programme-2', groupId: 'group-2', coachId: 'coach-2', locationId: 'location-2', date: nextDate(2), start: '10:00', end: '11:15', description: 'Dribbling, control and confidence with both feet.' },
  { id: 'session-4', title: 'Performance Assessment', programmeId: 'programme-3', groupId: 'group-3', coachId: 'coach-3', locationId: 'location-1', date: nextDate(4), start: '15:00', end: '16:30', description: 'Individual feedback through competitive scenarios.' },
  { id: 'session-5', title: 'Individual Player Development', programmeId: 'programme-3', groupId: 'group-1', coachId: 'coach-1', locationId: 'location-3', date: nextDate(5), start: '14:00', end: '15:15', description: 'Targeted work on movement, scanning and execution.' },
  { id: 'session-6', title: 'Weekend Skills Lab', programmeId: 'programme-2', groupId: 'group-2', coachId: 'coach-2', locationId: 'location-2', date: nextDate(6), start: '09:30', end: '11:00', description: 'Play-based technical challenges and team games.' },
];

export const initialEvents = [
  { id: 'event-1', title: 'Player Development Clinic', description: 'A focused clinic with technical stations and individual feedback.', date: nextDate(8), start: '10:00', end: '13:00', locationId: 'location-1', programmeIds: ['programme-1', 'programme-2'], registered: 21, capacity: 32, status: 'Upcoming', image: 'camp' },
  { id: 'event-2', title: 'College Pathway Workshop', description: 'An introduction to academics, preparation and the college soccer journey.', date: nextDate(15), start: '16:00', end: '18:00', locationId: 'location-3', programmeIds: ['programme-3'], registered: 12, capacity: 24, status: 'Upcoming', image: 'academy' },
  { id: 'event-3', title: 'Community Skills Day', description: 'A welcoming day of football and mentorship for local players.', date: nextDate(-18), start: '09:00', end: '12:00', locationId: 'location-2', programmeIds: ['programme-1', 'programme-2'], registered: 29, capacity: 30, status: 'Past', image: 'camp' },
];

export const eventRegistrations = [
  { eventId: 'event-1', playerId: 'player-1', status: 'Registered' },
  { eventId: 'event-1', playerId: 'player-2', status: 'Interested' },
  { eventId: 'event-2', playerId: 'player-3', status: 'Registered' },
  { eventId: 'event-3', playerId: 'player-1', status: 'Attended' },
];

export const initialEnquiries = [
  { id: 'enquiry-1', name: 'Olivia Carter', email: 'olivia.carter@example.com', category: 'Parent', subject: 'U12 training availability', message: 'My daughter would love to join a foundation group. Could you share the next available training block and what to bring for an assessment?', date: nextDate(-1), status: 'New' },
  { id: 'enquiry-2', name: 'Michael Reed', email: 'michael.reed@example.com', category: 'Partner', subject: 'Community clinic collaboration', message: 'Our community centre is exploring a youth football clinic. I would like to learn how we could collaborate with the academy.', date: nextDate(-2), status: 'In Progress' },
  { id: 'enquiry-3', name: 'Ava Thompson', email: 'ava.thompson@example.com', category: 'Player', subject: 'Performance Pathway', message: 'I am interested in the performance programme and would like more information about age groups and assessments.', date: nextDate(-4), status: 'New' },
  { id: 'enquiry-4', name: 'James Walker', email: 'james.walker@example.com', category: 'Volunteer', subject: 'Helping at events', message: 'I would like to volunteer at future community events. Please let me know how I can get involved.', date: nextDate(-9), status: 'Resolved' },
];

export const donations = [
  { id: 'donation-1', donor: 'Jordan Miller', email: 'jordan.miller@example.com', amount: 100, frequency: 'One-time', status: 'Completed', date: nextDate(-2) },
  { id: 'donation-2', donor: 'Taylor Adams', email: 'taylor.adams@example.com', amount: 50, frequency: 'Monthly', status: 'Completed', date: nextDate(-6) },
  { id: 'donation-3', donor: 'Anonymous supporter', email: '—', amount: 250, frequency: 'One-time', status: 'Pending', date: nextDate(-10) },
];

export const initialMessages = [
  { id: 'message-1', from: 'Nia Brooks', email: 'nia.brooks@example.com', to: 'Academy team', subject: 'Thursday training', body: 'Could you confirm the location for Thursday’s session? Daniel is excited to attend.', date: nextDate(-1), folder: 'Inbox', read: false },
  { id: 'message-2', from: 'Sofia Okafor', email: 'sofia.okafor@example.com', to: 'Academy team', subject: 'Foundation Skills', body: 'Thank you for sharing Amara’s training notes. We will keep working on the first-touch exercises.', date: nextDate(-3), folder: 'Inbox', read: true },
  { id: 'message-3', from: 'Academy team', email: 'academy@example.com', to: 'Marcus Rivera', subject: 'Welcome to ItaBEES', body: 'Thanks for your interest in the Performance Pathway. We will share the next assessment details soon.', date: nextDate(-5), folder: 'Sent', read: true },
];

export const staff = [
  { id: 'staff-1', name: 'Amina Johnson', initials: 'AJ', role: 'Super Admin', email: 'amina.johnson@example.com', status: 'Active', permissions: 'All areas' },
  { id: 'staff-2', name: 'Marcus Thorne', initials: 'MT', role: 'Administrator', email: 'marcus.thorne@example.com', status: 'Active', permissions: 'Players, training, timetable' },
  { id: 'staff-3', name: 'Elena Rodriguez', initials: 'ER', role: 'Staff', email: 'elena.rodriguez@example.com', status: 'Invited', permissions: 'Training view, attendance' },
];

export const attendance = [
  { id: 'attendance-1', playerId: 'player-1', sessionId: 'session-1', date: nextDate(-7), status: 'Present' },
  { id: 'attendance-2', playerId: 'player-1', sessionId: 'session-2', date: nextDate(-10), status: 'Present' },
  { id: 'attendance-3', playerId: 'player-1', sessionId: 'session-5', date: nextDate(-14), status: 'Excused' },
  { id: 'attendance-4', playerId: 'player-2', sessionId: 'session-3', date: nextDate(-7), status: 'Present' },
  { id: 'attendance-5', playerId: 'player-2', sessionId: 'session-6', date: nextDate(-14), status: 'Absent' },
  { id: 'attendance-6', playerId: 'player-3', sessionId: 'session-4', date: nextDate(-8), status: 'Present' },
];

export const initialNotifications = [
  { id: 'notice-1', playerId: 'player-1', type: 'Schedule', title: 'Training schedule updated', body: 'Your next Youth Development session is ready to view.', date: nextDate(-1), read: false },
  { id: 'notice-2', playerId: 'player-1', type: 'Event', title: 'New clinic announced', body: 'The Player Development Clinic is open for your programme.', date: nextDate(-2), read: false },
  { id: 'notice-3', playerId: 'player-2', type: 'Programme', title: 'Foundation Skills update', body: 'Your weekend skills lab has been added to the schedule.', date: nextDate(-2), read: false },
  { id: 'notice-4', playerId: 'player-3', type: 'Registration', title: 'Assessment preview', body: 'A performance assessment is visible in your demo schedule.', date: nextDate(-3), read: true },
];

export const formatDate = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) => new Intl.DateTimeFormat('en-US', options).format(new Date(`${value}T12:00:00`));
export const formatTime = (value) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${value}:00`));
export const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const byDate = (a, b) => `${a.date}T${a.start || '00:00'}`.localeCompare(`${b.date}T${b.start || '00:00'}`);
export const memberSessions = (player, sessions) => sessions.filter((session) => player.programmeIds.includes(session.programmeId) && session.groupId === player.groupId).sort(byDate);
export const memberEvents = (player, events) => events.filter((event) => event.programmeIds.some((id) => player.programmeIds.includes(id))).sort(byDate);
