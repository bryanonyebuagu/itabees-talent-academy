import { useState } from 'react';
import { byDate, formatDate, formatTime } from './demoData';
import { addDays, addMonths, coachName, dateKey, groupName, locationName, programmeAccent, programmeName, weekStart } from './selectors';
import PortalIcon from './PortalIcon';
import { EmptyState, Segmented } from './PortalUI';

const weekday = (value) => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(value);
const monthLabel = (value) => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(value);

function SessionChip({ session, programmes, onEdit }) {
  const content = <><strong>{session.title}</strong><small>{formatTime(session.start)} · {groupName(session.groupId)}</small></>;
  const className = `portal-session-chip accent-${programmeAccent(session.programmeId, programmes)}`;
  return onEdit ? <button className={className} type="button" onClick={() => onEdit(session)}>{content}</button> : <div className={className}>{content}</div>;
}

export function SessionList({ sessions, programmes, onEdit, onRemove, compact = false }) {
  const sorted = [...sessions].sort(byDate);
  if (!sorted.length) return <EmptyState title="No sessions in this view" body="Select another date or add a session to the timetable." />;
  return <div>{sorted.map((session) => <article className="portal-session-row" key={session.id}>
    <time dateTime={`${session.date}T${session.start}`}>{formatDate(session.date, { month: 'short', day: 'numeric' })}<br/>{formatTime(session.start)}</time>
    <div><h3>{session.title}</h3>{!compact && <p>{session.description}</p>}<div className="portal-card-meta"><span><PortalIcon name="clock" size={13}/>{formatTime(session.start)} – {formatTime(session.end)}</span><span><PortalIcon name="location" size={13}/>{locationName(session.locationId)}</span><span>{programmeName(session.programmeId, programmes)} · {groupName(session.groupId)}</span><span>{coachName(session.coachId)}</span></div></div>
    {(onEdit || onRemove) && <div className="portal-row-actions">{onEdit && <button className="portal-icon-button" type="button" title="Edit session" aria-label={`Edit ${session.title}`} onClick={() => onEdit(session)}><PortalIcon name="edit" size={15}/></button>}{onRemove && <button className="portal-icon-button" type="button" title="Remove session" aria-label={`Remove ${session.title}`} onClick={() => onRemove(session)}><PortalIcon name="trash" size={15}/></button>}</div>}
  </article>)}</div>;
}

export default function PortalSchedule({ sessions, programmes, onEdit, onRemove, initialView = 'Week', views = ['Week', 'Day', 'Month', 'List'] }) {
  const [view, setView] = useState(initialView);
  const [focusDate, setFocusDate] = useState(sessions[0]?.date || new Date().toISOString().slice(0, 10));
  const focus = new Date(`${focusDate}T12:00:00`);
  const start = weekStart(focusDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const label = view === 'Month' ? monthLabel(focus) : view === 'Week' ? `${formatDate(dateKey(weekDays[0]), { month: 'short', day: 'numeric' })} – ${formatDate(dateKey(weekDays[6]), { month: 'short', day: 'numeric', year: 'numeric' })}` : formatDate(focusDate);
  const changePeriod = (direction) => setFocusDate(dateKey(view === 'Month' ? addMonths(focus, direction) : addDays(focus, direction * (view === 'Week' ? 7 : 1))));
  const filtered = view === 'Day' ? sessions.filter((item) => item.date === focusDate) : view === 'Week' ? sessions.filter((item) => item.date >= dateKey(weekDays[0]) && item.date <= dateKey(weekDays[6])) : sessions;
  const monthStart = new Date(focus.getFullYear(), focus.getMonth(), 1, 12);
  const monthCells = Array.from({ length: (monthStart.getDay() + 6) % 7 + new Date(focus.getFullYear(), focus.getMonth() + 1, 0).getDate() }, (_, index) => {
    const day = index - (monthStart.getDay() + 6) % 7 + 1;
    return day > 0 ? dateKey(new Date(focus.getFullYear(), focus.getMonth(), day, 12)) : null;
  });

  return <div>
    <div className="portal-toolbar"><Segmented value={view} options={views} onChange={setView} label="Schedule view"/><div style={{ flex: 1 }} /><button className="portal-icon-button" type="button" aria-label="Previous period" onClick={() => changePeriod(-1)}><PortalIcon name="chevron" size={16} className="portal-flip"/></button><strong className="portal-small">{label}</strong><button className="portal-icon-button" type="button" aria-label="Next period" onClick={() => changePeriod(1)}><PortalIcon name="chevron" size={16}/></button></div>
    {view === 'List' && <SessionList sessions={sessions} programmes={programmes} onEdit={onEdit} onRemove={onRemove}/>}
    {view === 'Day' && <><div className="portal-small portal-muted" style={{ marginBottom: 10 }}>Sessions for {formatDate(focusDate)}</div><SessionList sessions={filtered} programmes={programmes} onEdit={onEdit} onRemove={onRemove}/></>}
    {view === 'Week' && <div className="portal-calendar">{weekDays.map((day) => <div className="portal-calendar-day" key={dateKey(day)}><strong>{weekday(day)} <span>{day.getDate()}</span></strong>{sessions.filter((session) => session.date === dateKey(day)).sort(byDate).map((session) => <SessionChip key={session.id} session={session} programmes={programmes} onEdit={onEdit}/>)}</div>)}</div>}
    {view === 'Month' && <><div className="portal-month-weekdays">{['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day) => <span key={day}>{day}</span>)}</div><div className="portal-month">{monthCells.map((key, index) => <div className={key ? '' : 'is-muted'} key={key || `empty-${index}`}><strong>{key ? Number(key.slice(-2)) : ''}</strong>{key && sessions.filter((session) => session.date === key).map((session) => <button type="button" key={session.id} onClick={() => onEdit?.(session)} title={session.title}>{session.title}</button>)}</div>)}</div></>}
  </div>;
}
