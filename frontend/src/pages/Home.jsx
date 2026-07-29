import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Cloud, Code2, BrainCircuit, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/Stagger";
import MagneticButton from "@/components/MagneticButton";
import Counter from "@/components/Counter";
import TechMarquee from "@/components/TechMarquee";
import CTASection from "@/components/CTASection";
import TerminalCard from "@/components/TerminalCard";
import SectionKicker from "@/components/SectionKicker";
import Corners from "@/components/Corners";
import MouseTilt3D from "@/components/MouseTilt3D";
import ParallaxLayer from "@/components/ParallaxLayer";
import FloatingParticles from "@/components/FloatingParticles";
import WordScramble from "@/components/WordScramble";
import MorphingText from "@/components/MorphingText";
import WaveText from "@/components/WaveText";
import SelectedWork from "@/components/SelectedWork";
import ProcessSection from "@/components/ProcessSection";
import { useCtaPanel } from "@/components/StartProjectPanel";
import { metrics } from "@/data/metrics";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);
const EASE = [0.22, 1, 0.36, 1];
const hoverSpring = { type: "spring", stiffness: 350, damping: 22 };

const HERO_IMG = "/images/hero-abstract-1600.webp";
const HERO_IMG_SET =
  "/images/hero-abstract-800.webp 800w, /images/hero-abstract-1600.webp 1600w";

const heroWords = ["WE", "BUILD"];
const morphingWords = ["DIGITAL", "INTELLIGENT", "SCALABLE", "INNOVATIVE", "POWERFUL"];

// Proof strip numbers live in src/data/metrics.js (see VERIFY notes there)

