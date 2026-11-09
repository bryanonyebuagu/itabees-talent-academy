import { useMemo, useState } from 'react';
import { DemoContext } from './DemoContext';
import { demoPeople, initialEnquiries, initialEvents, initialMessages, initialNotifications, initialProgrammes, initialSessions } from './demoData';
import useToast from './useToast';

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

export default function DemoProvider({ children }) {
  const notify = useToast();
  const [players, setPlayers] = useState(demoPeople.players);
  const [guardians, setGuardians] = useState(demoPeople.guardians);
  const [programmes, setProgrammes] = useState(initialProgrammes);
  const [sessions, setSessions] = useState(initialSessions);
  const [events, setEvents] = useState(initialEvents);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [messages, setMessages] = useState(initialMessages);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedPlayerId, setSelectedPlayerId] = useState(demoPeople.players[0].id);

  const value = useMemo(() => ({
    players, guardians, programmes, sessions, events, enquiries, messages, notifications, selectedPlayerId, setSelectedPlayerId,
    updatePlayer: (id, changes, message) => { setPlayers((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item)); notify({ title:message?.title || 'Player Information Updated', description:message?.description || 'The player’s information has been updated in this demo.' }); },
    updateGuardian: (id, changes, message) => { setGuardians((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item)); notify({ title:message?.title || 'Guardian Information Updated', description:message?.description || 'The parent or guardian’s contact information has been updated in this demo.' }); },
    saveProgramme: (programme) => { setProgrammes((items) => programme.id ? items.map((item) => item.id === programme.id ? { ...item, ...programme } : item) : [...items, { ...programme, id: createId('programme'), enrolled: 0, accent: 'lemon' }]); notify({ title:programme.id ? 'Programme Updated' : 'Programme Created', description:`${programme.name} has been ${programme.id ? 'updated' : 'created'} in the demo.` }); },
    saveSession: (session) => { setSessions((items) => session.id ? items.map((item) => item.id === session.id ? { ...item, ...session } : item) : [...items, { ...session, id: createId('session') }]); notify({ title:session.id ? 'Session Updated' : 'Session Created', description:`${session.title} has been ${session.id ? 'updated' : 'added to the timetable'} in the demo.` }); },
    removeSession: (id) => { const session = sessions.find((item) => item.id === id); setSessions((items) => items.filter((item) => item.id !== id)); notify({ title:'Session Removed', description:`${session?.title || 'The session'} has been removed from the demo timetable.` }); },
    saveEvent: (event) => { setEvents((items) => event.id ? items.map((item) => item.id === event.id ? { ...item, ...event } : item) : [...items, { ...event, id: createId('event'), registered: 0, image: 'camp' }]); notify({ title:event.id ? 'Event Updated' : 'Event Created', description:`${event.title} has been ${event.id ? 'updated' : 'created'} in the demo.` }); },
    setEnquiryStatus: (id, status) => { setEnquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item)); notify({ title:'Enquiry Status Updated', description:`The enquiry is now ${status.toLowerCase()}.` }); },
    markMessageRead: (id) => setMessages((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
    sendDemoMessage: (message) => { setMessages((items) => [{ ...message, id: createId('message'), from: 'Academy team', email: 'academy@example.com', date: new Date().toISOString().slice(0, 10), folder: 'Sent', read: true }, ...items]); notify({ title:'Message Saved', description:'The message was saved to the demo Sent folder. No email was delivered.' }); },
    markNotificationRead: (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
  }), [players, guardians, programmes, sessions, events, enquiries, messages, notifications, selectedPlayerId, notify]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
