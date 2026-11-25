import { useState } from "react";
import ArrowUpRight from "./ArrowUpRight";
import { initialRegistration, PROGRAM_INTERESTS, WAIVER_TEXT } from "../data/registrationForm";

const sections = ["Parent or guardian", "Player", "Participation waiver", "Photo and media", "Communication"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const field = (label, key, value, update, options = {}) => <label key={key}>{label}{options.required && " *"}<input required={options.required} type={options.type || "text"} value={value} onChange={update(key)} autoComplete={options.autoComplete} min={options.min} max={options.max} /></label>;

export default function RegistrationWizard({ onComplete, busy, error }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialRegistration);
  const [validation, setValidation] = useState("");
  const update = key => event => setValues(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const toggleInterest = interest => setValues(current => ({ ...current, interests: current.interests.includes(interest) ? current.interests.filter(item => item !== interest) : [...current.interests, interest] }));
  const advance = event => {
    event.preventDefault();
    setValidation("");
    if (step === 0 && !emailPattern.test(values.email)) return setValidation("Enter a valid preferred email address.");
    if (step === 1) {
      const birthday = new Date(`${values.birthDate}T12:00:00`);
      const today = new Date();
      const calculated = today.getFullYear() - birthday.getFullYear() - (today.getMonth() < birthday.getMonth() || today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate() ? 1 : 0);
      if (Number.isNaN(birthday.getTime()) || calculated !== Number(values.age) || calculated < 4 || calculated > 18) return setValidation("Enter a valid date of birth and matching age from 4 to 18.");
    }
    if (step === 2 && values.signature.trim().toLowerCase() !== values.name.trim().toLowerCase()) return setValidation("The electronic signature must match the parent or guardian name.");
    if (step === sections.length - 1) onComplete(values);
    else setStep(current => current + 1);
  };
  return <form className="checkout-form registration-wizard" onSubmit={advance}>
    <div className="registration-progress" aria-label={`Step ${step + 1} of ${sections.length}`}>{sections.map((title, index) => <span key={title} className={index <= step ? "active" : ""} />)}</div>
    <p className="eyebrow">REGISTRATION · {step + 1} / {sections.length}</p><h2>{sections[step]}</h2><p>Complete one registration for each player. Fields marked * are required.</p>
    {step === 0 && <div className="checkout-fields">{field("Parent/guardian full name", "name", values.name, update, { required: true, autoComplete: "name" })}{field("Preferred email address", "email", values.email, update, { required: true, type: "email", autoComplete: "email" })}{field("Secondary email address", "secondaryEmail", values.secondaryEmail, update, { type: "email" })}{field("Primary phone number", "phone", values.phone, update, { required: true, type: "tel", autoComplete: "tel" })}{field("Secondary phone number", "secondaryPhone", values.secondaryPhone, update, { type: "tel" })}{field("Home address", "address", values.address, update, { required: true, autoComplete: "street-address" })}{field("City", "city", values.city, update, { required: true, autoComplete: "address-level2" })}{field("State", "state", values.state, update, { required: true, autoComplete: "address-level1" })}{field("ZIP code", "zip", values.zip, update, { required: true, autoComplete: "postal-code" })}</div>}
    {step === 1 && <div className="checkout-fields">{field("Player full name", "participantName", values.participantName, update, { required: true })}{field("Player date of birth", "birthDate", values.birthDate, update, { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}{field("Player age", "age", values.age, update, { required: true, type: "number", min: 4, max: 18 })}<fieldset className="registration-choice"><legend>Player gender *</legend>{["Boy", "Girl"].map(option => <label key={option}><input required type="radio" name="gender" value={option} checked={values.gender === option} onChange={update("gender")} />{option}</label>)}</fieldset></div>}
    {step === 2 && <><div className="registration-waiver">{WAIVER_TEXT.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><label className="registration-check"><input required type="checkbox" checked={values.waiverAccepted} onChange={update("waiverAccepted")} />I have read, understand and agree to the Participation Waiver and Release. *</label><p>Type your full legal name. By typing your name, you acknowledge that it serves as your electronic signature.</p><div className="checkout-fields">{field("Parent/guardian electronic signature", "signature", values.signature, update, { required: true })}{field("Date of agreement", "agreementDate", values.agreementDate, update, { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}</div></>}
    {step === 3 && <><p>During academy activities, ITABEES Talent Academy may take photographs or video recordings for program documentation, its website, social media, flyers and other promotional materials. Choosing “No” will not affect the player’s ability to participate.</p><fieldset className="registration-choice"><legend>May ITABEES Talent Academy photograph or record the player for promotional and program-related use? *</legend>{[["yes", "Yes, I give permission"], ["no", "No, I do not give permission"]].map(([value, label]) => <label key={value}><input required type="radio" name="photoPermission" value={value} checked={values.photoPermission === value} onChange={update("photoPermission")} />{label}</label>)}</fieldset></>}
    {step === 4 && <><fieldset className="registration-choice"><legend>May ITABEES Talent Academy contact you about future clinics, programs, teams and events? *</legend>{["Yes", "No"].map(option => <label key={option}><input required type="radio" name="futureContact" value={option} checked={values.futureContact === option} onChange={update("futureContact")} />{option}</label>)}</fieldset><fieldset className="registration-choice"><legend>Which future ITABEES Talent Academy programs might interest your family?</legend>{PROGRAM_INTERESTS.map(option => <label key={option}><input type="checkbox" checked={values.interests.includes(option)} onChange={() => toggleInterest(option)} />{option}</label>)}</fieldset><label className="registration-comments">Questions, comments or additional information<textarea rows="4" maxLength="2000" value={values.comments} onChange={update("comments")} placeholder="Share anything else you would like the coaching team to know." /></label></>}
    {(validation || error) && <p className="form-error" role="alert">{validation || error}</p>}<div className="registration-actions">{step > 0 && <button className="button button-black" type="button" onClick={() => { setValidation(""); setStep(current => current - 1); }}>Back</button>}<button className="button button-yellow" disabled={busy} type="submit">{busy ? "Preparing…" : step === sections.length - 1 ? "Continue to payment" : "Next"} <ArrowUpRight /></button></div>
  </form>;
}
