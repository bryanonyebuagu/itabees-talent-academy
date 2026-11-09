import { useMemo, useState } from 'react';
import { DemoContext } from './DemoContext';
import { demoPeople, initialEnquiries, initialEvents, initialMessages, initialNotifications, initialProgrammes, initialSessions } from './demoData';

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

export default function DemoProvider({ children }) {
  const [programmes, setProgrammes] = useState(initialProgrammes);
  const [sessions, setSessions] = useState(initialSessions);
  const [events, setEvents] = useState(initialEvents);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [messages, setMessages] = useState(initialMessages);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedPlayerId, setSelectedPlayerId] = useState(demoPeople.players[0].id);

  const value = useMemo(() => ({
    programmes, sessions, events, enquiries, messages, notifications, selectedPlayerId, setSelectedPlayerId,
    saveProgramme: (programme) => setProgrammes((items) => programme.id ? items.map((item) => item.id === programme.id ? { ...item, ...programme } : item) : [...items, { ...programme, id: createId('programme'), enrolled: 0, accent: 'lemon' }]),
    saveSession: (session) => setSessions((items) => session.id ? items.map((item) => item.id === session.id ? { ...item, ...session } : item) : [...items, { ...session, id: createId('session') }]),
    removeSession: (id) => setSessions((items) => items.filter((item) => item.id !== id)),
    saveEvent: (event) => setEvents((items) => event.id ? items.map((item) => item.id === event.id ? { ...item, ...event } : item) : [...items, { ...event, id: createId('event'), registered: 0, image: 'camp' }]),
    setEnquiryStatus: (id, status) => setEnquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item)),
    markMessageRead: (id) => setMessages((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
    sendDemoMessage: (message) => setMessages((items) => [{ ...message, id: createId('message'), from: 'Academy team', email: 'academy@example.com', date: new Date().toISOString().slice(0, 10), folder: 'Sent', read: true }, ...items]),
    markNotificationRead: (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
  }), [programmes, sessions, events, enquiries, messages, notifications, selectedPlayerId]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