const services = [
  {
    icon: Code2,
    title: "Custom Software & Apps",
    desc: "Web platforms, mobile apps and bespoke enterprise software — engineered to be fast, scalable and effortless to use.",
    span: "md:col-span-7",
    img: "/images/bento-software-800.webp",
    imgSet: "/images/bento-software-800.webp 800w, /images/bento-software-1600.webp 1600w",
    imgW: 1600,
    imgH: 900,
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    desc: "Custom models, fine-tuning and seamless AI integration built into your product.",
    span: "md:col-span-5",
    img: "/images/hero-abstract-800.webp",
    imgSet: "/images/hero-abstract-800.webp 800w, /images/hero-abstract-1600.webp 1600w",
    imgW: 1600,
    imgH: 1067,
  },
  {
    icon: Cloud,
    title: "Infrastructure, Pipelines & Automation",
    desc: "CI/CD pipelines, DevOps and workflow automation — secure, monitored and highly available by default.",
    span: "md:col-span-12",
    img: "/images/infra-800.webp",
    imgSet: "/images/infra-800.webp 800w, /images/infra-1600.webp 1600w",
    imgW: 1600,
    imgH: 1068,
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const ctaPanel = useCtaPanel();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Pause hero atmosphere (orbs, particles) when the hero is off-screen
  const heroInView = useInView(heroRef, { amount: 0.15 });
  // Atmosphere mounts last in the entrance timeline (t≈1.3s)
  const [atmosphereReady, setAtmosphereReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAtmosphereReady(true), 1300);
    return () => clearTimeout(t);
  }, []);
  const breathing = heroInView && !reduced;

  return (
    <div data-testid="home-page">
      {/* HERO — min-h-screen (not h-screen) so short viewports grow instead of
          overflowing: content used to spill under the fixed header at the top
          and into the scroll indicator at the bottom */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden" data-testid="home-hero">
        {/* Background layers with enhanced parallax.
            Outer div = scroll parallax (unchanged); inner div = entrance scale. */}
        <motion.div className="absolute inset-0" style={{ y: imgY, scale }}>
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <img
              src={HERO_IMG}
              srcSet={HERO_IMG_SET}
              sizes="100vw"
              width={1600}
              height={1067}
              loading="eager"
              fetchPriority="high"
              alt="Abstract technology"
              className="h-[130%] w-full object-cover"
            />
          </motion.div>
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} />
        {/* Entrance-only overlay: starts opaque, eases out so the combined
            overlay settles at the scroll-driven resting opacity (t=0 → ~1s) */}
        <motion.div
          className="absolute inset-0 bg-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
        
        {/* Multiple parallax gradient layers */}
        <ParallaxLayer speed={0.3} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.5} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
        </ParallaxLayer>
        
        {/* Animated tech grid — fades in at t=0.3s */}
        <motion.div
          className="tech-grid grid-fade absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.6,
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            opacity: { delay: 0.3, duration: 0.6 },
            backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        />

        {/* Floating particles — mount last (t≈1.3s), dim, paused off-screen */}
        {atmosphereReady && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FloatingParticles count={8} dim active={heroInView} />
          </motion.div>
        )}

        {/* Animated glow orbs — fade in at t=1.3s, breathe only while in view */}
        <motion.div
          className="absolute -top-20 right-[10%] h-[420px] w-[420px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <motion.div
            className="glow-orb h-full w-full"
            animate={breathing ? { opacity: [0.35, 0.7, 0.35], scale: [1, 1.1, 1] } : { opacity: 0.35 }}
            transition={
              breathing
                ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-[15%] h-[320px] w-[320px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            className="glow-orb h-full w-full"
            animate={breathing ? { opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] } : { opacity: 0.25 }}
            transition={
              breathing
                ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                : { duration: 0.3 }
            }
          />
        </motion.div>

        {/* HUD corner readouts — top-24 (96px): clear of the 80px fixed header
            above, and of the hero content which starts at pt-32 (128px) */}
        <motion.div
          className="absolute top-24 left-6 md:left-12 z-10 hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
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
          className="absolute top-24 right-6 md:right-12 z-10 hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          22.31°N · 73.18°E — Vadodara
        </motion.div>

        {/* Floating terminal with enhanced animation */}
        <motion.div 
          className="absolute bottom-12 right-6 md:right-12 z-20 hidden lg:block"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1,
          }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TerminalCard />
          </motion.div>
        </motion.div>

        {/* pt-32 keeps the eyebrow below the fixed header; pb-36 reserves a
            bottom band so the CTA row never meets the scroll indicator */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center pt-32 pb-36"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-accent mb-6"
          >
            Kedbyte Private Limited — Software · AI · Automation
          </motion.p>

          {/* Headline lines mask-reveal sequentially from t=0.5s */}
          <h1 className="font-heading font-black uppercase tracking-tighter text-white leading-[0.85] text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            {heroWords.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", rotateX: -90 }}
                  animate={{ y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5 + 0.12 * i, duration: 0.9, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block text-glow text-cyan-accent"
                initial={{ y: "110%", rotateX: -90 }}
                animate={{
                  y: 0,
                  rotateX: 0,
                  textShadow: [
                    "0 0 30px rgba(0, 240, 255, 0.5)",
                    "0 0 60px rgba(0, 240, 255, 0.8)",
                    "0 0 30px rgba(0, 240, 255, 0.5)",
                  ],
                }}
                transition={{
                  y: { delay: 0.74, duration: 0.9, ease: EASE },
                  rotateX: { delay: 0.74, duration: 0.9, ease: EASE },
                  textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Starts cycling only after its line has fully revealed (~1.65s) */}
                <MorphingText words={morphingWords} interval={2000} startDelay={1700} />
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%", rotateX: -90 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ delay: 0.86, duration: 0.9, ease: EASE }}
              >
                FUTURES
              </motion.span>
            </span>
          </h1>

          {/* Sub-copy and CTA fade-up with stagger from t=1.0s */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <motion.p
              className="max-w-md text-zinc-300 text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              An ultra-minimal software studio engineering intelligent, high-performance
              products — from interface to AI to infrastructure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.18, duration: 0.6, ease: EASE }}
            >
              <MagneticButton onClick={ctaPanel.open} testid="home-hero-cta">
                Start a project
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="py-12 border-y border-white/10 bg-ink overflow-hidden">
        <Reveal className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 text-center">
            The stack we engineer with
          </p>
        </Reveal>
        <TechMarquee />
      </section>

      {/* SERVICES BENTO */}
      <section className="relative py-24 md:py-40 overflow-hidden" data-testid="home-services">
        <div className="tech-grid grid-fade absolute inset-0 opacity-30" />
        
        {/* Animated background elements */}
        <ParallaxLayer speed={0.2} className="absolute top-20 left-10">
          <motion.div
            className="w-64 h-64 rounded-full bg-cyan-accent/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </ParallaxLayer>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <Reveal>
                <SectionKicker index="[01]">What we do</SectionKicker>
              </Reveal>
              <Reveal delay={0.1} variant="mask">
                <h2 className="mt-4 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
                  Capabilities engineered for scale.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                  data-testid="home-services-link"
                >
                  All services
                  <motion.div
                    whileHover={{ rotate: 45 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </Reveal>
          </div>

          <StaggerGroup stagger={0.08} className="grid md:grid-cols-12 gap-5">
            {services.map((s, i) => (
              <StaggerItem
                key={s.title}
                className={s.span}
              >
                <MouseTilt3D strength={0.3} className="h-full">
                  <MotionLink
                    to="/services"
                    data-testid={`home-service-card-${i}`}
                    data-cursor-text="VIEW"
                    className="glow-card group block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 md:p-10 transition-all duration-500 hover:border-cyan-accent/30"
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                  >
                    {s.img && (
                      /* Hover-scale wrapper sits OUTSIDE the clip Reveal: variant
                         propagation from the card stops at any motion element
                         with its own object-form initial (like Reveal's). */
                      <motion.div
                        className="absolute inset-0 opacity-15 transition-[opacity,filter] duration-700 group-hover:opacity-30 group-hover:brightness-110"
                        variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
                        transition={hoverSpring}
                      >
                        <Reveal variant="clip" className="relative h-full w-full">
                          {/* Slow perpetual Ken Burns zoom, paused off-screen */}
                          <motion.img
                            src={s.img}
                            srcSet={s.imgSet}
                            sizes="(min-width: 768px) 60vw, 100vw"
                            width={s.imgW}
                            height={s.imgH}
                            loading="lazy"
                            alt=""
                            className="h-full w-full object-cover"
                            initial={false}
                            whileInView={reduced ? {} : { scale: [1, 1.06, 1] }}
                            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30" />
                        </Reveal>
                      </motion.div>
                    )}
                    <Corners className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Cyan hairline sweeping across the top border on hover */}
                    <span className="absolute left-0 top-0 z-20 h-px w-full origin-left scale-x-0 bg-cyan-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <s.icon className="h-9 w-9 text-cyan-accent" />
                        </motion.div>
                        <span className="font-mono text-xs text-zinc-600">
                          0{i + 1}
                        </span>
                      </div>
                      <div className="mb-20 md:mb-28" />
                      <h3 className="font-heading text-2xl md:text-3xl tracking-tight text-white">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-zinc-400 max-w-md leading-relaxed">{s.desc}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-white">
                        Explore
                        <motion.div
                          variants={{ rest: { x: 0, y: 0 }, hover: { x: 4, y: -4 } }}
                          transition={hoverSpring}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </motion.div>
                      </span>
                    </div>
                  </MotionLink>
                </MouseTilt3D>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* SELECTED WORK */}
      <SelectedWork />

      {/* PROCESS */}
      <ProcessSection />

      {/* PROOF STRIP (data: src/data/metrics.js) */}
      <section className="relative py-24 border-y border-white/10 bg-surface/40 overflow-hidden" data-testid="home-stats">
        <div className="tech-grid grid-fade absolute inset-0 opacity-20" />
        
        {/* Animated scanline effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-accent/5 to-transparent h-32"
          animate={{
            y: ["0%", "400%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <StaggerGroup className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {metrics.map((s) => (
            <StaggerItem key={s.label}>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
              >
                <div className="relative pl-5 group cursor-default">
                  {/* Hairline divider draws itself as the section enters */}
                  <motion.span
                    className="absolute left-0 top-0 h-full w-px origin-top bg-white/10"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                  />
                  <div className="font-heading font-black tracking-tighter text-5xl md:text-6xl text-white">
                    <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <motion.p 
                    className="mt-3 font-mono text-xs tracking-wider uppercase text-zinc-500 group-hover:text-cyan-accent transition-colors"
                  >
                    {s.label}
                  </motion.p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* PAYROLL TEASER — minimal, honest product strip */}
      <section className="border-b border-white/10" data-testid="home-payroll-teaser">
        <Reveal className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/payroll"
            className="group flex flex-col md:flex-row md:items-center justify-between gap-3 py-7"
            data-testid="home-payroll-link"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-3 py-1 font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-accent">
                New
              </span>
              <span className="text-zinc-300">
                <span className="font-heading font-bold text-white">Kedbyte Payroll</span>
                {" "}— UK payroll software for bureaux, in development.
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-400 group-hover:text-cyan-accent transition-colors">
              Early access
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* WORD SCRAMBLE - Interactive Service Discovery */}
      <section className="relative py-24 md:py-32 bg-ink border-y border-white/10 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-20" />
        <Reveal className="relative max-w-7xl mx-auto px-6 md:px-12">
          <WordScramble />
        </Reveal>
      </section>

      <CTASection />
    </div>
  );
}
