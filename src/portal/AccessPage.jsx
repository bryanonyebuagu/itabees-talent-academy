import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { media } from '../data/media';
import { Field } from './PortalUI';
import PortalIcon from './PortalIcon';
import './portal.css';

export default function AccessPage({ kind }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const isAdmin = kind === 'admin';
  const isSignup = kind === 'signup';
  const isForgot = kind === 'forgot';
  const title = isSignup ? 'Start your journey.' : isForgot ? 'Reset your password.' : isAdmin ? 'Academy command centre.' : 'Welcome to your player space.';
  const description = isSignup ? 'Explore the information an ItaBEES registration would collect.' : isForgot ? 'Preview the password recovery screen.' : 'Explore the connected ItaBEES experience using fictional records.';
  const submit = (event) => {
    event.preventDefault();
    if (isSignup || isForgot) { setSubmitted(true); return; }
    setSubmitted(true);
  };
  return <div className="portal-access">
    <div className="portal-access-art"><img src={isAdmin ? media.coaching : media.training} alt="ItaBEES academy training"/><Link className="portal-brand" to="/"><span className="portal-brand-mark"><img src={logo} alt=""/></span><span><strong>ITABEES</strong><small>TALENT ACADEMY</small></span></Link><div><span className="portal-eyebrow">BUILT FOR THE NEXT GENERATION</span><h1>Potential is only <span>the beginning.</span></h1><p>One academy. A clearer path for players, families and the team behind every session.</p></div></div>
    <div className="portal-access-form-wrap"><div className="portal-access-form"><span className="portal-eyebrow">{isAdmin ? 'ADMIN / DEMO ACCESS' : 'PLAYER PORTAL / DEMO ACCESS'}</span><h2>{title}</h2><p>{description}</p>
      <div className="portal-access-note"><strong>Frontend preview only.</strong> No account is created, credentials are not checked, and form entries are not sent or stored.</div>
      {submitted ? <div className="portal-access-success" role="status"><PortalIcon name="check" size={24}/><h3>{isSignup ? 'Registration preview complete' : isForgot ? 'Recovery preview complete' : 'Login preview only'}</h3><p>{isSignup ? 'The registration form is ready for a future backend connection. No account or enquiry was submitted.' : isForgot ? 'No recovery email was sent. This screen is a design preview.' : 'Credentials were not checked or stored. Use the clearly labelled demo access below to explore the interface.'}</p><button className="portal-button portal-button-secondary" type="button" onClick={() => setSubmitted(false)}>Back to form</button></div> : <form onSubmit={submit}>
        {isSignup ? <><div className="portal-field-grid"><Field label="Player full name"><input required name="player" autoComplete="name" placeholder="Player full name"/></Field><Field label="Date of birth"><input required name="birth" type="date"/></Field><Field label="Guardian name"><input required name="guardian" placeholder="Parent or guardian"/></Field><Field label="Phone number"><input required name="phone" type="tel" placeholder="Phone number"/></Field></div><Field label="Parent / guardian email"><input required name="email" type="email" autoComplete="email" placeholder="you@example.com"/></Field><Field label="Preferred programme"><select required name="programme" defaultValue=""><option value="" disabled>Select a programme</option><option>Player Development</option><option>Camps & Clinics</option><option>College Pathway</option><option>International Experiences</option></select></Field><Field label="Additional information"><textarea name="notes" rows="3" placeholder="Tell us about the player’s goals"/></Field><label className="portal-check-label"><input required type="checkbox"/>I am the parent or guardian and consent to this registration preview.</label></> : isForgot ? <Field label="Email address"><input required type="email" autoComplete="email" placeholder="you@example.com"/></Field> : <><Field label="Email address"><input required type="email" autoComplete="email" placeholder={isAdmin ? 'admin@example.com' : 'member@example.com'}/></Field><Field label="Password"><input required type="password" autoComplete="current-password" placeholder="Enter any demo password"/></Field></>}
        <button className="portal-button portal-button-primary" type="submit"><PortalIcon name={isSignup ? 'user' : isForgot ? 'arrow' : 'lock'} size={17}/>{isSignup ? 'Preview registration' : isForgot ? 'Preview recovery' : 'Preview login'}</button>
      </form>}
      {!isSignup && !isForgot && <button className="portal-button portal-button-secondary portal-demo-entry" type="button" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}><PortalIcon name="spark" size={17}/>Open {isAdmin ? 'admin' : 'member'} demo — no login required</button>}
      <div className="portal-access-links"><Link to={isAdmin ? '/login' : '/admin/login'}>{isAdmin ? 'Member portal' : 'Admin demo'}</Link>{!isAdmin && !isSignup && !isForgot && <><Link to="/signup">Sign up</Link><Link to="/forgot-password">Forgot password?</Link></>}{(isSignup || isForgot) && <Link to="/login">Back to login</Link>}<Link to="/">Public website</Link></div>
    </div></div>
  </div>;
}
