import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Cursor — the site's single custom cursor (consolidates the former
 * Cursor / CursorGlow / BeamCursor components).
 *
 * Layers:
 *  - ambient mouse-following background glow (the old CursorGlow)
 *  - small cyan dot at the pointer
 *  - trailing ring on a spring, with contextual states:
 *      default      → thin ring
 *      interactive  → ring expands, dot shrinks (links/buttons/inputs)
 *      pill         → ring becomes a mono-type pill reading the hovered
 *                     element's data-cursor-text ("VIEW", "OPEN", "CLOSE"…)
 *    plus a magnetic pull toward elements marked data-magnetic.
 *
 * Desktop pointer devices only; renders nothing on touch or under reduced
 * motion. The native cursor is never hidden on interactive elements
 * (accessibility fallback) — see index.css.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState({ type: "default", text: null });
  const magnetRef = useRef(null);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // Trailing ring springs
  const rx = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 350, damping: 30, mass: 0.6 });
  // Ambient glow follows lazily
  const gx = useSpring(mx, { damping: 50, stiffness: 100, restDelta: 0.5 });
  const gy = useSpring(my, { damping: 50, stiffness: 100, restDelta: 0.5 });

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e) => {
      let x = e.clientX;
      let y = e.clientY;
      // Magnetic pull: bias the cursor toward the target's center
      const magnet = magnetRef.current;
      if (magnet && magnet.isConnected) {
        const r = magnet.getBoundingClientRect();
        x = x + (r.left + r.width / 2 - x) * 0.35;
        y = y + (r.top + r.height / 2 - y) * 0.35;
      }
      mx.set(x);
      my.set(y);
    };

    const over = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const pill = t.closest("[data-cursor-text]");
      magnetRef.current = t.closest("[data-magnetic]");
      if (pill) {
        setMode({ type: "pill", text: pill.dataset.cursorText });
      } else if (t.closest("a, button, [role='button'], input, textarea, select")) {
        setMode({ type: "interactive", text: null });
      } else {
        setMode({ type: "default", text: null });
      }
    };

    // Clicks can change a target's data-cursor-text (e.g. OPEN → CLOSE);
    // re-evaluate after React has re-rendered.
    const click = (e) => setTimeout(() => over(e), 80);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("click", click);
      document.body.classList.remove("has-cursor");
      setEnabled(false);
    };
  }, [reduced, mx, my]);

  if (!enabled || reduced) return null;

  const isPill = mode.type === "pill";
  const isInteractive = mode.type === "interactive";

  return (
    <>
      {/* Ambient background glow (formerly CursorGlow) */}
      <div className="fixed inset-0 pointer-events-none bg-black" style={{ zIndex: -2 }} />
      <motion.div
        className="fixed pointer-events-none w-[1400px] h-[1400px] rounded-full"
        style={{
          zIndex: -1,
          left: gx,
          top: gy,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(15, 20, 35, 0.6) 0%, rgba(12, 16, 30, 0.45) 20%, rgba(10, 14, 26, 0.3) 40%, rgba(8, 11, 22, 0.18) 60%, rgba(5, 8, 18, 0.08) 80%, transparent 100%)",
          filter: "blur(180px)",
        }}
      />

      {/* Trailing ring / pill */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{ left: rx, top: ry, x: "-50%", y: "-50%" }}
      >
        <motion.div
          className={`flex items-center justify-center rounded-full border ${
            isPill
              ? "border-cyan-accent bg-cyan-accent px-3 py-1"
              : "border-cyan-accent/70"
          }`}
          animate={
            isPill
              ? { width: "auto", height: "auto", scale: 1, opacity: 1 }
              : isInteractive
                ? { width: 34, height: 34, scale: 1.6, opacity: 1 }
                : { width: 34, height: 34, scale: 1, opacity: 0.8 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{ backgroundColor: isInteractive ? "rgba(0,240,255,0.08)" : undefined }}
        >
          <AnimatePresence>
            {isPill && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[10px] font-medium tracking-[0.2em] text-[#050505] whitespace-nowrap"
              >
                {mode.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot at the pointer */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none h-1.5 w-1.5 rounded-full bg-cyan-accent shadow-[0_0_8px_rgba(0,240,255,0.8)]"
        style={{ left: mx, top: my, x: "-50%", y: "-50%" }}
        animate={{ scale: isPill ? 0 : isInteractive ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
