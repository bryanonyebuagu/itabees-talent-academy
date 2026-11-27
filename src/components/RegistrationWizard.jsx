import { useState } from "react";
import ApplicationProgress from "./ApplicationProgress";
import { ProgramName } from "./ProgramPricingCard";
import ArrowUpRight from "./ArrowUpRight";
import { initialRegistration, WAIVER_TEXT } from "../data/registrationForm";

const baseSteps = ["About the Athlete", "Parent / Guardian", "Health & Safety", "Acknowledgement"];
const extraFields = {
 "About the Athlete": [["club", "Current Club/Team (optional)"], ["goals", "Athlete Goals (optional)", false, "textarea"], ["allergies", "Allergies (if any)"]],
 "Parent / Guardian": [["emergencyName", "Emergency contact full name", true], ["emergencyRelationship", "Emergency contact relationship", true], ["emergencyPhone", "Emergency contact phone", true, "tel"]],
 "Health & Safety": [["medicalConditions", "Medical conditions (if any)", false, "textarea"], ["medications", "Current medications (if any)"]],
};
const JERSEY_SIZES = ["Youth XS", "Youth S", "Youth M", "Youth L", "Youth XL", "Adult S", "Adult M", "Adult L", "Adult XL", "Adult XXL"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const labelText = label => label.endsWith("(optional)") ? <>{label.slice(0, -10)}<span className="application-optional">(optional)</span></> : label;
const requiredMark = <span className="registration-required-mark" aria-hidden="true"> *</span>;
const field = (label, key, value, update, options = {}) => <label key={key}><span>{labelText(label)}{options.required && requiredMark}</span><input required={options.required} type={options.type || "text"} value={value} onChange={update(key)} autoComplete={options.autoComplete} min={options.min} max={options.max} /></label>;

export default function RegistrationWizard({ onComplete, busy, error, initialType = "supplemental-training", onTypeChange }) {
  const [applicationType, setApplicationType] = useState(initialType);
  const sections = applicationType === "supplemental-training" ? ["About the Athlete", "Parent / Guardian", "Acknowledgement"] : baseSteps;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialRegistration);
  const title = sections[step];
  const last = step === sections.length - 1;
  const [validation, setValidation] = useState("");
  const update = key => event => setValues(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const advance = event => {
    event.preventDefault();
    setValidation("");
    if (title === "Parent / Guardian" && !emailPattern.test(values.email)) return setValidation("Enter a valid preferred email address.");
    if (title === "About the Athlete") {
      const birthday = new Date(`${values.birthDate}T12:00:00`);
      const today = new Date();
      const calculated = today.getFullYear() - birthday.getFullYear() - (today.getMonth() < birthday.getMonth() || today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate() ? 1 : 0);
      if (Number.isNaN(birthday.getTime()) || calculated < 4 || calculated > 18) return setValidation("Enter a valid date of birth for a player aged 4 to 18.");
    }

    if (step === sections.length - 1) onComplete({ ...values, applicationType });
    else setStep(current => current + 1);
  };
  return <form className="checkout-form registration-wizard" onSubmit={advance}>
    <div className="application-paths" role="group" aria-label="Select application type">{[["supplemental-training", "Supplemental Training"], ["financial-assistance", "Financial Assistance"]].map(([id, name], index) => <button key={id} type="button" aria-pressed={applicationType === id} onClick={() => { setApplicationType(id); onTypeChange?.(id); setStep(0); setValidation(""); }}><small>0{index + 1}</small><strong>{name}</strong></button>)}</div>
    <ApplicationProgress steps={sections} current={step} onBack={index => { setStep(index); setValidation(""); }} />
    <ProgramName name={title} as="h2" /><p>Complete one application per player. {applicationType === "financial-assistance" ? "Financial assistance applications go directly to academy review. No payment is required." : "Supplemental training uses the selected program’s published price."} Fields marked <span className="registration-required-mark">*</span> are required.</p>

    {title === "Parent / Guardian" && <div className="checkout-fields">{field("Parent/guardian full name", "name", values.name, update, { required: true, autoComplete: "name" })}{field("Preferred email address", "email", values.email, update, { required: true, type: "email", autoComplete: "email" })}{field("Secondary email address", "secondaryEmail", values.secondaryEmail, update, { type: "email" })}{field("Primary phone number", "phone", values.phone, update, { required: true, type: "tel", autoComplete: "tel" })}{field("Secondary phone number", "secondaryPhone", values.secondaryPhone, update, { type: "tel" })}{field("Home address", "address", values.address, update, { required: true, autoComplete: "street-address" })}{field("City", "city", values.city, update, { required: true, autoComplete: "address-level2" })}{field("State", "state", values.state, update, { required: true, autoComplete: "address-level1" })}{field("ZIP code", "zip", values.zip, update, { required: true, autoComplete: "postal-code" })}</div>}
    {title === "About the Athlete" && <div className="checkout-fields">{field("Player full name", "participantName", values.participantName, update, { required: true })}{field("Player date of birth", "birthDate", values.birthDate, update, { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}<label><span>Jersey size{requiredMark}</span><select required value={values.jerseySize || ""} onChange={update("jerseySize")}><option value="" disabled>Select jersey size</option>{JERSEY_SIZES.map(size => <option key={size}>{size}</option>)}</select></label><fieldset className="registration-choice registration-gender"><legend>Player gender{requiredMark}</legend>{["Boy", "Girl"].map(option => <label key={option}><input required type="radio" name="gender" value={option} checked={values.gender === option} onChange={update("gender")} />{option}</label>)}</fieldset></div>}
    <div className="checkout-fields">{(extraFields[title] || []).map(([key, label, required, type]) => type === "textarea" ? <label key={key} className="application-wide">{labelText(label)}<textarea rows="4" maxLength="2000" value={values[key] || ""} onChange={update(key)} /></label> : field(label, key, values[key] || "", update, { required, type }))}</div>
    {last && <><div className="registration-waiver">{WAIVER_TEXT.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><label className="registration-check"><input required type="checkbox" checked={values.waiverAccepted} onChange={update("waiverAccepted")} /><span>I have read, understand and agree to the Participation Waiver and Release.{requiredMark}</span></label><label className="registration-comments">{labelText("Review or additional information (optional)")}<textarea rows="4" maxLength="2000" value={values.comments} onChange={update("comments")} placeholder="Add anything you would like the academy to review." /></label></>}
    {(validation || error) && <p className="form-error" role="alert">{validation || error}</p>}<div className="registration-actions">{step > 0 && <button className="button button-black" type="button" onClick={() => { setValidation(""); setStep(current => current - 1); }}>Back</button>}<button className="button button-yellow" disabled={busy} type="submit">{busy ? "Preparing…" : step === sections.length - 1 ? "Submit application" : "Next"} <ArrowUpRight /></button></div>
    <aside className="application-next" aria-labelledby="application-next-title">
      <h3 id="application-next-title">What happens <span>next</span></h3>
      <ol>
        <li><span>01</span><p>{applicationType === "financial-assistance" ? "We review your application within 5 to 7 business days." : "Complete your application and continue directly to secure monthly payment."}</p></li>
        <li><span>02</span><p>{applicationType === "financial-assistance" ? "A team member will reach out to discuss next steps." : "After payment, create your login and verify your email."}</p></li>
        <li><span>03</span><p>Selected athletes are invited to a trial session.</p></li>
      </ol>
      <p className="application-next-contact">Questions? Email us at <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a></p>
    </aside>
  </form>;
}
