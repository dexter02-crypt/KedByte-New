import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import KLogo from "@/components/KLogo";
import MagneticButton from "@/components/MagneticButton";
import TerminalCard from "@/components/TerminalCard";
import FloatingParticles from "@/components/FloatingParticles";
import MorphingText from "@/components/MorphingText";

const HERO_IMG = "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920";
const heroWords = ["WE", "BUILD"];
const morphingWords = ["DIGITAL", "INTELLIGENT", "SCALABLE", "INNOVATIVE", "POWERFUL"];

/**
 * SystemDeployHero - Complete hero section with scroll-driven logo animation
 * Premium "System Deploy" effect where logo starts huge and moves to navbar
 */
export default function SystemDeployHero() {
  const heroRef = useRef(null);
  const [deployComplete, setDeployComplete] = useState(false);

  // Scroll progress through entire hero section (200vh tall)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // === LOGO ANIMATIONS ===
  // Logo moves from center to top-left navbar position
  const logoX = useTransform(smoothProgress, [0, 1], ["50vw", "6rem"]);
  const logoY = useTransform(smoothProgress, [0, 1], ["50vh", "2.5rem"]);
  const logoScale = useTransform(smoothProgress, [0, 0.7, 1], [6, 1.8, 1]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.9, 1], [1, 0.95, 0]);
  const glowIntensity = useTransform(smoothProgress, [0, 0.7, 1], [80, 30, 0]);

  // === CONTENT REVEAL ===
  const contentOpacity = useTransform(smoothProgress, [0, 0.25, 0.55], [0, 0, 1]);
  const contentY = useTransform(smoothProgress, [0, 0.25, 0.55], [80, 50, 0]);
  const contentBlur = useTransform(smoothProgress, [0, 0.25, 0.55], [10, 5, 0]);

  // === SYSTEM STATUS ===
  const statusOpacity = useTransform(smoothProgress, [0, 0.15, 0.35], [1, 1, 0]);
  const statusY = useTransform(smoothProgress, [0, 0.35], [0, -30]);

  // === TERMINAL PROGRESS ===
  const terminalProgress = useTransform(smoothProgress, [0, 1], [8, 100]);

  // === BACKGROUND ===
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const overlayOpacity = useTransform(smoothProgress, [0, 1], [0.3, 0.85]);

  return (
    <div ref={heroRef} className="relative" style={{ height: "200vh" }} data-testid="system-deploy-hero">
      {/* BACKGROUND - Fixed during scroll */}
      <div className="fixed inset-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
          <img src={HERO_IMG} alt="Abstract technology" className="h-[130%] w-full object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        
        {/* Floating particles */}
        <FloatingParticles count={12} />
        
        {/* Glow orbs */}
        <motion.div 
          className="glow-orb absolute -top-20 right-[10%] h-[420px] w-[420px]"
          animate={{
            opacity: [0.25, 0.5, 0.25],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* ANIMATED LOGO - Moves from center to navbar */}
      <motion.div
        className="fixed z-50"
        style={{
          left: logoX,
          top: logoY,
          x: "-50%",
          y: "-50%",
          scale: logoScale,
          opacity: logoOpacity,
        }}
      >
        <motion.div
          style={{
            filter: useTransform(
              glowIntensity,
              (v) => `drop-shadow(0 0 ${v}px rgba(0, 240, 255, 1)) drop-shadow(0 0 ${v * 1.5}px rgba(0, 240, 255, 0.6)) drop-shadow(0 0 ${v * 2}px rgba(0, 240, 255, 0.3))`
            ),
          }}
        >
          <KLogo className="w-16 h-16 md:w-24 md:h-24" animate />
        </motion.div>
      </motion.div>

      {/* SYSTEM STATUS - Appears initially, fades out */}
      <motion.div
        className="fixed top-1/2 left-1/2 z-40 w-full max-w-md px-6"
        style={{
          x: "-50%",
          y: useTransform(statusY, (v) => `calc(50% + ${v}px + 10rem)`),
          opacity: statusOpacity,
        }}
      >
        <div className="text-center space-y-6">
          <motion.div>
            <motion.p className="font-mono text-sm md:text-base tracking-[0.3em] uppercase text-cyan-accent mb-2">
              System Deploy
            </motion.p>
            <motion.p className="font-mono text-xs text-zinc-500">
              Kedbyte Private Limited
            </motion.p>
          </motion.div>
          
          <motion.div className="flex items-center gap-3 justify-center">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-cyan-accent"
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.span className="font-mono text-xs text-zinc-400">
              Initializing deployment sequence...
            </motion.span>
          </motion.div>

          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-accent to-blue-500 rounded-full"
              style={{
                width: useTransform(smoothProgress, [0, 0.35], ["0%", "100%"]),
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* HERO CONTENT - Fades in as logo moves out */}
      <motion.div
        className="fixed inset-0 z-10 h-screen flex items-center justify-center"
        style={{
          opacity: contentOpacity,
          y: contentY,
          filter: useTransform(contentBlur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            {/* Tagline */}
            <motion.p
              className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-accent mb-6"
              initial={{ opacity: 0 }}
              style={{ opacity: contentOpacity }}
            >
              Kedbyte Private Limited — Software · AI · Automation
            </motion.p>

            {/* Main title */}
            <h1 className="font-heading font-black uppercase tracking-tighter text-white leading-[0.85] text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]">
              {heroWords.map((w, i) => (
                <span key={w} className="block">
                  {w}
                </span>
              ))}
              <span className="block text-glow text-cyan-accent">
                <MorphingText words={morphingWords} interval={2000} />
              </span>
              <span className="block">FUTURES</span>
            </h1>

            {/* Description & CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p className="max-w-md text-zinc-300 text-base md:text-lg leading-relaxed">
                An ultra-minimal software studio engineering intelligent, high-performance
                products — from interface to AI to infrastructure.
              </p>
              <MagneticButton to="/contact" testid="home-hero-cta">
                Start a project
              </MagneticButton>
            </div>
          </div>

          {/* Terminal - Bottom right */}
          <motion.div 
            className="absolute bottom-12 right-6 md:right-12 hidden lg:block"
            style={{ opacity: contentOpacity }}
          >
            <TerminalCard progress={terminalProgress} />
          </motion.div>
        </div>
      </motion.div>

      {/* HUD Elements */}
      <motion.div 
        className="fixed top-28 left-6 md:left-12 z-20 hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
        style={{ opacity: contentOpacity }}
      >
        <motion.span 
          className="h-1.5 w-1.5 rounded-full bg-cyan-accent"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        Systems operational
      </motion.div>
      
      <motion.div 
        className="fixed top-28 right-6 md:right-12 z-20 hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
        style={{ opacity: contentOpacity }}
      >
        22.31°N · 73.18°E — Vadodara
      </motion.div>
    </div>
  );
}
