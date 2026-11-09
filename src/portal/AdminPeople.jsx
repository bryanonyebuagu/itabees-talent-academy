import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { attendance, demoPeople, formatDate, formatTime, memberEvents, memberSessions } from './demoData';
import { coachName, guardianName, groupName, locationName, programmeName } from './selectors';
import PortalIcon from './PortalIcon';
import { Avatar, EmptyState, PageHeading, Panel, Status } from './PortalUI';
import { SessionList } from './PortalSchedule';
import useDemo from './useDemo';

export function AdminEnquiries() {
  const { enquiries, setEnquiryStatus } = useDemo();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(enquiries[0]?.id);
  const filtered = enquiries.filter((item) => (filter === 'All' || item.status === filter) && `${item.name} ${item.email} ${item.subject} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const selected = enquiries.find((item) => item.id === selectedId);
  return <><PageHeading eyebrow="RELATIONSHIPS / ENQUIRIES" title="Enquiries" description="Review incoming interest and move each conversation through a clear response workflow."/>
    <div className="portal-metrics"><div className="portal-card"><span className="portal-muted portal-small">All enquiries</span><h2>{enquiries.length}</h2></div>{['New','In Progress','Resolved'].map((status) => <div className="portal-card" key={status}><span className="portal-muted portal-small">{status}</span><h2>{enquiries.filter((item) => item.status === status).length}</h2></div>)}</div>
    <div className="portal-toolbar"><label className="portal-search"><PortalIcon name="search" size={17}/><input aria-label="Search enquiries" placeholder="Search name, subject or email" value={query} onChange={(event) => setQuery(event.target.value)}/></label><select className="portal-select portal-filter-select" aria-label="Filter enquiries" value={filter} onChange={(event) => setFilter(event.target.value)}>{['All','New','In Progress','Resolved'].map((status) => <option key={status}>{status}</option>)}</select></div>
    <div className="portal-grid portal-grid-wide"><Panel eyebrow="INBOX" title={`${filtered.length} conversations`} className="portal-no-pad-mobile"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Contact</th><th>Category</th><th>Subject</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.email}</small></td><td>{item.category}</td><td>{item.subject}</td><td>{formatDate(item.date)}</td><td><Status value={item.status}/></td><td><button type="button" className="portal-icon-button" aria-label={`View enquiry from ${item.name}`} onClick={() => setSelectedId(item.id)}><PortalIcon name="eye" size={15}/></button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState title="No matching enquiries" body="Try another search or status filter."/>}</div></Panel>
      <Panel eyebrow="DETAILS" title={selected ? selected.subject : 'Select an enquiry'}>{selected ? <><div className="portal-profile-head"><Avatar initials={selected.name.split(' ').map((part) => part[0]).join('')}/><div><h2>{selected.name}</h2><p>{selected.email} · {selected.category}</p></div></div><p className="portal-small portal-muted">Submitted {formatDate(selected.date)}</p><p className="portal-detail-message">{selected.message}</p><label className="portal-field"><span>Update status</span><select className="portal-select" value={selected.status} onChange={(event) => setEnquiryStatus(selected.id, event.target.value)}>{['New','In Progress','Resolved'].map((status) => <option key={status}>{status}</option>)}</select></label><p className="portal-hint">Demo status changes reset when this page reloads.</p></> : <EmptyState title="Choose a conversation"/>}</Panel></div></>;
}

export function AdminPlayers() {
  const { programmes } = useDemo();
  const [query, setQuery] = useState('');
  const players = demoPeople.players.filter((player) => `${player.name} ${player.ageGroup} ${guardianName(player.guardianId)}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading eyebrow="PEOPLE / PLAYERS" title="Player profiles" description="Fictional player records structured around programmes, guardians, training groups and development notes."/>
    <div className="portal-toolbar"><label className="portal-search"><PortalIcon name="search" size={17}/><input aria-label="Search players" placeholder="Search player, group or guardian" value={query} onChange={(event) => setQuery(event.target.value)}/></label><span className="portal-muted portal-small">{players.length} demo players</span></div>
    <Panel title="Academy players"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Player</th><th>Age group</th><th>Programme</th><th>Training group</th><th>Guardian</th><th>Status</th><th></th></tr></thead><tbody>{players.map((player) => <tr key={player.id}><td><div className="portal-name-cell"><Avatar initials={player.initials}/><span><strong>{player.name}</strong><small>Registered {formatDate(player.registered)}</small></span></div></td><td>{player.ageGroup}</td><td>{player.programmeIds.map((id) => programmeName(id, programmes)).join(', ')}</td><td>{groupName(player.groupId)}</td><td>{guardianName(player.guardianId)}</td><td><Status value={player.status}/></td><td><Link className="portal-inline-link" to={`/admin/players/${player.id}`}>View profile</Link></td></tr>)}</tbody></table></div></Panel></>;
}

export function AdminPlayerDetail() {
  const { playerId } = useParams();
  const { programmes, sessions, events } = useDemo();
  const [tab, setTab] = useState('Overview');
  const player = demoPeople.players.find((item) => item.id === playerId);
  if (!player) return <EmptyState title="Player not found" body="Choose a fictional profile from the player list." />;
  const guardian = demoPeople.guardians.find((item) => item.id === player.guardianId);
  const playerSessions = memberSessions(player, sessions);
  const playerEvents = memberEvents(player, events);
  const records = attendance.filter((item) => item.playerId === player.id);
  const tabs = ['Overview','Programmes','Training schedule','Attendance','Events','Development notes'];
  return <><Link className="portal-inline-link portal-small" to="/admin/players">← All players</Link><PageHeading eyebrow="PLAYER PROFILE / DEMO" title={player.name} description={`${player.ageGroup} · ${groupName(player.groupId)} · Coach ${coachName(player.coachId)}`}/>
    <Panel><div className="portal-profile-head"><Avatar initials={player.initials} size="large"/><div><h2>{player.name}</h2><p>{player.ageGroup} · Registered {formatDate(player.registered)}</p><Status value={player.status}/></div></div><div className="portal-tabs" role="tablist" aria-label="Player details">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === 'Overview' && <dl className="portal-detail-list"><div><dt>Date of birth</dt><dd>{formatDate(player.dateOfBirth)}</dd></div><div><dt>Training group</dt><dd>{groupName(player.groupId)}</dd></div><div><dt>Assigned coach</dt><dd>{coachName(player.coachId)}</dd></div><div><dt>Parent / guardian</dt><dd>{guardian?.name}<br/>{guardian?.email}<br/>{guardian?.phone}</dd></div></dl>}
      {tab === 'Programmes' && <div className="portal-grid portal-grid-2">{player.programmeIds.map((id) => <div className="portal-card" key={id}><h2>{programmeName(id, programmes)}</h2><p className="portal-small portal-muted">{programmes.find((item) => item.id === id)?.description}</p><Link className="portal-inline-link portal-small" to={`/admin/programmes/${id}`}>Open programme →</Link></div>)}</div>}
      {tab === 'Training schedule' && <SessionList sessions={playerSessions} programmes={programmes}/>}
      {tab === 'Attendance' && <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Date</th><th>Programme</th><th>Session</th><th>Status</th></tr></thead><tbody>{records.map((record) => { const session = sessions.find((item) => item.id === record.sessionId); return <tr key={record.id}><td>{formatDate(record.date)}</td><td>{programmeName(session?.programmeId, programmes)}</td><td>{session?.title || 'Training session'}</td><td><Status value={record.status}/></td></tr>; })}</tbody></table></div>}
      {tab === 'Events' && <ul className="portal-list">{playerEvents.map((event) => <li key={event.id}><span className="portal-list-icon"><PortalIcon name="events" size={17}/></span><div><h3>{event.title}</h3><p>{formatDate(event.date)} · {formatTime(event.start)} · {locationName(event.locationId)}</p></div><Status value={event.status}/></li>)}</ul>}
      {tab === 'Development notes' && <div className="portal-detail-message"><strong>Coach focus</strong><p>{player.note}</p><small className="portal-muted">Illustrative development note. Editing will be available when the backend is connected.</small></div>}
    </Panel></>;
}

