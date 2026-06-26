import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * PageScrollIndicator - Beautiful scroll progress indicator from top to bottom
 * Enhanced visibility with stronger glow effects and better contrast
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
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {/* Label */}
      <motion.div
        className="mb-2 font-mono text-[10px] tracking-widest uppercase text-cyan-accent/70"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Progress
      </motion.div>

      {/* Container with enhanced glow */}
      <div className="relative">
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 blur-xl bg-cyan-accent/20 rounded-full"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Background line with enhanced border */}
        <div className="relative w-1 h-72 bg-gradient-to-b from-white/20 via-white/10 to-white/5 rounded-full overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          {/* Animated progress line with stronger glow */}
          <motion.div
            className="absolute inset-x-0 top-0 rounded-full origin-top"
            style={{ 
              scaleY,
              background: "linear-gradient(to bottom, rgba(0,240,255,1), rgba(0,240,255,0.8), rgba(0,240,255,0.4))",
              boxShadow: "0 0 20px rgba(0,240,255,0.8), 0 0 40px rgba(0,240,255,0.5), inset 0 0 10px rgba(0,240,255,0.5)"
            }}
          />
          
          {/* Glowing dot at current position */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-accent"
            style={{
              top: dotTop,
              boxShadow: "0 0 20px rgba(0,240,255,1), 0 0 40px rgba(0,240,255,0.8), 0 0 60px rgba(0,240,255,0.6)"
            }}
          >
            {/* Multiple pulsing rings for emphasis */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-accent"
              animate={{
                scale: [1, 2.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-accent"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* Inner bright core */}
            <div className="absolute inset-1 rounded-full bg-white" />
          </motion.div>

          {/* Milestone markers with enhanced visibility */}
          {[0, 0.25, 0.5, 0.75, 1].map((milestone, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-ink border-2"
              style={{
                top: `${milestone * 100}%`,
                borderColor: "rgba(255,255,255,0.3)",
                boxShadow: "0 0 10px rgba(0,240,255,0.3)"
              }}
              animate={{
                borderColor: scrollYProgress.get() >= milestone - 0.05 && scrollYProgress.get() <= milestone + 0.05 
                  ? "rgba(0,240,255,1)" 
                  : "rgba(255,255,255,0.3)",
                scale: scrollYProgress.get() >= milestone - 0.05 && scrollYProgress.get() <= milestone + 0.05 ? 1.5 : 1,
                boxShadow: scrollYProgress.get() >= milestone - 0.05 && scrollYProgress.get() <= milestone + 0.05
                  ? "0 0 15px rgba(0,240,255,0.8)"
                  : "0 0 5px rgba(0,240,255,0.3)"
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Percentage indicator with enhanced styling */}
      <motion.div
        className="mt-3 font-mono text-base font-bold text-cyan-accent px-3 py-1.5 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          boxShadow: "0 0 15px rgba(0,240,255,0.3)"
        }}
      >
        <motion.span>{percentage}</motion.span>
      </motion.div>
    </div>
  );
}
