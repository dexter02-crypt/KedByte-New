import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * PageScrollIndicator — slim scroll rail on the right edge.
 *
 * Lives entirely inside a fixed 48px gutter (right-0 w-12) that page content
 * already clears: max-w-7xl containers carry >=48px side padding at 1280px
 * and real margins above that. z-[15] keeps it above page content (z-10)
 * but below the header (z-50) and curtains. Hidden below 1280px.
 */
export default function PageScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const percentage = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  return (
    <div
      aria-hidden="true"
      className="fixed right-0 top-1/2 z-[15] hidden w-12 -translate-y-1/2 flex-col items-center gap-3 xl:flex"
    >
      <div
        className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-600"
        style={{ writingMode: "vertical-rl" }}
      >
        Progress
      </div>

      {/* Rail */}
      <div className="relative h-56 w-px overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-cyan-accent shadow-[0_0_6px_rgba(0,240,255,0.6)]"
          style={{ scaleY }}
        />
      </div>

      <motion.span className="font-mono text-[10px] text-cyan-accent/80">
        {percentage}
      </motion.span>
    </div>
  );
}
