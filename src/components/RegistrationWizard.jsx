import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplicationProgress from './ApplicationProgress';
import { ProgramName } from './ProgramPricingCard';
import ArrowUpRight from './ArrowUpRight';
import { WAIVER_TEXT } from '../data/registrationForm';
import { ASSISTANCE_TYPES, CAMP_SESSIONS, FORM_TYPES, initialApplication, JERSEY_SIZES, MEETING_FORMATS, MENTORSHIP_FOCUS, PLAYING_LEVELS, POSITIONS, PRIVATE_FOCUS, SESSION_FREQUENCIES } from '../data/applicationForms';

const mark = <span className="registration-required-mark" aria-hidden="true"> *</span>;
const steps = ['Player Information', 'Parent / Guardian Information', 'Acknowledgement'];
function TextField({ name, label, values, update, required = false, type = 'text', area = false, placeholder, autoComplete }) {
  return <label className={area ? 'application-wide' : undefined}><span>{label}{required ? mark : <span className="application-optional"> (optional)</span>}</span>{area ? <textarea name={name} rows="3" maxLength="2000" value={values[name]} onChange={update(name)} required={required} placeholder={placeholder} /> : <input name={name} value={values[name]} onChange={update(name)} required={required} type={type} maxLength="250" autoComplete={autoComplete} max={type === 'date' ? new Date().toISOString().slice(0,10) : undefined} />}</label>;
}
function SelectField({ name, label, values, update, options }) {
  return <label><span>{label}{mark}</span><select name={name} required value={values[name]} onChange={update(name)}><option value="" disabled>Select an option</option>{options.map(option => <option key={typeof option === 'string' ? option : option.id} value={typeof option === 'string' ? option : option.id}>{typeof option === 'string' ? option : `${option.name}${option.status === 'full' ? ' (waitlist)' : ''}`}</option>)}</select></label>;
}
function Choices({ name, label, values, update, options, multiple = false, gender = false }) {
  return <fieldset className={`registration-choice application-options${gender ? ' registration-gender' : ''}`}><legend>{label}{mark}</legend>{options.map(option => <label key={option}><input type={multiple ? 'checkbox' : 'radio'} name={name} value={option} required={!multiple} checked={multiple ? values[name].includes(option) : values[name] === option} onChange={update(name, multiple)} />{option}</label>)}</fieldset>;
}
export function ProgramFields({ type, values, update }) {
  const props = { values, update };
  const needsAssistance = type === 'financial-assistance' || values.financialAssistance === 'Yes';
  return <div className="application-program-fields"><ProgramName name={FORM_TYPES[type].title} as="h3" /><p>{FORM_TYPES[type].description}</p><div className="checkout-fields">
        {['supplemental-training','camps-clinics','international-experiences'].includes(type) && <><SelectField {...props} name="jerseySize" label="Jersey Size" options={JERSEY_SIZES} /><Choices {...props} name="financialAssistance" label="Are You Applying for financial assistance?" options={['Yes','No']} /></>}
        {type === 'private-training' && <><Choices {...props} name="trainingFocus" label="What would you like to work on?" options={PRIVATE_FOCUS} multiple /><TextField {...props} name="preferredSchedule" label="Preferred days and times" /><SelectField {...props} name="sessionFrequency" label="Session frequency" options={SESSION_FREQUENCIES} /></>}
        {type === 'mentorship' && <><Choices {...props} name="mentorshipFocus" label="What would you like guidance on?" options={MENTORSHIP_FOCUS} multiple /><TextField {...props} name="mentorshipGoals" label="What would you like to get out of mentorship?" area /><SelectField {...props} name="meetingFormat" label="Preferred meeting format" options={MEETING_FORMATS} /></>}
        {type === 'camps-clinics' && <SelectField {...props} name="campId" label="Select the camp or clinic you are applying for" options={CAMP_SESSIONS.filter(item => ['open','full'].includes(item.status))} />}
        {type === 'international-experiences' && <><TextField {...props} name="trip" label="What trip are you applying for?" required /><Choices {...props} name="guardianTravel" label="Is a parent or guardian interested in traveling with the player?" options={['Yes','No']} /></>}
        {needsAssistance && <><TextField {...props} name="financialNeed" label="Why are you applying for assistance?" required area /><SelectField {...props} name="assistanceType" label="What type of assistance would help?" options={ASSISTANCE_TYPES} /></>}
      </div>{needsAssistance && <p className="application-outcome">This application will go to academy review. No payment is required.</p>}</div>;
}

