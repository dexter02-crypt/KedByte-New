import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const SEGMENT_HEIGHT = 96;

/**
 * TracingBeam — vertical reading indicator along a section's left edge.
 * A dim hairline with a bright cyan segment (soft glow) whose position is
 * scroll-linked via useScroll/useTransform — pure transform, no layout work.
 * Reduced motion: just the static hairline.
 */
export default function TracingBeam({ children, className = "" }) {
  const ref = useRef(null);
  const railRef = useRef(null);
  const reduced = useReducedMotion();
  const [maxY, setMaxY] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, maxY]);

  useEffect(() => {
    const measure = () =>
      railRef.current &&
      setMaxY(Math.max(0, railRef.current.clientHeight - SEGMENT_HEIGHT));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        ref={railRef}
        className="absolute left-0 top-0 h-full w-px bg-white/10"
        aria-hidden
      >
        {!reduced && (
          <motion.div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-cyan-accent to-transparent shadow-[0_0_12px_rgba(0,240,255,0.6)]"
            style={{ y, height: SEGMENT_HEIGHT, willChange: "transform" }}
          />
        )}
      </div>
      <div className="pl-8 md:pl-12">{children}</div>
    </div>
  );
}
