import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — app-level Lenis provider.
 *
 * Lives above the router (not in Layout) because Layout remounts on every
 * route change under AnimatePresence mode="wait", which would tear down and
 * recreate the Lenis instance mid-transition.
 *
 * Lenis drives the real window scroll position, so framer-motion's useScroll
 * (ScrollProgress, hero parallax, ParallaxLayer) stays in sync automatically.
 * Disabled entirely when the user prefers reduced motion.
 */
const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return undefined;

    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(instance);

    let rafId = requestAnimationFrame(function raf(time) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    const onPreferenceChange = (e) => {
      if (e.matches) {
        cancelAnimationFrame(rafId);
        instance.destroy();
        setLenis(null);
      }
    };
    reduced.addEventListener?.("change", onPreferenceChange);

    return () => {
      reduced.removeEventListener?.("change", onPreferenceChange);
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
