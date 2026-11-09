import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import PortalIcon from './PortalIcon';
import useDemo from './useDemo';
import './portal.css';

const adminItems = [
  ['Overview', '/admin', 'dashboard'], ['Enquiries', '/admin/enquiries', 'enquiries'],
  ['Players', '/admin/players', 'players'], ['Parents & contacts', '/admin/parents', 'parents'],
  ['Programmes', '/admin/programmes', 'programmes'], ['Training', '/admin/training', 'training'],
  ['Timetable', '/admin/timetable', 'timetable'], ['Events', '/admin/events', 'events'],
  ['Coaches', '/admin/coaches', 'coaches'], ['Donations', '/admin/donations', 'donations'],
  ['Messages', '/admin/messages', 'messages'], ['Staff', '/admin/staff', 'staff'],
  ['Settings', '/admin/settings', 'settings'],
];

const memberItems = [
  ['Overview', '/dashboard', 'dashboard'], ['My programmes', '/dashboard/my-programmes', 'programmes'],
  ['Training schedule', '/dashboard/schedule', 'timetable'], ['Events', '/dashboard/events', 'events'],
  ['Attendance', '/dashboard/attendance', 'check'], ['Profile', '/dashboard/profile', 'user'],
  ['Notifications', '/dashboard/notifications', 'bell'],
];

export default function PortalLayout({ mode }) {
  const isAdmin = mode === 'admin';
  const items = isAdmin ? adminItems : memberItems;
  const { pathname } = useLocation();
  const { players, selectedPlayerId, setSelectedPlayerId, notifications } = useDemo();
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedPlayer = players.find((player) => player.id === selectedPlayerId) || players[0];
  const current = [...items].reverse().find(([, path]) => pathname === path || pathname.startsWith(`${path}/`));
  const unreadCount = notifications.filter((notice) => notice.playerId === selectedPlayerId && !notice.read).length;

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return <div className={`portal portal-${mode}`}>
    <aside className={`portal-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label={`${mode} navigation`}>
      <Link to="/" className="portal-brand" onClick={() => setMenuOpen(false)}><span className="portal-brand-mark"><img src={logo} alt="" /></span><span><strong>ITABEES</strong><small>TALENT ACADEMY</small></span></Link>
      <div className="portal-sidebar-label">{isAdmin ? 'COMMAND CENTRE' : 'PLAYER PORTAL'} <span>DEMO</span></div>
      <nav className="portal-nav" aria-label={isAdmin ? 'Admin sections' : 'Member sections'}>
        {items.map(([label, path, icon]) => <NavLink key={path} to={path} end={path === '/admin' || path === '/dashboard'} onClick={() => setMenuOpen(false)}><PortalIcon name={icon} size={19}/><span>{label}</span>{label === 'Notifications' && unreadCount > 0 && <b>{unreadCount}</b>}</NavLink>)}
      </nav>
      <div className="portal-sidebar-foot"><span>FRONTEND PREVIEW</span><p>Fictional records · changes stay in this browser session</p><Link to="/" className="portal-back"><PortalIcon name="arrow" size={17}/> Public website</Link></div>
    </aside>
    {menuOpen && <button className="portal-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="portal-workspace">
      <header className="portal-topbar">
        <div className="portal-topbar-left"><button type="button" className="portal-menu-button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><PortalIcon name={menuOpen ? 'close' : 'menu'} size={22}/></button><span className="portal-breadcrumb">{isAdmin ? 'Administration' : 'Member space'} <PortalIcon name="chevron" size={14}/> <strong>{current?.[0] || 'Overview'}</strong></span></div>
        <div className="portal-topbar-right">
          {!isAdmin && <label className="portal-player-switch"><span>Preview player</span><select value={selectedPlayerId} onChange={(event) => setSelectedPlayerId(event.target.value)}>{players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select></label>}
          {!isAdmin && <Link to="/dashboard/notifications" className="portal-top-icon" aria-label={`${unreadCount} unread notifications`}><PortalIcon name="bell" size={20}/>{unreadCount > 0 && <i />}</Link>}
          <div className="portal-user"><span className="portal-avatar">{isAdmin ? 'AJ' : selectedPlayer.initials}</span><span><strong>{isAdmin ? 'Amina Johnson' : selectedPlayer.name}</strong><small>{isAdmin ? 'Super Admin · demo' : `${selectedPlayer.ageGroup} player · demo`}</small></span></div>
        </div>
      </header>
      <div className="portal-demo-ribbon"><PortalIcon name="spark" size={15}/><span>DEMONSTRATION MODE</span> All names, activity and figures are fictional. Changes reset when the page reloads.</div>
      <main className="portal-main"><Outlet /></main>
    </div>
  </div>;
}
