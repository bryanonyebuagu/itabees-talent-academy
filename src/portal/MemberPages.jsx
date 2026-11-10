import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { media } from '../data/media';
import { attendance, eventRegistrations, formatDate, formatTime, memberEvents, memberSessions } from './demoData';
import { coachName, groupName, locationName, programmeName } from './selectors';
import PortalIcon from './PortalIcon';
import { Avatar, EmptyState, Metric, PageHeading, Panel, Status } from './PortalUI';
import PortalSchedule, { SessionList } from './PortalSchedule';
import useDemo from './useDemo';
import ProfileSettings from './ProfileSettings';

const useCurrentPlayer = () => {
  const { players, selectedPlayerId } = useDemo();
  return players.find((item) => item.id === selectedPlayerId) || players[0];
};

export function MemberOverview() {
  const player = useCurrentPlayer();
  const { programmes, sessions, events, notifications } = useDemo();
  const playerSessions = memberSessions(player, sessions);
  const playerEvents = memberEvents(player, events).filter((event) => event.status === 'Upcoming');
  const notices = notifications.filter((item) => item.playerId === player.id);
  const next = playerSessions[0];
  return <><section className="portal-member-hero"><div className="portal-member-hero-copy"><span className="portal-eyebrow">YOUR ITABEES JOURNEY</span><h1>Welcome back, {player.name.split(' ')[0]}.</h1><p>Here’s what’s happening with your development journey. Your view is connected to your demo programmes and training group.</p><Link className="portal-button portal-button-primary" to="/dashboard/schedule"><PortalIcon name="calendar" size={17}/> View my schedule</Link></div><img src={media.training} alt="ItaBEES player training with the ball"/></section>
    <div className="portal-metrics"><Metric label="Enrolled programmes" value={player.programmeIds.length} detail={player.ageGroup} icon="programmes"/><Metric label="Next training" value={next ? formatDate(next.date, { month:'short', day:'numeric' }) : '—'} detail={next ? `${formatTime(next.start)} · ${next.title}` : 'No scheduled sessions'} icon="timetable"/><Metric label="Upcoming events" value={playerEvents.length} detail="Matched to your programmes" icon="events"/><Metric label="Unread notices" value={notices.filter((item) => !item.read).length} detail="In your notification centre" icon="bell"/></div>
    <div className="portal-grid portal-grid-wide"><Panel eyebrow="THIS WEEK" title="Upcoming training" action={<Link to="/dashboard/schedule">Full schedule →</Link>}><SessionList sessions={playerSessions.slice(0, 3)} programmes={programmes} compact/></Panel><Panel eyebrow="PLAYER SNAPSHOT" title={player.name}><div className="portal-profile-head"><Avatar initials={player.initials} size="large"/><div><h2>{player.ageGroup} player</h2><p>{groupName(player.groupId)}</p><Status value={player.status}/></div></div><dl className="portal-detail-list"><div><dt>Coach</dt><dd>{coachName(player.coachId)}</dd></div><div><dt>Programmes</dt><dd>{player.programmeIds.map((id) => programmeName(id, programmes)).join(', ')}</dd></div></dl></Panel></div>
    <div className="portal-grid portal-grid-2 portal-section-gap"><Panel eyebrow="ON YOUR HORIZON" title="Upcoming events" action={<Link to="/dashboard/events">All events →</Link>}>{playerEvents.length ? <ul className="portal-list">{playerEvents.map((event) => <li key={event.id}><span className="portal-list-icon"><PortalIcon name="events" size={17}/></span><div><h3>{event.title}</h3><p>{locationName(event.locationId)} · {formatTime(event.start)}</p></div><time>{formatDate(event.date, { month:'short',day:'numeric' })}</time></li>)}</ul> : <EmptyState title="No matching events" body="Events for your enrolled programmes will appear here."/>}</Panel><Panel eyebrow="ACADEMY UPDATES" title="Announcements & notices" action={<Link to="/dashboard/notifications">All notices →</Link>}><div className="portal-announcement"><PortalIcon name="spark" size={18}/><span>Keep showing up, keep learning. Your next training session is visible in your schedule.</span></div><ul className="portal-list">{notices.slice(0,2).map((notice) => <li key={notice.id}><span className="portal-list-icon"><PortalIcon name="bell" size={16}/></span><div><h3>{notice.title}</h3><p>{notice.body}</p></div></li>)}</ul></Panel></div>
    <div className="portal-quick-actions portal-section-gap"><Link to="/dashboard/my-programmes"><PortalIcon name="programmes" size={19}/> My programmes <PortalIcon name="arrow" size={16}/></Link><Link to="/dashboard/attendance"><PortalIcon name="check" size={19}/> Attendance <PortalIcon name="arrow" size={16}/></Link><Link to="/dashboard/profile"><PortalIcon name="user" size={19}/> Player profile <PortalIcon name="arrow" size={16}/></Link></div>
  </>;
}

