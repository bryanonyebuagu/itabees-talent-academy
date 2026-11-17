import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatCheckoutAmount } from "../data/checkoutPrograms";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id"), token = params.get("token");
  const [state, setState] = useState({ status: "pending" });
  useEffect(() => {
    if (!id || !token) return;
    let stopped = false, timer;
    const check = async () => {
      try {
        const response = await fetch(`/api/payments/status?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Status is unavailable.");
        if (!stopped) { setState(result); if (result.status === "pending") timer = setTimeout(check, 2500); }
      } catch (error) { if (!stopped) setState({ status: "error", message: error.message }); }
    };
    check();
    return () => { stopped = true; clearTimeout(timer); };
  }, [id, token]);
  const paid = state.status === "paid";
  useEffect(() => { if (!paid || state.kind !== "program") return; const timer = setTimeout(() => navigate(`/signup?email=${encodeURIComponent(state.email)}`), 4000); return () => clearTimeout(timer); }, [paid, state.kind, state.email, navigate]);
  const next = `/signup?email=${encodeURIComponent(state.email || "")}`;
  return <main className="checkout-return stripe-confirmation"><p className="eyebrow">PAYMENT STATUS</p><h1>{paid ? (state.kind === "donation" ? "Thank you for giving." : "Payment verified.") : state.status === "pending" ? "Verifying your payment." : "Payment not confirmed."}</h1><p role="status">{paid ? state.kind === "program" ? "Your payment is recorded. The academy will confirm it before dashboard access opens." : "Your donation was verified by Stripe and recorded by ItaBEES." : state.status === "pending" ? "We are waiting for secure payment confirmation. Please keep this page open." : state.message || "Your payment was not completed. Please contact the academy if you believe you were charged."}</p>{paid && <div className="confirmation-details">{state.kind === "program" && <><p><strong>Participant</strong> {state.participantName}</p><p><strong>Program</strong> {state.title}</p><p><strong>Duration</strong> {state.duration}</p></>}<p><strong>{state.kind === "donation" ? "Donation" : "Amount paid"}</strong> {formatCheckoutAmount(state.amountCents)}</p><p><strong>Reference</strong> {state.reference}</p><p><strong>Receipt</strong> Stripe sends a receipt to {state.email} when receipts are enabled in the academy’s Stripe account.</p></div>}{paid && state.kind === "program" && <div className="itabees-account-loading" role="status"><strong>Ita<span>BEES</span></strong><div className="itabees-account-progress"/><p>Taking you to account setup…</p></div>}<Link className="button button-yellow" to={paid && state.kind === "program" ? next : "/"}>{paid && state.kind === "program" ? "Set up your login" : "Return home"}</Link></main>;
}
