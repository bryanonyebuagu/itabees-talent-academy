import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function NavigationLoader() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const timer = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
        setVisible(true);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    clearTimeout(timer.current);
    setVisible(true);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 180 : 650;
    timer.current = window.setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer.current);
  }, [pathname]);

  return visible && <div className="route-loading-screen" role="status" aria-label="Loading page">
    <div className="route-loading-content"><span className="route-loading-name"><span>Ita</span><strong>BEES</strong></span><span className="route-loading-bar" /></div>
  </div>;
}