export function MemberProgrammes() {
  const player = useCurrentPlayer();
  const { programmes, sessions } = useDemo();
  const enrolled = programmes.filter((item) => player.programmeIds.includes(item.id));
  return <><PageHeading eyebrow="MY DEVELOPMENT / PROGRAMMES" title="My programmes" description={`Showing programmes linked to ${player.name}'s demo enrolments.`}/><div className="portal-grid portal-grid-2">{enrolled.map((item) => { const next = memberSessions(player, sessions).find((session) => session.programmeId === item.id); return <article className={`portal-card portal-programme-card accent-${item.accent}`} key={item.id}><div className="portal-card-top"><span className="portal-eyebrow">{item.category} · {item.ageGroup}</span><Status value={player.status}/></div><h2>{item.name}</h2><p>{item.description}</p><div className="portal-card-meta"><span><PortalIcon name="coaches" size={13}/>{item.coachIds.map(coachName).join(', ')}</span><span><PortalIcon name="location" size={13}/>{locationName(item.locationId)}</span><span><PortalIcon name="calendar" size={13}/>{item.days}</span><span>{item.duration}</span></div><div className="portal-card-foot"><span className="portal-small portal-muted">Next: {next ? `${formatDate(next.date, { month:'short', day:'numeric' })} · ${formatTime(next.start)}` : 'To be scheduled'}</span><Link className="portal-inline-link portal-small" to={`/dashboard/my-programmes/${item.id}`}>View programme →</Link></div></article>; })}</div>{!enrolled.length && <EmptyState title="No demo enrolments" body="Choose another preview player from the top bar."/>}</>;
}

export function MemberProgrammeDetail() {
  const player = useCurrentPlayer();
  const { programmeId } = useParams();
  const { programmes, sessions } = useDemo();
  const programme = programmes.find((item) => item.id === programmeId && player.programmeIds.includes(item.id));
  if (!programme) return <EmptyState title="Programme not available" body="This programme is not part of the selected player's demo enrolments."/>;
  const matching = memberSessions(player, sessions).filter((item) => item.programmeId === programme.id);
  return <><Link className="portal-inline-link portal-small" to="/dashboard/my-programmes">← My programmes</Link><PageHeading eyebrow="MY PROGRAMME" title={programme.name} description={programme.description}/><div className="portal-grid portal-grid-2"><Panel title="At a glance"><dl className="portal-detail-list"><div><dt>Registration status</dt><dd><Status value={player.status}/></dd></div><div><dt>Age group</dt><dd>{programme.ageGroup}</dd></div><div><dt>Coach</dt><dd>{programme.coachIds.map(coachName).join(', ')}</dd></div><div><dt>Training location</dt><dd>{locationName(programme.locationId)}</dd></div><div><dt>Training days</dt><dd>{programme.days}</dd></div><div><dt>Duration</dt><dd>{programme.duration}</dd></div></dl></Panel><Panel title="Your next sessions"><SessionList sessions={matching.slice(0, 3)} programmes={programmes} compact/></Panel></div></>;
}

export function MemberSchedule() {
  const player = useCurrentPlayer();
  const { programmes, sessions } = useDemo();
  const matching = memberSessions(player, sessions);
  return <><PageHeading eyebrow="MY DEVELOPMENT / TRAINING" title="Training schedule" description={`${player.name}'s personalised schedule, filtered by enrolled programme and ${groupName(player.groupId)}.`}/><Panel eyebrow="YOUR TIMETABLE" title="Upcoming sessions"><PortalSchedule sessions={matching} programmes={programmes} initialView="Week" views={['Week','Day','List']}/></Panel><p className="portal-hint">This view uses the same demo timetable records as the admin builder. Different preview players have different schedules.</p></>;
}

export function MemberEvents() {
  const player = useCurrentPlayer();
  const { events, programmes } = useDemo();
  const related = memberEvents(player, events);
  return <><PageHeading eyebrow="MY ACADEMY / EVENTS" title="Events for you" description={`Events linked to ${player.name}'s enrolled programmes.`}/><div className="portal-grid portal-grid-2">{related.map((event) => <article className="portal-card portal-programme-card" key={event.id}><div className="portal-event-photo"><img src={event.image === 'academy' ? media.education : media.camp} alt="Football academy activity"/></div><div className="portal-card-top"><span className="portal-eyebrow">{formatDate(event.date)} · {formatTime(event.start)}</span><Status value={event.status}/></div><h2>{event.title}</h2><p>{event.description}</p><div className="portal-card-meta"><span><PortalIcon name="location" size={13}/>{locationName(event.locationId)}</span><span>{event.programmeIds.map((id) => programmeName(id, programmes)).join(', ')}</span><span>Registration: {eventRegistrations.find((item) => item.eventId === event.id && item.playerId === player.id)?.status || 'Not registered'}</span></div></article>)}</div>{!related.length && <EmptyState title="No matching events" body="Events for your programmes will appear here when the academy schedules them."/>}</>;
}

