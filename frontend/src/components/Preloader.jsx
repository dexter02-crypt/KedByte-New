import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "@/components/SplitText";
import useMediaQuery from "@/hooks/use-media-query";

const EASE = [0.76, 0, 0.24, 1];

/**
 * Preloader — one-time site entrance, shown only on the first full page load
 * (App mounts once; route changes never remount it).
 *
 * Timeline (~2.2s total):
 *   0.00s  counter starts ticking 0 → 100 (JetBrains Mono, bottom-left)
 *   0.15s  KEDBYTE wordmark staggers in via SplitText
 *   1.35s  counter hits 100, content fades, onReveal() mounts the app under us
 *   1.55s  two vertical panels wipe upward (staggered, cyan hairline seam)
 *   2.25s  onComplete() unmounts the preloader
 *
 * Reduced motion: static wordmark, quick fade, same callbacks.
 */
export default function Preloader({ onReveal, onComplete }) {
  const reduced = useReducedMotion();
  // Single full-width panel on mobile, two staggered halves on desktop
  const mobile = useMediaQuery("(max-width: 767px)");
  const panels = mobile ? [0] : [0, 1];
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const revealed = useRef(false);

  const reveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal?.();
  };

  useEffect(() => {
    if (reduced) {
      const revealT = setTimeout(reveal, 300);
      const exitT = setTimeout(() => setExiting(true), 500);
      return () => {
        clearTimeout(revealT);
        clearTimeout(exitT);
      };
    }

    const DURATION = 1350;
    const start = performance.now();
    let rafId = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        reveal();
        setTimeout(() => setExiting(true), 200);
      }
    });
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) {
    return (
      <motion.div
        data-testid="site-preloader"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => exiting && onComplete?.()}
        aria-hidden="true"
      >
        <span className="font-heading font-black tracking-tighter text-4xl md:text-6xl text-white">
          KED<span className="text-cyan-accent">BYTE</span>
        </span>
      </motion.div>
    );
  }

  return (
    <div data-testid="site-preloader" className="fixed inset-0 z-[200] pointer-events-none" aria-hidden="true">
      {/* Vertical panels — wipe upward on exit, cyan hairline at the seam */}
      {panels.map((i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 bg-[#050505]"
          style={{
            left: `${i * (100 / panels.length)}%`,
            width: `${100 / panels.length}%`,
            willChange: "transform",
          }}
          animate={{ y: exiting ? "-100%" : "0%" }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          onAnimationComplete={() => {
            if (exiting && i === panels.length - 1) onComplete?.();
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-px bg-cyan-accent/80 shadow-[0_0_12px_rgba(0,240,255,0.7)]" />
        </motion.div>
      ))}

      {/* Content sits above the panels and fades just before the wipe */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="font-heading font-black uppercase tracking-tight text-5xl md:text-7xl leading-none">
          <SplitText text="KED" className="text-white" delay={0.15} charDelay={0.06} />
          <SplitText text="BYTE" className="text-cyan-accent text-glow" delay={0.33} charDelay={0.06} />
        </h1>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-6 md:left-12 font-mono text-sm tracking-[0.2em] text-zinc-400"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <span className="text-cyan-accent">{String(count).padStart(3, "0")}</span>%
      </motion.div>
    </div>
  );
}