export function AdminParents() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(demoPeople.guardians[0].id);
  const contacts = demoPeople.guardians.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()));
  const selected = demoPeople.guardians.find((item) => item.id === selectedId);
  return <><PageHeading eyebrow="PEOPLE / CONTACTS" title="Parents & guardians" description="One place to understand family relationships and recent communication activity."/>
    <div className="portal-toolbar"><label className="portal-search"><PortalIcon name="search" size={17}/><input aria-label="Search contacts" placeholder="Search guardian or email" value={query} onChange={(event) => setQuery(event.target.value)}/></label></div>
    <div className="portal-grid portal-grid-wide"><Panel title="Contacts"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Guardian</th><th>Phone</th><th>Associated player</th><th>Joined</th><th></th></tr></thead><tbody>{contacts.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.email}</small></td><td>{item.phone}</td><td>{item.playerIds.map((id) => demoPeople.players.find((player) => player.id === id)?.name).join(', ')}</td><td>{formatDate(item.joined)}</td><td><button className="portal-icon-button" type="button" aria-label={`View ${item.name}`} onClick={() => setSelectedId(item.id)}><PortalIcon name="eye" size={15}/></button></td></tr>)}</tbody></table></div></Panel><Panel eyebrow="CONTACT PROFILE" title={selected?.name}><dl className="portal-detail-list"><div><dt>Email</dt><dd>{selected?.email}</dd></div><div><dt>Phone</dt><dd>{selected?.phone}</dd></div><div><dt>Associated player</dt><dd>{selected?.playerIds.map((id) => demoPeople.players.find((item) => item.id === id)?.name).join(', ')}</dd></div><div><dt>Registered</dt><dd>{selected && formatDate(selected.joined)}</dd></div><div><dt>Communication history</dt><dd>{selected?.lastContact}</dd></div></dl></Panel></div></>;
}
