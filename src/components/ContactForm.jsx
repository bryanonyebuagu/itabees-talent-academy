import { useState } from "react";
import ArrowUpRight from "./ArrowUpRight";

const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
const choices = ["Player", "Parent", "Partner", "Volunteer"];

export default function ContactForm({ defaultInquiry = "" }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", inquiry: defaultInquiry, message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const update = (field) => (event) => { setForm({ ...form, [field]: event.target.value }); setErrors({ ...errors, [field]: "" }); };
  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Enter your first name.";
    if (!form.lastName.trim()) next.lastName = "Enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!choices.includes(form.inquiry)) next.inquiry = "Choose an inquiry type.";
    if (form.message.trim().length < 10) next.message = "Write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!endpoint) { setStatus("error"); setFeedback("Online form sending is not connected yet. Please email info@itabeestalentacademy.com."); return; }
    setStatus("loading");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Your message could not be sent. Please try again or email us.");
      setStatus("success");
      setFeedback("Your message has been sent to ItaBEES.");
      setForm({ firstName: "", lastName: "", email: "", inquiry: defaultInquiry, message: "" });
    } catch (error) { setStatus("error"); setFeedback(error.message); }
  };
  return <form className="contact-form" onSubmit={submit} noValidate><div className="contact-form-grid"><label>First Name<input value={form.firstName} onChange={update("firstName")} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <small className="form-error">{errors.firstName}</small>}</label><label>Last Name<input value={form.lastName} onChange={update("lastName")} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <small className="form-error">{errors.lastName}</small>}</label><label>Email<input type="email" value={form.email} onChange={update("email")} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small className="form-error">{errors.email}</small>}</label><label>Inquiry Type<select value={form.inquiry} onChange={update("inquiry")} aria-invalid={Boolean(errors.inquiry)}><option value="">Select an option</option>{choices.map(value => <option key={value}>{value}</option>)}</select>{errors.inquiry && <small className="form-error">{errors.inquiry}</small>}</label></div><label>Message<textarea rows="6" value={form.message} onChange={update("message")} aria-invalid={Boolean(errors.message)} />{errors.message && <small className="form-error">{errors.message}</small>}</label>{feedback && <p className={status === "success" ? "form-success" : "form-error"} role="status">{feedback} {status === "error" && <a href="mailto:info@itabeestalentacademy.com">Open email</a>}</p>}<button className="button button-yellow" type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Submit"} <span><ArrowUpRight /></span></button></form>;
}
