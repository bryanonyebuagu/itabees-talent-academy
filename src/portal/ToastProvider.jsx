import { useCallback, useEffect, useRef, useState } from 'react';
import PortalIcon from './PortalIcon';
import { ToastContext } from './ToastContext';
import './toast.css';

const DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const dismiss = useCallback((id) => {
    const active = timers.current.get(id);
    if (active) { clearTimeout(active.hide); clearTimeout(active.remove); }
    setToasts((items) => items.filter((item) => item.id !== id));
    timers.current.delete(id);
  }, []);
  const notify = useCallback(({ title, description, type = 'success' }) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, title, description, type, leaving: false }]);
    const hide = setTimeout(() => setToasts((items) => items.map((item) => item.id === id ? { ...item, leaving: true } : item)), DURATION);
    const remove = setTimeout(() => dismiss(id), DURATION + 320);
    timers.current.set(id, { hide, remove });
    return id;
  }, [dismiss]);
  useEffect(() => {
    const current = timers.current;
    return () => { current.forEach(({ hide, remove }) => { clearTimeout(hide); clearTimeout(remove); }); current.clear(); };
  }, []);
  return <ToastContext.Provider value={notify}>{children}<div className="itabees-toast-stack" aria-live="polite" aria-atomic="false">{toasts.map((item) => <div key={item.id} className={`itabees-toast toast-${item.type} ${item.leaving ? 'is-leaving' : ''}`} role={item.type === 'error' ? 'alert' : 'status'}><div className="itabees-toast-icon"><PortalIcon name={item.type === 'success' ? 'check' : item.type === 'error' ? 'close' : item.type === 'warning' ? 'bell' : 'spark'} size={19}/></div><div className="itabees-toast-copy"><strong>{item.title}</strong><p>{item.description}</p></div><button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification"><PortalIcon name="close" size={16}/></button><span className="itabees-toast-progress" aria-hidden="true"/></div>)}</div></ToastContext.Provider>;
}

