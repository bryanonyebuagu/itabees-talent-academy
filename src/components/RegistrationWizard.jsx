import { useState } from "react";
import ApplicationProgress from "./ApplicationProgress";
import { ProgramName } from "./ProgramPricingCard";
import ArrowUpRight from "./ArrowUpRight";
import { initialRegistration, PROGRAM_INTERESTS, WAIVER_TEXT } from "../data/registrationForm";

const baseSteps = ["About the Athlete", "Parent / Guardian", "Soccer Background", "Health & Safety", "Goals & References", "Documents & Consent"];
const extraFields = {
 "About the Athlete": [["school", "School name", true], ["grade", "Grade / year", true], ["athleteEmail", "Athlete email (optional)", false, "email"], ["gpa", "GPA / grade average (optional)"]],
 "Parent / Guardian": [["emergencyName", "Emergency contact full name", true], ["emergencyRelationship", "Emergency contact relationship", true], ["emergencyPhone", "Emergency contact phone", true, "tel"]],
 "Soccer Background": [["club", "Club / team"], ["division", "Level / division"], ["coachName", "Coach name"], ["coachPhone", "Coach phone", false, "tel"], ["coachEmail", "Coach email", false, "email"]],
 "Financial Need": [["financialNeed", "Why are you applying for assistance? (optional)", false, "textarea"]],
 "Health & Safety": [["medicalConditions", "Medical conditions (if any)", false, "textarea"], ["medications", "Current medications (if any)"], ["allergies", "Allergies (if any)"]],
 "Goals & References": [["goals", "Athlete goals (in their own words)", false, "textarea"], ...[1,2].flatMap(n => ["Name", "Role", "Phone", "Email"].map(part => [`reference${n}${part}`, `Reference ${n}: ${part}`, false, part === "Email" ? "email" : "text"]))],
 "Documents & Consent": [["documents", "Supporting document links (optional)", false, "textarea"]]
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const labelText = label => label.endsWith("(optional)") ? <>{label.slice(0, -10)}<span className="application-optional">(optional)</span></> : label;
const requiredMark = <span className="registration-required-mark" aria-hidden="true"> *</span>;
const field = (label, key, value, update, options = {}) => <label key={key}><span>{labelText(label)}{options.required && requiredMark}</span><input required={options.required} type={options.type || "text"} value={value} onChange={update(key)} autoComplete={options.autoComplete} min={options.min} max={options.max} /></label>;

export default function RegistrationWizard({ onComplete, busy, error, initialType = "supplemental-training", onTypeChange }) {
  const [applicationType, setApplicationType] = useState(initialType);
  const sections = applicationType === "supplemental-training" ? [...baseSteps.slice(0,3), "Financial Need", ...baseSteps.slice(3)] : baseSteps;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialRegistration);
  const title = sections[step];
  const last = step === sections.length - 1;
  const [validation, setValidation] = useState("");
  const update = key => event => setValues(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const toggleInterest = interest => setValues(current => ({ ...current, interests: current.interests.includes(interest) ? current.interests.filter(item => item !== interest) : [...current.interests, interest] }));
  const advance = event => {
    event.preventDefault();
    setValidation("");
    if (title === "Parent / Guardian" && !emailPattern.test(values.email)) return setValidation("Enter a valid preferred email address.");
    if (title === "About the Athlete") {
      const birthday = new Date(`${values.birthDate}T12:00:00`);
      const today = new Date();
      const calculated = today.getFullYear() - birthday.getFullYear() - (today.getMonth() < birthday.getMonth() || today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate() ? 1 : 0);
      if (Number.isNaN(birthday.getTime()) || calculated !== Number(values.age) || calculated < 4 || calculated > 18) return setValidation("Enter a valid date of birth and matching age from 4 to 18.");
    }
    if (last && values.signature.trim().toLowerCase() !== values.name.trim().toLowerCase()) return setValidation("The electronic signature must match the parent or guardian name.");
    if (step === sections.length - 1) onComplete({ ...values, applicationType });
    else setStep(current => current + 1);
  };
  return <form className="checkout-form registration-wizard" onSubmit={advance}>
    <div className="application-paths" role="group" aria-label="Select application type">{[["financial-assistance", "Financial Assistance"], ["supplemental-training", "Supplemental Training"]].map(([id, name], index) => <button key={id} type="button" aria-pressed={applicationType === id} onClick={() => { setApplicationType(id); onTypeChange?.(id); setStep(0); setValidation(""); }}><small>0{index + 1}</small><strong>{name}</strong></button>)}</div>
    <ApplicationProgress steps={sections} current={step} onBack={index => { setStep(index); setValidation(""); }} />
    <ProgramName name={title} as="h2" /><p>Complete one application per player. {applicationType === "financial-assistance" ? "Financial assistance applications go directly to academy review. No payment is required." : "Supplemental training uses the selected program’s published price."} Fields marked <span className="registration-required-mark">*</span> are required.</p>

    {title === "Parent / Guardian" && <div className="checkout-fields">{field("Parent/guardian full name", "name", values.name, update, { required: true, autoComplete: "name" })}{field("Preferred email address", "email", values.email, update, { required: true, type: "email", autoComplete: "email" })}{field("Secondary email address", "secondaryEmail", values.secondaryEmail, update, { type: "email" })}{field("Primary phone number", "phone", values.phone, update, { required: true, type: "tel", autoComplete: "tel" })}{field("Secondary phone number", "secondaryPhone", values.secondaryPhone, update, { type: "tel" })}{field("Home address", "address", values.address, update, { required: true, autoComplete: "street-address" })}{field("City", "city", values.city, update, { required: true, autoComplete: "address-level2" })}{field("State", "state", values.state, update, { required: true, autoComplete: "address-level1" })}{field("ZIP code", "zip", values.zip, update, { required: true, autoComplete: "postal-code" })}</div>}
    {title === "About the Athlete" && <div className="checkout-fields">{field("Player full name", "participantName", values.participantName, update, { required: true })}{field("Player date of birth", "birthDate", values.birthDate, update, { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}{field("Player age", "age", values.age, update, { required: true, type: "number", min: 4, max: 18 })}<fieldset className="registration-choice"><legend>Player gender{requiredMark}</legend>{["Boy", "Girl"].map(option => <label key={option}><input required type="radio" name="gender" value={option} checked={values.gender === option} onChange={update("gender")} />{option}</label>)}</fieldset></div>}
    <div className="checkout-fields">{(extraFields[title] || []).map(([key, label, required, type]) => type === "textarea" ? <label key={key} className="application-wide">{labelText(label)}<textarea rows="4" maxLength="2000" value={values[key] || ""} onChange={update(key)} /></label> : field(label, key, values[key] || "", update, { required, type }))}</div>
    {last && <><div className="registration-waiver">{WAIVER_TEXT.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><label className="registration-check"><input required type="checkbox" checked={values.waiverAccepted} onChange={update("waiverAccepted")} /><span>I have read, understand and agree to the Participation Waiver and Release.{requiredMark}</span></label><p>Type your full legal name. By typing your name, you acknowledge that it serves as your electronic signature.</p><div className="checkout-fields">{field("Parent/guardian electronic signature", "signature", values.signature, update, { required: true })}{field("Date of agreement", "agreementDate", values.agreementDate, update, { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}</div></>}
    {last && <><p>During academy activities, ITABEES Talent Academy may take photographs or video recordings for program documentation, its website, social media, flyers and other promotional materials. Choosing “No” will not affect the player’s ability to participate.</p><fieldset className="registration-choice"><legend>May ITABEES Talent Academy photograph or record the player for promotional and program-related use?{requiredMark}</legend>{[["yes", "Yes, I give permission"], ["no", "No, I do not give permission"]].map(([value, label]) => <label key={value}><input required type="radio" name="photoPermission" value={value} checked={values.photoPermission === value} onChange={update("photoPermission")} />{label}</label>)}</fieldset></>}
    {last && <><fieldset className="registration-choice"><legend>May ITABEES Talent Academy contact you about future clinics, programs, teams and events?{requiredMark}</legend>{["Yes", "No"].map(option => <label key={option}><input required type="radio" name="futureContact" value={option} checked={values.futureContact === option} onChange={update("futureContact")} />{option}</label>)}</fieldset><fieldset className="registration-choice"><legend>Which future ITABEES Talent Academy programs might interest your family?</legend>{PROGRAM_INTERESTS.map(option => <label key={option}><input type="checkbox" checked={values.interests.includes(option)} onChange={() => toggleInterest(option)} />{option}</label>)}</fieldset><label className="registration-comments">Questions, comments or additional information<textarea rows="4" maxLength="2000" value={values.comments} onChange={update("comments")} placeholder="Share anything else you would like the coaching team to know." /></label></>}
    {(validation || error) && <p className="form-error" role="alert">{validation || error}</p>}<div className="registration-actions">{step > 0 && <button className="button button-black" type="button" onClick={() => { setValidation(""); setStep(current => current - 1); }}>Back</button>}<button className="button button-yellow" disabled={busy} type="submit">{busy ? "Preparing…" : step === sections.length - 1 ? applicationType === "financial-assistance" ? "Submit application" : "Verify email and continue" : "Next"} <ArrowUpRight /></button></div>
  </form>;
}
