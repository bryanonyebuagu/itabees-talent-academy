import { useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import RegistrationWizard from '../components/RegistrationWizard';
import { ProgramName } from '../components/ProgramPricingCard';
import { FORM_TYPES } from '../data/applicationForms';
import { media } from '../data/media';

export default function ProgramApplication() {
  const { type } = useParams();
  const [params] = useSearchParams();
  const [result, setResult] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [submissionId] = useState(() => crypto.randomUUID());
  if (!Object.hasOwn(FORM_TYPES, type) || ['supplemental-training','financial-assistance'].includes(type)) return <Navigate to="/register" replace />;
  const submit = async answers => {
    setBusy(true); setError('');
    try {
      const response = await fetch(answers.applicationType === 'financial-assistance' ? '/api/assistance' : '/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...answers, programId: params.get('program') || '', submissionId }) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.error || 'Your application could not be received. Your entries are still here. Please try again.');
      setResult(data); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  if (result) return <main className="assistance-confirmation"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"/><path d="m18 32 10 10 19-22" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg><ProgramName name={result.assistance ? 'Financial Assistance Requested' : result.status === 'waitlisted' ? 'Waitlist Request Received' : type === 'camps-clinics' ? 'Registration Received' : type === 'international-experiences' ? 'Travel Interest Received' : 'Request Received'} as="h1" /><p role="status">{result.message}</p>{!result.emailSent && <p>Your details are saved. The confirmation email could not be delivered yet; please contact the academy if you need help.</p>}<p>Questions? <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a><br/><a href="tel:+15028074444">Coach Ita: 502-807-4444</a></p><Link className="button button-yellow" to="/">Back to homepage</Link></main>;
  return <main className="checkout-page stripe-checkout-page"><div className="checkout-heading"><p className="eyebrow">YOUR NEXT STEP</p><ProgramName name={FORM_TYPES[type].title} as="h1" /><p>{FORM_TYPES[type].description}</p></div><div className="checkout-grid"><RegistrationWizard key={type} initialType={type} onComplete={submit} busy={busy} error={error} /><aside className="checkout-summary checkout-summary--program"><img className="application-sidebar-image" src={media.training} alt="ItaBEES player development" /><ProgramName name={FORM_TYPES[type].title} as="h2" /><p>{FORM_TYPES[type].description}</p><Link className="button button-yellow" to="/register">Explore other programs</Link><Link className="training-assistance-link" to="/financial-assistance">Do you need financial assistance?</Link></aside></div></main>;
}