export function MemberProfile() {
  const player = useCurrentPlayer();
  const { guardians, programmes } = useDemo();
  const guardian = guardians.find((item) => item.id === player.guardianId);
  return <><PageHeading eyebrow="MY ACCOUNT / PROFILE" title="Player profile" description="Player information, development focus and parent or guardian contact details."/>
    <div className="portal-grid portal-profile-grid"><Panel title="Player Information"><div className="portal-profile-head"><Avatar initials={player.initials} size="large"/><div><h2>{player.name}</h2><p>{player.ageGroup} · {groupName(player.groupId)}</p><Status value={player.status}/></div></div><dl className="portal-detail-list"><div><dt>Date of birth</dt><dd>{formatDate(player.dateOfBirth)}</dd></div><div><dt>Assigned coach</dt><dd>{coachName(player.coachId)}</dd></div><div><dt>Enrolled programmes</dt><dd>{player.programmeIds.map((id) => programmeName(id, programmes)).join(', ')}</dd></div><div><dt>Training group</dt><dd>{groupName(player.groupId)}</dd></div></dl></Panel>
      <Panel title="Parent / Guardian Contact"><dl className="portal-detail-list"><div><dt>Name</dt><dd>{guardian?.name}</dd></div><div><dt>Email</dt><dd>{guardian?.email}</dd></div><div><dt>Phone</dt><dd>{guardian?.phone}</dd></div></dl><p className="portal-hint">Fictional demo contact details. Email and phone can be updated below for this session.</p></Panel></div>
    <Panel title="Profile Settings" eyebrow="MANAGE YOUR DETAILS" className="portal-section-gap"><p className="portal-small portal-muted">Update each detail independently. Changes are temporary and reset when the page reloads.</p><ProfileSettings key={player.id} player={player} guardian={guardian}/></Panel>
    <div className="portal-grid portal-grid-2 portal-section-gap"><Panel title="Development overview"><p className="portal-small portal-muted">Current coach focus</p><p className="portal-detail-message">{player.note}</p><p className="portal-hint">A detailed development plan can be connected when real records are available.</p></Panel><Panel title="Attendance snapshot"><p className="portal-small portal-muted">Illustrative attendance history is available in its own section.</p><Link className="portal-inline-link portal-small" to="/dashboard/attendance">View attendance →</Link></Panel></div></>;
}

export function MemberAttendance() {
  const player = useCurrentPlayer();
  const { programmes, sessions } = useDemo();
  const records = attendance.filter((item) => item.playerId === player.id);
  return <><PageHeading eyebrow="MY DEVELOPMENT / ATTENDANCE" title="Attendance history" description={`Illustrative records for ${player.name}. Attendance does not update live in this demo.`}/><div className="portal-metrics"><Metric label="Present" value={records.filter((item) => item.status === 'Present').length} detail="Training sessions" icon="check"/><Metric label="Absent" value={records.filter((item) => item.status === 'Absent').length} detail="Training sessions" icon="clock"/><Metric label="Excused" value={records.filter((item) => item.status === 'Excused').length} detail="Training sessions" icon="calendar"/></div><Panel title="Session history"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Date</th><th>Session</th><th>Programme</th><th>Status</th></tr></thead><tbody>{records.map((record) => { const session = sessions.find((item) => item.id === record.sessionId); return <tr key={record.id}><td>{formatDate(record.date)}</td><td>{session?.title || 'Training session'}</td><td>{programmeName(session?.programmeId, programmes)}</td><td><Status value={record.status}/></td></tr>; })}</tbody></table></div></Panel></>;
}

export function MemberNotifications() {
  const player = useCurrentPlayer();
  const { notifications, markNotificationRead } = useDemo();
  const [filter, setFilter] = useState('All');
  const related = notifications.filter((item) => item.playerId === player.id);
  const visible = related.filter((item) => filter === 'All' || !item.read);
  return <><PageHeading eyebrow="MY ACADEMY / NOTIFICATIONS" title="Notifications" description="Schedule, event, programme and registration updates in one calm place."/><div className="portal-toolbar"><div className="portal-segmented">{['All','Unread'].map((item) => <button key={item} className={filter === item ? 'is-selected' : ''} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div><span className="portal-small portal-muted">{related.filter((item) => !item.read).length} unread</span></div>{visible.map((notice) => <article className={`portal-notice ${notice.read ? '' : 'is-unread'}`} key={notice.id}><span className="portal-list-icon"><PortalIcon name={notice.type === 'Event' ? 'events' : notice.type === 'Schedule' ? 'timetable' : 'bell'} size={18}/></span><div><h3>{notice.title}</h3><p>{notice.body}</p><small>{notice.type} · {formatDate(notice.date)}</small></div>{!notice.read && <button type="button" className="portal-button portal-button-secondary" onClick={() => markNotificationRead(notice.id)}>Mark read</button>}</article>)}{!visible.length && <EmptyState title="All caught up" body="New demo notices for this player will appear here."/>}</>;
}
