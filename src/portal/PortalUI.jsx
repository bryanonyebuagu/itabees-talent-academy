import PortalIcon from './PortalIcon';

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="portal-page-heading"><div><p className="portal-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="portal-page-description">{description}</p>}</div>{action && <div className="portal-heading-action">{action}</div>}</div>;
}

export function Panel({ title, eyebrow, action, children, className = '' }) {
  return <section className={`portal-panel ${className}`}><div className="portal-panel-heading"><div>{eyebrow && <span className="portal-eyebrow">{eyebrow}</span>}{title && <h2>{title}</h2>}</div>{action}</div>{children}</section>;
}

export function Metric({ label, value, detail, icon, tone = '' }) {
  return <article className={`portal-metric ${tone}`}><div className="portal-metric-top"><span>{label}</span><PortalIcon name={icon} size={21}/></div><strong>{value}</strong><small>{detail}</small></article>;
}

export function Status({ value }) {
  const tone = String(value || '').toLowerCase().replaceAll(' ', '-');
  return <span className={`portal-status status-${tone}`}>{value}</span>;
}

export function Button({ children, icon = 'plus', variant = 'primary', onClick, type = 'button', disabled = false }) {
  return <button type={type} className={`portal-button portal-button-${variant}`} onClick={onClick} disabled={disabled}>{icon && <PortalIcon name={icon} size={17}/>}<span>{children}</span></button>;
}

export function EmptyState({ title = 'Nothing here yet', body = 'Items will appear here when added to this demo.' }) {
  return <div className="portal-empty"><PortalIcon name="spark" size={25}/><h3>{title}</h3><p>{body}</p></div>;
}

export function Modal({ title, onClose, children, wide = false }) {
  return <div className="portal-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="presentation"><div className={`portal-modal ${wide ? 'portal-modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><div className="portal-modal-header"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog"><PortalIcon name="close" size={20}/></button></div>{children}</div></div>;
}

export function Field({ label, children, className = '' }) {
  return <label className={`portal-field ${className}`}><span>{label}</span>{children}</label>;
}

export function Avatar({ initials, image, size = 'normal' }) {
  return <span className={`portal-person-avatar avatar-${size}`}>{image ? <img src={image} alt="" /> : initials}</span>;
}

export function Segmented({ value, options, onChange, label }) {
  return <div className="portal-segmented" aria-label={label}>{options.map((option) => <button type="button" key={option} className={value === option ? 'is-selected' : ''} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div>;
}
