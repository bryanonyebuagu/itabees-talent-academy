import { Link } from 'react-router-dom';
import { attendance, byDate, donations, formatDate, formatMoney, initialNotifications, staff } from './demoData';
import { locationName, programmeName } from './selectors';
import PortalIcon from './PortalIcon';
import { Avatar, Metric, PageHeading, Panel, Status } from './PortalUI';
import { SessionList } from './PortalSchedule';
import useDemo from './useDemo';

const registrationBars = [28, 38, 34, 55, 48, 66, 59, 77, 67, 84, 75, 91];
const enquiryBars = [22, 35, 29, 47, 38, 53, 45, 66, 58, 70, 62, 80];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function BarChart({ values, alt = false }) {
  return <div className={`portal-bar-chart ${alt ? 'alt' : ''}`} aria-label="Illustrative activity chart">{values.map((value, index) => <div key={index}><span style={{ height: `${value}%` }}/><small>{months[index]}</small></div>)}</div>;
}

export default function AdminOverview() {
  const { players, programmes, sessions, events, enquiries } = useDemo();
  const upcomingEvents = [...events].filter((event) => event.status === 'Upcoming').sort(byDate);
  const upcomingSessions = [...sessions].sort(byDate).slice(0, 3);
  const recentPlayers = [...players].sort((a, b) => b.registered.localeCompare(a.registered));
  return <>
    <PageHeading eyebrow="ADMIN / OVERVIEW" title="Academy command centre" description="A clear view of the academy's people, programmes and activity. Every figure below is demonstration data." action={<Link className="portal-button portal-button-primary" to="/admin/timetable"><PortalIcon name="plus" size={17}/> Build timetable</Link>}/>
    <div className="portal-metrics"><Metric label="Total players" value={players.length} detail="Fictional profiles" icon="players"/><Metric label="Active programmes" value={programmes.filter((item) => item.status === 'Active').length} detail="Across three age pathways" icon="programmes"/><Metric label="New enquiries" value={enquiries.filter((item) => item.status === 'New').length} detail="Ready for review" icon="enquiries"/><Metric label="Upcoming events" value={upcomingEvents.length} detail="On the demo calendar" icon="events"/></div>
    <div className="portal-grid portal-grid-wide"><Panel eyebrow="DEVELOPMENT PULSE" title="Player registrations" action={<span className="portal-small portal-muted">Illustrative trend · 12 months</span>}><BarChart values={registrationBars}/></Panel><Panel eyebrow="PROGRAMME MIX" title="Participation by pathway"><div className="portal-chart-row"><div className="portal-donut" aria-label="Illustrative programme participation"/><div className="portal-legend"><span><i style={{ background:'#ffe600' }}/> Youth Development · 48%</span><span><i style={{ background:'#7ed9ce' }}/> Foundation Skills · 30%</span><span><i style={{ background:'#746cf2' }}/> Performance Pathway · 22%</span></div></div></Panel></div>
    <div className="portal-grid portal-grid-wide portal-section-gap"><Panel eyebrow="CONTACT ACTIVITY" title="Enquiry activity" action={<Link to="/admin/enquiries">View enquiries →</Link>}><BarChart values={enquiryBars} alt/></Panel><Panel eyebrow="NEXT UP" title="Upcoming events" action={<Link to="/admin/events">All events →</Link>}>{upcomingEvents.length ? <ul className="portal-list">{upcomingEvents.map((event) => <li key={event.id}><span className="portal-list-icon"><PortalIcon name="events" size={17}/></span><div><h3>{event.title}</h3><p>{locationName(event.locationId)}</p></div><time>{formatDate(event.date, { month:'short',day:'numeric' })}</time></li>)}</ul> : <p className="portal-muted portal-small">No upcoming demo events.</p>}</Panel></div>
    <div className="portal-grid portal-grid-3 portal-section-gap"><Panel eyebrow="ON THE FIELD" title="Next training sessions"><SessionList sessions={upcomingSessions} programmes={programmes} compact/><Link className="portal-inline-link portal-small" to="/admin/timetable">Open timetable →</Link></Panel><Panel eyebrow="PEOPLE" title="Recent registrations"><ul className="portal-list">{recentPlayers.map((player) => <li key={player.id}><Avatar initials={player.initials}/><div><h3>{player.name}</h3><p>{player.ageGroup} · {programmeName(player.programmeIds[0], programmes)}</p></div><Status value={player.status}/></li>)}</ul><Link className="portal-inline-link portal-small" to="/admin/players">View players →</Link></Panel><Panel eyebrow="OPERATIONS" title="Recent activity"><ul className="portal-list"><li><span className="portal-list-icon"><PortalIcon name="check" size={17}/></span><div><h3>Attendance recorded</h3><p>{attendance.length} illustrative attendance entries</p></div></li><li><span className="portal-list-icon"><PortalIcon name="donations" size={17}/></span><div><h3>Donation received</h3><p>{formatMoney(donations[0].amount)} · mock transaction</p></div></li><li><span className="portal-list-icon"><PortalIcon name="staff" size={17}/></span><div><h3>Staff access preview</h3><p>{staff.length} role profiles in demo mode</p></div></li><li><span className="portal-list-icon"><PortalIcon name="bell" size={17}/></span><div><h3>Member notices</h3><p>{initialNotifications.length} demo notifications</p></div></li></ul></Panel></div>
    <div className="portal-quick-actions portal-section-gap"><Link to="/admin/enquiries"><PortalIcon name="enquiries" size={19}/> Review enquiries <PortalIcon name="arrow" size={16}/></Link><Link to="/admin/programmes"><PortalIcon name="programmes" size={19}/> Manage programmes <PortalIcon name="arrow" size={16}/></Link><Link to="/admin/messages"><PortalIcon name="messages" size={19}/> Open messages <PortalIcon name="arrow" size={16}/></Link></div>
  </>;
}
