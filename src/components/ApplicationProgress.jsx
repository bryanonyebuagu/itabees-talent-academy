export default function ApplicationProgress({ steps, current, onBack }) {
  return <div className="application-progress">
    <ol aria-label="Application progress">{steps.map((title, index) => <li key={title} className={index < current ? "complete" : index === current ? "current" : ""} aria-current={index === current ? "step" : undefined}>
      <button type="button" disabled={index >= current} onClick={() => onBack(index)} aria-label={`${title}${index < current ? ", completed, return to step" : ""}`}>
        {index < current ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : index + 1}
      </button>
    </li>)}</ol>
    <p>Step <strong>{current + 1}</strong> of {steps.length} <span>—</span> <strong>{steps[current]}</strong></p>
    <div className="application-progress-track" role="progressbar" aria-label="Application progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={current + 1}><span style={{ width: `${current / (steps.length - 1) * 100}%` }} /></div>
  </div>;
}
