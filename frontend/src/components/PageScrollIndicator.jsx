import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * PageScrollIndicator - Beautiful scroll progress indicator from top to bottom
 * Shows page progress with animated line and percentage
 */
export default function PageScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const percentage = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2">
      {/* Background line */}
      <div className="relative w-0.5 h-64 bg-white/10 rounded-full overflow-hidden">
        {/* Animated progress line */}
        <motion.div
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-cyan-accent via-cyan-accent to-transparent rounded-full origin-top"
          style={{ 
            scaleY,
            boxShadow: "0 0 10px rgba(0, 240, 255, 0.5)"
          }}
        />
        
        {/* Glowing dot at current position */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-accent"
          style={{
            top: dotTop,
            boxShadow: "0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)"
          }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-accent"
            animate={{
              scale: [1, 2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Milestone markers */}
        {[0, 0.25, 0.5, 0.75, 1].map((milestone, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ink border-2 border-white/20"
            style={{
              top: `${milestone * 100}%`,
            }}
            animate={{
              borderColor: scrollYProgress.get() >= milestone - 0.05 && scrollYProgress.get() <= milestone + 0.05 
                ? "rgba(0,240,255,1)" 
                : "rgba(255,255,255,0.2)",
              scale: scrollYProgress.get() === milestone ? 1.5 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Percentage indicator */}
      <motion.div
        className="mt-2 font-mono text-xs text-cyan-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span>{percentage}</motion.span>
      </motion.div>
    </div>
  );
}