export default function RegistrationWizard({ onComplete, busy, error, initialType = 'supplemental-training' }) {
  const type = Object.hasOwn(FORM_TYPES, initialType) ? initialType : 'supplemental-training';
  const [step, setStep] = useState(0), [values, setValues] = useState(initialApplication), [validation, setValidation] = useState('');
  const needsAssistance = type === 'financial-assistance' || values.financialAssistance === 'Yes';
  const camp = CAMP_SESSIONS.find(item => item.id === values.campId);
  const button = needsAssistance ? FORM_TYPES['financial-assistance'].button : type === 'camps-clinics' && camp?.status === 'full' ? 'Join Waitlist' : FORM_TYPES[type].button;
  const update = (key, multiple = false) => event => {
    const { value, checked, type: inputType } = event.target;
    setValues(current => ({ ...current, [key]: multiple ? checked ? [...current[key], value] : current[key].filter(item => item !== value) : inputType === 'checkbox' ? checked : value }));
  };
  const props = { values, update };
  const advance = event => {
    event.preventDefault(); setValidation('');
    if (step === 0) {
      const birthday = new Date(`${values.birthDate}T12:00:00Z`), now = new Date();
      const age = now.getUTCFullYear() - birthday.getUTCFullYear() - (now.getUTCMonth() < birthday.getUTCMonth() || now.getUTCMonth() === birthday.getUTCMonth() && now.getUTCDate() < birthday.getUTCDate() ? 1 : 0);
      if (Number.isNaN(birthday.getTime()) || birthday.toISOString().slice(0,10) !== values.birthDate || age < 4 || age > 18) return setValidation('Enter a valid birth date for a player aged 4 to 18.');
      if (!values.positions.length) return setValidation('Select at least one preferred soccer position.');
    }
    if (step === 1) {
      if (type === 'private-training' && !values.trainingFocus.length) return setValidation('Select at least one training focus.');
      if (type === 'mentorship' && !values.mentorshipFocus.length) return setValidation('Select at least one area of guidance.');
    }
    if (step === 2) onComplete({ ...values, name: `${values.guardianFirstName.trim()} ${values.guardianLastName.trim()}`, participantName: `${values.playerFirstName.trim()} ${values.playerLastName.trim()}`, applicationType: needsAssistance ? 'financial-assistance' : type, sourceType: type });
    else { setStep(current => current + 1); }
  };
  return <form className="checkout-form registration-wizard" onSubmit={advance}>
    <ApplicationProgress steps={steps} current={step} onBack={index => { setStep(index); setValidation(''); }} />
    <ProgramName name={steps[step]} as="h2" /><p>Complete one form per player. Fields marked {mark} are required.</p>
    {step === 0 && <>
      <div className="checkout-fields">
        <TextField {...props} name="playerFirstName" label="Player first name" required /><TextField {...props} name="playerLastName" label="Player last name" required />
        <TextField {...props} name="birthDate" label="Date of birth" type="date" required /><Choices {...props} name="gender" label="Gender" options={['Boy','Girl']} gender />
        <TextField {...props} name="club" label="Current Club" /><SelectField {...props} name="playingLevel" label="Current Playing Level" options={PLAYING_LEVELS} />
        <Choices {...props} name="positions" label="Preferred Soccer Position(s)" options={POSITIONS} multiple />
        <TextField {...props} name="goals" label="Player's Goals" area />
        <Choices {...props} name="existingParticipant" label="Existing ITABEES participant?" options={['Yes','No']} />
        <TextField {...props} name="comments" label="Notes and Comments" area placeholder="Medical Needs, Allergies, Accommodations, or Other Important Notes" />
      </div>

    </>}
    {step === 1 && <><div className="checkout-fields">
      <TextField {...props} name="guardianFirstName" label="Parent/guardian first name" required autoComplete="given-name" /><TextField {...props} name="guardianLastName" label="Parent/guardian last name" required autoComplete="family-name" />
      <TextField {...props} name="address" label="Address" required autoComplete="street-address" /><TextField {...props} name="city" label="City" required autoComplete="address-level2" /><TextField {...props} name="state" label="State" required autoComplete="address-level1" /><TextField {...props} name="zip" label="Zip Code" required autoComplete="postal-code" />
      <TextField {...props} name="email" label="Preferred Email Address" type="email" required autoComplete="email" /><TextField {...props} name="secondaryEmail" label="Secondary Email Address" type="email" /><TextField {...props} name="phone" label="Primary Phone Number" type="tel" required autoComplete="tel" /><TextField {...props} name="secondaryPhone" label="Secondary Phone Number" type="tel" />
    </div><ProgramFields type={type} {...props} /></>}
    {step === 2 && <>
      <ProgramName name="Participation Waiver and Release" as="h3" /><p><strong>PLEASE READ CAREFULLY BEFORE SIGNING</strong></p>
      <div className="registration-waiver">{WAIVER_TEXT.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <label className="registration-check"><input required type="checkbox" checked={values.waiverAccepted} onChange={update('waiverAccepted')} /><span>I agree to the terms and conditions and signing the waiver for Player <strong>{values.playerFirstName} {values.playerLastName}</strong>.{mark}</span></label>
      <ProgramName name="Photo and Media Permission" as="h3" /><p>During our training sessions and games, ITABEES Talent Academy may take photographs or video recordings for program documentation, its website, social media, flyers and other promotional materials.</p>
      <label className="registration-check"><input type="checkbox" checked={values.photoPermission} onChange={update('photoPermission')} /><span>I hereby grant permission for ITABEES Talent Academy to photograph or record the player for promotional and program-related use.</span></label><p className="application-optional">Optional. Leaving this unchecked means you do not grant permission.</p>
      <div className="application-outcome"><strong>{needsAssistance ? 'Submit for financial assistance review' : FORM_TYPES[type].button}</strong><p>{needsAssistance ? 'No payment is required. We will review your financial assistance application within 5 to 7 business days.' : FORM_TYPES[type].description}</p></div>
    </>}
    {(validation || error) && <p className="form-error" role="alert">{validation || error}</p>}
    <div className="registration-actions">{step > 0 && <button className="button button-black" type="button" disabled={busy} onClick={() => { setValidation(''); setStep(current => current - 1); }}>Back</button>}<button className="button button-yellow" disabled={busy} type="submit">{busy ? 'Submitting...' : step === 2 ? button : 'Next'} <ArrowUpRight /></button></div>
    {type !== 'financial-assistance' && <Link className="training-assistance-link application-assistance-link" to="/financial-assistance">Do you need financial assistance?</Link>}
    <aside className="application-next"><h3>What happens <span>next</span></h3><ol><li><span>01</span><p>{needsAssistance ? 'We review your application within 5 to 7 business days.' : type === 'supplemental-training' ? 'Continue to secure monthly payment after submitting your form.' : type === 'camps-clinics' ? 'We record your registration or waitlist request.' : 'We review your request or travel interest.'}</p></li><li><span>02</span><p>{!needsAssistance && type === 'supplemental-training' ? 'After confirmed payment, create your login and verify your email.' : 'A team member will follow up by email with next steps.'}</p></li></ol><p className="application-next-contact">Questions? Email us at <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a></p></aside>
  </form>;
}
