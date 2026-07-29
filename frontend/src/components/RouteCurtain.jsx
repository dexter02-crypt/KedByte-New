import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import KLogo from "@/components/KLogo";

const EASE = [0.76, 0, 0.24, 1];

const PAGE_NAMES = {
  "/": "HOME",
  "/services": "SERVICES",
  "/about": "ABOUT",
  "/careers": "CAREERS",
  "/contact": "CONTACT",
};

/**
 * RouteCurtain — full route-change wipe.
 *
 * Sequence per navigation (AnimatePresence mode="wait"):
 *   1. curtain in  — outgoing element's exit slides both panels down to cover (~0.5s)
 *   2. covered     — the incoming element mounts covered; the destination page
 *                    name flashes in mono type; ScrollToTop (App.js) jumps to
 *                    the top instantly while the viewport is hidden
 *   3. curtain out — panels slide up staggered, cyan hairline at the seam
 *
 * Skips the very first mount — the site Preloader owns the initial reveal.
 * Reduced motion: plain quick fade instead of the wipe.
 */
export default function RouteCurtain() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const isFirst = useRef(true);
  const first = isFirst.current;
  isFirst.current = false;

  const label = PAGE_NAMES[pathname] || "404";

  if (reduced) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="pointer-events-none fixed inset-0 z-[150] bg-[#050505]"
          initial={{ opacity: first ? 0 : 1 }}
          animate={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
          exit={{ opacity: 1, transition: { duration: 0.25 } }}
        />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="pointer-events-none fixed inset-0 z-[150]">
        {/* Two vertical panels: exit slides them down (cover), entry slides them up (reveal) */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute top-0 bottom-0 bg-[#0a0a0b]"
            style={{ left: `${i * 50}%`, width: "50%", willChange: "transform" }}
            initial={{ y: first ? "-100%" : "0%" }}
            animate={{
              y: "-100%",
              transition: first
                ? { duration: 0 }
                : { duration: 0.55, ease: EASE, delay: 0.4 + i * 0.07 },
            }}
            exit={{
              y: "0%",
              transition: { duration: 0.45, ease: EASE, delay: i * 0.05 },
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-px bg-cyan-accent/80 shadow-[0_0_12px_rgba(0,240,255,0.7)]" />
          </motion.div>
        ))}

        {/* Destination page name — flashes while the screen is covered */}
        {!first && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { duration: 0.25, delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <KLogo className="h-7 w-7" />
            <span className="font-mono text-sm tracking-[0.35em] uppercase text-zinc-300">
              <span className="text-cyan-accent">/</span> {label}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
