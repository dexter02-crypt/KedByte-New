import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";

/**
 * ScrollConnectedPath — vertical cyan pipeline drawn down the left side of a
 * list as the user scrolls (desktop only; children handle their own mobile
 * fallback). The line is an SVG path whose pathLength is scroll-linked via
 * useScroll — transform/paint only, no layout.
 *
 * Use with the exported PathNode inside each list item: a mono-numbered node
 * on the rail that lights up (cyan fill + glow pulse) when its item is in view.
 *
 * Reduced motion: the path renders fully drawn, nodes appear lit.
 */
export default function ScrollConnectedPath({ children, className = "" }) {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Rail — desktop only. Progress via scaleY (transform-only). */}
      <div
        className="pointer-events-none absolute left-8 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block"
        aria-hidden
      >
        <motion.div
          className="h-full w-full origin-top bg-cyan-accent shadow-[0_0_6px_rgba(0,240,255,0.7)]"
          style={{ scaleY: reduced ? 1 : scrollYProgress, willChange: "transform" }}
        />
      </div>

      {/* Content — reserved left column the blocks cannot enter (rail center
          sits at x=32px; content starts at 112px) */}
      <div className="md:pl-28">{children}</div>
    </div>
  );
}

/**
 * PathNode — node circle sitting on the ScrollConnectedPath rail. Render
 * inside a `relative` list item; it positions itself onto the rail
 * (content is inset md:pl-24 = 96px; rail center x = 32px → left: -64px).
 * `active` lights it up: cyan ring/fill, glow pulse, mono index turns cyan.
 * (content inset is md:pl-28 = 112px; rail center x = 32px → left: -80px)
 *
 * `top` (px, relative to the block) anchors the node beside its block's
 * kicker line; falls back to the block's vertical center. The opaque
 * bg-ink base sits above the rail (z-10) so the line terminates at the
 * node's edge instead of running through the digits.
 */
export function PathNode({ index, active, top }) {
  const reduced = useReducedMotion();
  const lit = active || reduced;

  return (
    <div
      className="absolute -left-20 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{ top: top ?? "50%" }}
    >
      {/* Opaque base — occludes the rail line behind the node */}
      <div className="rounded-full bg-ink">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          animate={
            lit
              ? {
                  borderColor: "rgba(0,240,255,0.8)",
                  backgroundColor: "rgba(0,240,255,0.12)",
                  boxShadow: [
                    "0 0 0px rgba(0,240,255,0)",
                    "0 0 18px rgba(0,240,255,0.7)",
                    "0 0 8px rgba(0,240,255,0.35)",
                  ],
                }
              : {
                  borderColor: "rgba(255,255,255,0.15)",
                  backgroundColor: "rgba(5,5,5,0)",
                  boxShadow: "0 0 0px rgba(0,240,255,0)",
                }
          }
          transition={{ duration: reduced ? 0 : 0.6, ease: "easeOut" }}
        >
          <span
            className={`font-mono text-[10px] transition-colors duration-500 ${
              lit ? "text-cyan-accent" : "text-zinc-500"
            }`}
          >
            {String(index).padStart(2, "0")}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
