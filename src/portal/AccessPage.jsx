import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import logo from "../assets/logo.jpeg";
import { media } from "../data/media";
import { memberAuth, firebaseReady } from "../services/firebase";
import { Field } from "./PortalUI";
import PortalIcon from "./PortalIcon";
import "./portal.css";

async function setupRequest(body, signal) {
  const response = await fetch("/api/portal/setup-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Account setup is unavailable.");
  return data;
}

export default function AccessPage({ kind }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { hash, state } = useLocation();
  const id = params.get("id");
  const token = new URLSearchParams(hash.slice(1)).get("token");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupMessage, setSetupMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isAdmin = kind === "admin", isSetup = kind === "setup", isForgot = kind === "forgot";
  const title = isSetup ? "Set up your login." : isForgot ? "Reset your password." : isAdmin ? "Academy command centre." : "Welcome to your player space.";
  useEffect(() => {
    if (!isSetup) return;
    const controller = new AbortController();
    async function loadLink() {
      try {
        const data = await setupRequest({ id, token }, controller.signal);
        setSetupEmail(data.email);
      } catch (caught) {
        if (!controller.signal.aborted) setSetupMessage(caught.message);
      }
    }
    loadLink();
    return () => controller.abort();
  }, [isSetup, id, token]);
  const submit = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmPassword") || "");
    if (isSetup && password !== confirmation) { setError("The passwords do not match."); return; }
    if (import.meta.env.DEV && !isSetup && !isForgot && email.toLowerCase() === import.meta.env.VITE_PREVIEW_EMAIL?.toLowerCase() && password === import.meta.env.VITE_PREVIEW_PASSWORD) { navigate(`${isAdmin ? "/admin" : "/dashboard"}?preview=1`); return; }
    if (!isSetup && !firebaseReady) { setError("Account access is awaiting the academy’s Firebase configuration."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      if (isForgot) { await sendPasswordResetEmail(memberAuth, email); setNotice("If this address has an account, a password reset email has been sent."); return; }
      if (isSetup) {
        await setupRequest({ id, token, password });
        navigate("/login", { state: { loginSetupComplete: true } });
        return;
      }
      const credentials = await signInWithEmailAndPassword(memberAuth, email, password);
      if (isAdmin) {
        const token = await credentials.user.getIdTokenResult(true);
        if (token.claims.admin !== true) { setError("This account does not have administrator access."); return; }
      }
      if (!isAdmin && !credentials.user.emailVerified) { await sendEmailVerification(credentials.user, { url: `${window.location.origin}/login` }); await signOut(memberAuth); setNotice("Verify your email using the link we sent, then sign in again."); return; }
      if (!isAdmin) {
        const authorization = `Bearer ${await credentials.user.getIdToken()}`;
        const check = await fetch("/api/portal/me", { headers: { Authorization: authorization } }).catch(() => null);
        if (!check?.ok) {
          await signOut(memberAuth);
          setError(check?.status === 403 ? "Register and complete payment for an ItaBEES program before logging in." : "Account access is temporarily unavailable.");
          return;
        }
      }
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (caught) { setError(caught.code === "auth/invalid-credential" ? "The email or password is incorrect." : caught.code === "auth/email-already-in-use" ? "This email already has an account. Sign in instead." : caught.message || "Account access failed."); }
    finally { setBusy(false); }
  };
  return <div className="portal-access"><div className="portal-access-art"><img src={isAdmin ? media.coaching : media.training} alt="ItaBEES academy training"/><Link className="portal-brand" to="/"><span className="portal-brand-mark"><img src={logo} alt=""/></span><span><strong><span className="brand-ita">Ita</span><span className="brand-bees">BEES</span></strong><small>TALENT ACADEMY</small></span></Link><div><span className="portal-eyebrow">BUILT FOR THE NEXT GENERATION</span><h1>Potential is only <span>the beginning.</span></h1><p>One academy. A clearer path for players, families and the team behind every session.</p></div></div>
    <div className="portal-access-form-wrap"><div className="portal-access-form"><span className="portal-eyebrow">{isAdmin ? "ADMIN ACCESS" : "PLAYER PORTAL"}</span><h2>{title}</h2><p>{isSetup ? "Create and confirm your password using the verified email from your paid registration." : isForgot ? "We’ll email you a secure reset link." : "Sign in to see your approved programs and support conversations."}</p>{import.meta.env.DEV && !isSetup && !isForgot && <p className="portal-preview-note">Local preview: use the preview email and password configured on this computer. This does not authenticate against the live backend.</p>}
      {state?.loginSetupComplete && !isAdmin && !isForgot && !isSetup && <p role="status">Your login is ready. Sign in with your verified email and new password.</p>}
      {isSetup && !setupEmail ? <p role="status">{setupMessage || "Checking your login setup link…"}</p> : <form onSubmit={submit}><Field label="Email address"><input required name="email" type="email" autoComplete="email" defaultValue={isSetup ? setupEmail : ""} readOnly={isSetup} placeholder="you@example.com"/></Field>{!isForgot && <Field label={isSetup ? "Create new password" : "Password"}><input required name="password" type="password" minLength={isSetup ? 8 : undefined} autoComplete={isSetup ? "new-password" : "current-password"} placeholder={isSetup ? "At least 8 characters" : "Your password"}/></Field>}{isSetup && <Field label="Confirm new password"><input required name="confirmPassword" type="password" minLength="8" autoComplete="new-password" placeholder="Repeat your password"/></Field>}{error && <p className="form-error" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}<button className="portal-button portal-button-primary" type="submit" disabled={busy}><PortalIcon name={isForgot ? "arrow" : "lock"} size={17}/>{busy ? "Please wait…" : isSetup ? "Set up my login" : isForgot ? "Send reset link" : "Sign in"}</button></form>}
      <div className="portal-access-links"><Link to={isAdmin ? "/login" : "/admin/login"}>{isAdmin ? "Member login" : "Admin login"}</Link>{!isAdmin && !isSetup && !isForgot && <><Link to="/register">Register for a program</Link><Link to="/forgot-password">Forgot password?</Link></>}{(isSetup || isForgot) && <Link to="/login">Back to login</Link>}<Link to="/">Public website</Link></div>
    </div></div></div>;
}
