import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";

/**
 * IntroSequence — first-visit cinematic cold open on Home (desktop only).
 *
 * A single 7.2s muted video (public/video/intro-descent.mp4): descent through
 * darkness, seam ignition, landing frame-matched to the hero scrub's frame 0
 * (the shot was generated FROM that frame and plays reversed, so the landing
 * is pixel-derived — the 250ms crossfade at the end hides only codec noise).
 *
 * The KEDBYTE wordmark and skip affordance are HTML overlays timed to
 * video.currentTime via rAF — never baked into footage (brand integrity),
 * and they stay in sync through decode hitches.
 *
 * Eligibility is decided by the caller (App): hover-capable pointer, motion
 * allowed, no data-saver / slow connection, Home path, not seen this session.
 * Everyone else gets the Preloader exactly as before.
 *
 * Failure never blanks the page: if playback hasn't started within 1.2s the
 * component bails to the Preloader via onFallback.
 */
const WORDMARK_IN = 2.2; // seam ignition — brand and light arrive together
const WORDMARK_OUT = 6.0;

export const INTRO_SESSION_KEY = "kb_intro_seen";

export function introEligible() {
  try {
    if (window.sessionStorage.getItem(INTRO_SESSION_KEY)) return false;
  } catch {
    return false;
  }
  if (window.location.pathname !== "/") return false;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || ""))) return false;
  return true;
}

export default function IntroSequence({ onReveal, onComplete, onFallback }) {
  const videoRef = useRef(null);
  const startedRef = useRef(false);
  const endedRef = useRef(false);
  const [phase, setPhase] = useState("hold"); // hold | playing | handoff
  const [wordmark, setWordmark] = useState("out"); // out | in | exit

  // Mark seen as soon as we commit to playing the intro, so a mid-intro
  // reload lands on the normal preloader instead of replaying.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* private mode: intro may replay next load; harmless */
    }
  }, []);

  // Handoff: mount the app underneath (hero poster paints), fade this
  // overlay out over 250ms, then unmount on a fixed timer — not on
  // framer's onAnimationComplete, which can be starved by the heavy app
  // mount happening at the same moment.
  const finish = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    onReveal?.();
    setPhase("handoff");
    setTimeout(() => onComplete?.(), 320);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const bail = setTimeout(() => {
      if (!startedRef.current) onFallback?.();
    }, 1200);

    const onPlaying = () => {
      startedRef.current = true;
      clearTimeout(bail);
      setPhase("playing");
    };
    video.addEventListener("playing", onPlaying);
    video.play().catch(() => onFallback?.());

    let rafId = requestAnimationFrame(function tick() {
      const t = video.currentTime;
      setWordmark(t >= WORDMARK_OUT ? "exit" : t >= WORDMARK_IN ? "in" : "out");
      // Trigger the handoff just before the file ends so the crossfade
      // overlaps the near-static landing frames.
      if (video.duration && t >= video.duration - 0.25) finish();
      else rafId = requestAnimationFrame(tick);
    });
    const onEnded = () => finish();
    video.addEventListener("ended", onEnded);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      clearTimeout(bail);
      cancelAnimationFrame(rafId);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      data-testid="intro-sequence"
      className="fixed inset-0 z-[200] bg-black"
      animate={{ opacity: phase === "handoff" ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <video
        ref={videoRef}
        src="/video/intro-descent.mp4"
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        aria-hidden="true"
      />

      {/* Wordmark — crisp HTML, arrives with the seam's ignition */}
      {wordmark !== "out" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ opacity: wordmark === "exit" ? 0 : 1, y: wordmark === "exit" ? -24 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-heading font-black uppercase tracking-tight text-5xl md:text-7xl leading-none">
            <SplitText text="KED" className="text-white" delay={0} charDelay={0.09} />
            <SplitText text="BYTE" className="text-cyan-accent text-glow" delay={0.27} charDelay={0.09} />
          </div>
        </motion.div>
      )}

      {/* Skip affordance — visible from ~0.8s */}
      <motion.button
        type="button"
        data-testid="intro-skip"
        onClick={finish}
        className="absolute bottom-8 right-8 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-400 hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "handoff" ? 0 : 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Skip — Esc
      </motion.button>
    </motion.div>
  );
}
