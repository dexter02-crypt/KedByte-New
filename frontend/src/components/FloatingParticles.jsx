import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FloatingParticles - Animated background particles
 *
 * `active` pauses the drift loops (used with an IntersectionObserver on the
 * parent section so off-screen particles cost nothing).
 * `dim` renders them smaller and fainter — atmosphere, not confetti.
 * Reduced motion: renders nothing (pure decoration).
 */
export default function FloatingParticles({ count = 20, active = true, dim = false }) {
  const reduced = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: dim ? Math.random() * 2 + 1 : Math.random() * 4 + 1,
        drift: Math.random() * 20 - 10,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })),
    [count, dim]
  );

  if (reduced) return null;

  const [lo, hi] = dim ? [0.15, 0.45] : [0.3, 0.8];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${dim ? "bg-cyan-accent/20" : "bg-cyan-accent/30"}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={
            active
              ? {
                  y: [0, -30, 0],
                  x: [0, p.drift, 0],
                  opacity: [lo, hi, lo],
                  scale: [1, 1.2, 1],
                }
              : { opacity: lo }
          }
          transition={
            active
              ? {
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
