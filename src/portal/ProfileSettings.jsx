import { useState } from 'react';
import useToast from './useToast';
import useDemo from './useDemo';

const initialsFor = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

export function EditableField({ label, current, type = 'text', validate, onSave, title, description }) {
  const notify = useToast();
  const [value, setValue] = useState(current || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const changed = value.trim() !== (current || '').trim();
  const submit = (event) => {
    event.preventDefault();
    if (saving || !changed) return;
    const clean = value.trim();
    const problem = validate(clean);
    if (problem) { setError(problem); notify({ type:'error', title:`${label} Not Updated`, description:problem }); return; }
    setSaving(true);
    try { onSave(clean, { title, description }); setError(''); }
    catch { setError('The update could not be completed. Your entry has been kept.'); notify({ type:'error', title:'Update Failed', description:'The update could not be completed. Please try again.' }); }
    finally { setSaving(false); }
  };
  return <form className="portal-profile-setting" onSubmit={submit} noValidate><label htmlFor={`setting-${type}-${label.replaceAll(' ','-')}`}>{label}</label><div className="portal-profile-setting-row"><input id={`setting-${type}-${label.replaceAll(' ','-')}`} type={type} value={value} onChange={(event) => { setValue(event.target.value); setError(''); }} aria-invalid={Boolean(error)} autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'name'}/><button className="portal-button portal-button-primary" type="submit" disabled={!changed || saving}>{saving ? 'Updating…' : 'Update'}</button></div><p className={`portal-setting-feedback ${error ? 'is-error' : ''}`} aria-live="polite">{error || (changed ? 'Unsaved changes' : 'Up to date')}</p></form>;
}

export default function ProfileSettings({ player, guardian }) {
  const { updatePlayer, updateGuardian } = useDemo();
  return <div className="portal-profile-settings-grid">
    <EditableField label="Update Full Name" current={player.name} validate={(value) => value.length < 2 || !value.includes(' ') ? 'Enter the player’s full name, including a first and last name.' : ''} onSave={(name, message) => updatePlayer(player.id, { name, initials:initialsFor(name) }, message)} title="Profile Updated" description="The player’s full name has been successfully updated in this demo."/>
    <EditableField label="Update Email Address" current={guardian?.email} type="email" validate={(value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid parent or guardian email address.' : ''} onSave={(email, message) => updateGuardian(guardian.id, { email }, message)} title="Email Updated" description="The parent or guardian email address has been changed successfully in this demo."/>
    <EditableField label="Update Phone Number" current={guardian?.phone} type="tel" validate={(value) => value.replace(/\D/g, '').length < 7 ? 'Enter a phone number with at least seven digits.' : ''} onSave={(phone, message) => updateGuardian(guardian.id, { phone }, message)} title="Phone Number Updated" description="The parent or guardian phone number has been updated successfully in this demo."/>
  </div>;
}
