import BrandText from "../components/BrandText";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import { verifyDonation } from "../services/paystack";

export default function DonationReturn() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [status, setStatus] = useState(reference ? "checking" : "failed");
  const [message, setMessage] = useState(reference ? "Checking your payment with Paystack…" : "No payment reference was provided.");
  useEffect(() => {
    if (!reference) return;
    let active = true;
    verifyDonation(reference).then(success => {
      if (!active) return;
      setStatus(success ? "success" : "failed");
      setMessage(success ? "Your donation was verified. Thank you for supporting ItaBEES." : "The payment could not be verified. Please check with ItaBEES before trying again.");
    }).catch(error => { if (active) { setStatus("failed"); setMessage(error.message || "Payment verification is unavailable."); } });
    return () => { active = false; };
  }, [reference]);
  return <BrandText><main className="checkout-return"><p className="eyebrow">DONATION STATUS</p><h1>{status === "checking" ? "Verifying your gift." : status === "success" ? "Thank you for giving." : "We couldn't confirm the payment."}</h1><p role="status">{message}</p><Link className="button button-yellow" to={status === "success" ? "/" : "/donate"}>{status === "success" ? "Return home" : "Back to donation"} <span><ArrowUpRight /></span></Link></main></BrandText>;
}
