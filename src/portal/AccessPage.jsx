import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import logo from "../assets/logo.jpeg";
import { media } from "../data/media";
import { memberAuth, firebaseReady } from "../services/firebase";
import { Field } from "./PortalUI";
import PortalIcon from "./PortalIcon";
import "./portal.css";

export default function AccessPage({ kind }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isAdmin = kind === "admin", isSignup = kind === "signup", isForgot = kind === "forgot";
  const title = isSignup ? "Start your journey." : isForgot ? "Reset your password." : isAdmin ? "Academy command centre." : "Welcome to your player space.";
  const submit = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmPassword") || "");
    if (isSignup && password !== confirmation) { setError("The passwords do not match."); return; }
    if (import.meta.env.DEV && !isSignup && !isForgot && email.toLowerCase() === import.meta.env.VITE_PREVIEW_EMAIL?.toLowerCase() && password === import.meta.env.VITE_PREVIEW_PASSWORD) { navigate(`${isAdmin ? "/admin" : "/dashboard"}?preview=1`); return; }
    if (!firebaseReady) { setError("Account access is awaiting the academy’s Firebase configuration."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      if (isForgot) { await sendPasswordResetEmail(memberAuth, email); setNotice("If this address has an account, a password reset email has been sent."); return; }
      const credentials = isSignup ? await createUserWithEmailAndPassword(memberAuth, email, password) : await signInWithEmailAndPassword(memberAuth, email, password);
      if (isSignup) {
        await sendEmailVerification(credentials.user, { url: `${window.location.origin}/login` });
        await signOut(memberAuth);
        setNotice("Verification email sent. Open its link, then sign in. Dashboard access also requires academy payment approval.");
        return;
      }
      if (isAdmin) {
        const token = await credentials.user.getIdTokenResult(true);
        if (token.claims.admin !== true) { setError("This account does not have administrator access."); return; }
      }
      if (!isAdmin && !credentials.user.emailVerified) { await sendEmailVerification(credentials.user, { url: `${window.location.origin}/login` }); await signOut(memberAuth); setNotice("Verify your email using the link we sent, then sign in again."); return; }
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (caught) { setError(caught.code === "auth/invalid-credential" ? "The email or password is incorrect." : caught.code === "auth/email-already-in-use" ? "This email already has an account. Sign in instead." : caught.message || "Account access failed."); }
    finally { setBusy(false); }
  };
  return <div className="portal-access"><div className="portal-access-art"><img src={isAdmin ? media.coaching : media.training} alt="ItaBEES academy training"/><Link className="portal-brand" to="/"><span className="portal-brand-mark"><img src={logo} alt=""/></span><span><strong><span className="brand-ita">Ita</span><span className="brand-bees">BEES</span></strong><small>TALENT ACADEMY</small></span></Link><div><span className="portal-eyebrow">BUILT FOR THE NEXT GENERATION</span><h1>Potential is only <span>the beginning.</span></h1><p>One academy. A clearer path for players, families and the team behind every session.</p></div></div>
    <div className="portal-access-form-wrap"><div className="portal-access-form"><span className="portal-eyebrow">{isAdmin ? "ADMIN ACCESS" : "PLAYER PORTAL"}</span><h2>{title}</h2><p>{isSignup ? "Create a password with the email used for registration. Verify that email before signing in; academy approval is also required for dashboard access." : isForgot ? "We’ll email you a secure reset link." : "Sign in to see your approved programs and support conversations."}</p>{import.meta.env.DEV && !isSignup && !isForgot && <p className="portal-preview-note">Local preview: use the preview email and password configured on this computer. This does not authenticate against the live backend.</p>}
      <form onSubmit={submit}><Field label="Email address"><input required name="email" type="email" autoComplete="email" defaultValue={isSignup ? params.get("email") || "" : ""} placeholder="you@example.com"/></Field>{!isForgot && <Field label={isSignup ? "Create new password" : "Password"}><input required name="password" type="password" minLength={isSignup ? 8 : undefined} autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "At least 8 characters" : "Your password"}/></Field>}{isSignup && <Field label="Confirm new password"><input required name="confirmPassword" type="password" minLength="8" autoComplete="new-password" placeholder="Repeat your password"/></Field>}{error && <p className="form-error" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}<button className="portal-button portal-button-primary" type="submit" disabled={busy}><PortalIcon name={isForgot ? "arrow" : "lock"} size={17}/>{busy ? "Please wait…" : isSignup ? "Create password & send verification" : isForgot ? "Send reset link" : "Sign in"}</button></form>
      <div className="portal-access-links"><Link to={isAdmin ? "/login" : "/admin/login"}>{isAdmin ? "Member login" : "Admin login"}</Link>{!isAdmin && !isSignup && !isForgot && <><Link to="/signup">Not yet a user? Sign up here</Link><Link to="/forgot-password">Forgot password?</Link></>}{(isSignup || isForgot) && <Link to="/login">Back to login</Link>}<Link to="/">Public website</Link></div>
    </div></div></div>;
}
