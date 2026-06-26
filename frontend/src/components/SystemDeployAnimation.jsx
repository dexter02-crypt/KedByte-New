import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import KLogo from "@/components/KLogo";

/**
 * SystemDeployAnimation - Premium scroll-driven logo animation
 * Logo starts huge and centered, moves to navbar on scroll
 */
export default function SystemDeployAnimation({ onAnimationComplete }) {
  const containerRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);

  // Track scroll progress through hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animations for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Logo position: center → top-left
  // Start: 50vw, 50vh (center)
  // End: navbar position (approximately 3rem from left, 1.25rem from top)
  const logoX = useTransform(smoothProgress, [0, 1], ["50vw", "3rem"]);
  const logoY = useTransform(smoothProgress, [0, 1], ["50vh", "1.25rem"]);

  // Logo scale: 5x → 1x
  const logoScale = useTransform(smoothProgress, [0, 0.7, 1], [5, 1.5, 1]);

  // Logo opacity and glow
  const logoOpacity = useTransform(smoothProgress, [0, 0.9, 1], [1, 0.95, 0.85]);
  const glowIntensity = useTransform(smoothProgress, [0, 0.7, 1], [60, 20, 0]);

  // Hero content reveal (text, button, terminal)
  const contentOpacity = useTransform(smoothProgress, [0, 0.3, 0.6], [0, 0, 1]);
  const contentY = useTransform(smoothProgress, [0, 0.3, 0.6], [50, 30, 0]);

  // Navbar background reveal
  const navbarOpacity = useTransform(smoothProgress, [0.8, 1], [0, 1]);

  // Terminal progress sync: 8% → 100%
  const terminalProgress = useTransform(smoothProgress, [0, 1], [8, 100]);

  // System status text
  const statusOpacity = useTransform(smoothProgress, [0, 0.2, 0.4], [1, 1, 0]);

  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((value) => {
      if (value > 0.95 && !isComplete) {
        setIsComplete(true);
        onAnimationComplete?.();
      }
    });
    return unsubscribe;
  }, [smoothProgress, isComplete, onAnimationComplete]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      {/* Animated Logo - Fixed position during animation */}
      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{
          left: logoX,
          top: logoY,
          x: "-50%",
          y: "-50%",
          scale: logoScale,
          opacity: logoOpacity,
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            filter: useTransform(
              glowIntensity,
              (v) => `drop-shadow(0 0 ${v}px rgba(0, 240, 255, 0.8)) drop-shadow(0 0 ${v * 1.5}px rgba(0, 240, 255, 0.5))`
            ),
          }}
        >
          <KLogo className="w-16 h-16 md:w-20 md:h-20" animate />
        </motion.div>
      </motion.div>

      {/* System Status Text - Fades out early */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-32 md:translate-y-40 z-40 pointer-events-none"
        style={{ opacity: statusOpacity }}
      >
        <div className="text-center">
          <motion.p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-cyan-accent">
            System Deploy
          </motion.p>
          <motion.div className="mt-4 flex items-center gap-3 justify-center">
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-accent"
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.span className="font-mono text-xs text-zinc-500">
              Initializing...
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Navbar Background - Appears when logo locks in */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-20 z-40 pointer-events-none"
        style={{ opacity: navbarOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-black/95 backdrop-blur-3xl border-b border-cyan-accent/20" />
      </motion.div>

      {/* Hero Content - Fades in as logo moves */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <div className="h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pointer-events-auto">
            {/* This will be the placeholder for hero content */}
            {/* The actual content will be rendered by Home.jsx */}
          </div>
        </div>
      </motion.div>

      {/* Export terminal progress for external use */}
      <div className="hidden" data-terminal-progress={terminalProgress} />
    </div>
  );
}
