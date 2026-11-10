import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-brand.png';
import PortalIcon from './PortalIcon';
import BrandText from '../components/BrandText';
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { players, selectedPlayerId, setSelectedPlayerId, notifications } = useDemo();
  const [menuOpen, setMenuOpen] = useState(false);
  const workspaceRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(`itabees-${mode}-theme`) || (isAdmin ? 'dark' : 'light'); }
    catch { return isAdmin ? 'dark' : 'light'; }
  });
  const root = isAdmin ? '/admin' : '/dashboard';
  const selectedPlayer = players.find((player) => player.id === selectedPlayerId) || players[0];
  const current = [...items].reverse().find(([, path]) => pathname === path || pathname.startsWith(`${path}/`));
  const unreadCount = notifications.filter((notice) => notice.playerId === selectedPlayerId && !notice.read).length;

  useEffect(() => { workspaceRef.current?.scrollTo(0, 0); }, [pathname]);
  const goBack = () => {
    setMenuOpen(false);
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(pathname !== current?.[1] ? current?.[1] || root : root);
  };
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem(`itabees-${mode}-theme`, next); } catch { /* Theme still changes for this visit. */ }
  };

  return <div className={`portal portal-${mode} portal-theme-${theme}`}>
    <aside className={`portal-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label={`${mode} navigation`}>
      <Link to={root} className="portal-brand" onClick={() => { setMenuOpen(false); workspaceRef.current?.scrollTo(0, 0); }} aria-label={`${isAdmin ? 'Admin' : 'Member'} dashboard home`}><span className="portal-brand-mark"><img src={logo} alt="" /></span><span><strong><BrandText>ITABEES</BrandText></strong><small>TALENT ACADEMY</small></span></Link>
      <div className="portal-sidebar-label">{isAdmin ? 'COMMAND CENTRE' : 'PLAYER PORTAL'} <span>DEMO</span></div>
      <nav className="portal-nav" aria-label={isAdmin ? 'Admin sections' : 'Member sections'}>
        {items.map(([label, path, icon]) => <NavLink key={path} to={path} end={path === '/admin' || path === '/dashboard'} onClick={() => setMenuOpen(false)}><PortalIcon name={icon} size={19}/><span>{label}</span>{label === 'Notifications' && unreadCount > 0 && <b>{unreadCount}</b>}</NavLink>)}
      </nav>
      <div className="portal-sidebar-foot"><span>FRONTEND PREVIEW</span><p>Fictional records · changes stay in this browser session</p><Link to="/" className="portal-public-link" onClick={() => setMenuOpen(false)}><span className="portal-public-icon"><PortalIcon name="arrow" size={17}/></span><span><strong>Public website</strong><small>Explore <BrandText>ItaBEES</BrandText></small></span><PortalIcon name="chevron" size={16}/></Link><Link to={isAdmin ? '/admin/login' : '/login'} className="portal-logout-link" onClick={() => setMenuOpen(false)}><PortalIcon name="logout" size={18}/><span>Log out</span></Link></div>
    </aside>
    {menuOpen && <button className="portal-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="portal-workspace" ref={workspaceRef}>
      <header className="portal-topbar">
        <div className="portal-topbar-left"><button type="button" className="portal-menu-button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><PortalIcon name={menuOpen ? 'close' : 'menu'} size={22}/></button><button type="button" className="portal-back-button" aria-label="Go back to previous page" title="Go back" onClick={goBack}><PortalIcon name="back" size={18}/></button><nav className="portal-breadcrumb" aria-label="Breadcrumb"><Link to={root}>{isAdmin ? 'Administration' : 'Member space'}</Link><PortalIcon name="chevron" size={14}/>{pathname !== current?.[1] ? <Link className="portal-breadcrumb-current" to={current?.[1] || root}>{current?.[0] || 'Overview'}</Link> : <strong>{current?.[0] || 'Overview'}</strong>}</nav></div>
        <div className="portal-topbar-right">
          <button type="button" className="portal-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><PortalIcon name={theme === 'dark' ? 'sun' : 'moon'} size={19}/><span className="portal-theme-tooltip" aria-hidden="true">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
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
