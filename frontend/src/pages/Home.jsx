import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cloud, Code2, BrainCircuit, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import Counter from "@/components/Counter";
import TechMarquee from "@/components/TechMarquee";
import CTASection from "@/components/CTASection";
import TerminalCard from "@/components/TerminalCard";
import SectionKicker from "@/components/SectionKicker";
import Corners from "@/components/Corners";
import SplitText from "@/components/SplitText";
import MouseTilt3D from "@/components/MouseTilt3D";
import ParallaxLayer from "@/components/ParallaxLayer";
import FloatingParticles from "@/components/FloatingParticles";
import SectionIndicator from "@/components/SectionIndicator";
import { Link } from "react-router-dom";

const HERO_IMG =
  "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920";

const heroWords = ["WE", "BUILD", "DIGITAL", "FUTURES"];

const stats = [
  { to: 99.9, suffix: "%", decimals: 1, label: "Deployment reliability" },
  { to: 5, suffix: "+", decimals: 0, label: "Core capabilities" },
  { to: 2026, suffix: "", decimals: 0, label: "Founded in Gujarat" },
  { to: 24, suffix: "/7", decimals: 0, label: "Pipeline monitoring" },
];

const services = [
  {
    icon: Code2,
    title: "Custom Software & Apps",
    desc: "Web platforms, mobile apps and bespoke enterprise software — engineered to be fast, scalable and effortless to use.",
    span: "md:col-span-7",
    img: "https://images.pexels.com/photos/12627677/pexels-photo-12627677.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    desc: "Custom models, fine-tuning and seamless AI integration built into your product.",
    span: "md:col-span-5",
    img: "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    icon: Cloud,
    title: "Infrastructure, Pipelines & Automation",
    desc: "CI/CD pipelines, DevOps and workflow automation — secure, monitored and highly available by default.",
    span: "md:col-span-12",
    img: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div data-testid="home-page">
      <SectionIndicator />
      
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen overflow-hidden" data-testid="home-hero">
        {/* Background layers with enhanced parallax */}
        <motion.div className="absolute inset-0" style={{ y: imgY, scale }}>
          <img src={HERO_IMG} alt="Abstract technology" className="h-[130%] w-full object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} />
        
        {/* Multiple parallax gradient layers */}
        <ParallaxLayer speed={0.3} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.5} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
        </ParallaxLayer>
        
        {/* Animated tech grid */}
        <motion.div 
          className="tech-grid grid-fade absolute inset-0 opacity-60"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles */}
        <FloatingParticles count={30} />
        
        {/* Animated glow orbs */}
        <motion.div 
          className="glow-orb absolute -top-20 right-[10%] h-[420px] w-[420px]"
          animate={{
            opacity: [0.35, 0.7, 0.35],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="glow-orb absolute bottom-20 left-[15%] h-[320px] w-[320px]"
          animate={{
            opacity: [0.25, 0.5, 0.25],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* HUD corner readouts with enhanced animation */}
        <motion.div 
          className="absolute top-28 left-6 md:left-12 z-10 hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
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
          className="absolute top-28 right-6 md:right-12 z-10 hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500"
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

        <ParallaxLayer speed={-0.2}>
          <motion.div
            style={{ y: textY }}
            className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-accent mb-6"
            >
              <SplitText text="Kedbyte Private Limited — Software · AI · Automation" delay={0.3} charDelay={0.02} />
            </motion.p>

            <h1 className="font-heading font-black uppercase tracking-tighter text-white leading-[0.85] text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]">
              {heroWords.map((w, i) => (
                <span key={w} className="block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", rotateX: -90 }}
                    animate={{ y: 0, rotateX: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w === "FUTURES" ? (
                      <motion.span 
                        className="text-glow text-cyan-accent"
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(0, 240, 255, 0.3)",
                            "0 0 40px rgba(0, 240, 255, 0.6)",
                            "0 0 20px rgba(0, 240, 255, 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {w}
                      </motion.span>
                    ) : w}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <motion.p 
                className="max-w-md text-zinc-300 text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                An ultra-minimal software studio engineering intelligent, high-performance
                products — from interface to AI to infrastructure.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <MagneticButton to="/contact" testid="home-hero-cta">
                  Start a project
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </ParallaxLayer>

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
        <motion.div 
          className="max-w-7xl mx-auto px-6 md:px-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 text-center">
            <SplitText text="The stack we engineer with" delay={0} charDelay={0.02} />
          </p>
        </motion.div>
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
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
                  <SplitText text="Capabilities engineered for scale." type="words" delay={0.2} charDelay={0.05} />
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

          <div className="grid md:grid-cols-12 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className={s.span}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: i * 0.15, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <MouseTilt3D strength={0.3} className="h-full">
                  <Link
                    to="/services"
                    data-testid={`home-service-card-${i}`}
                    className="glow-card group block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 md:p-10 transition-all duration-500 hover:border-cyan-accent/30"
                  >
                    <Corners className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {s.img && (
                      <motion.div 
                        className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-700"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      >
                        <img src={s.img} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30" />
                      </motion.div>
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <s.icon className="h-9 w-9 text-cyan-accent" />
                        </motion.div>
                        <motion.span 
                          className="font-mono text-xs text-zinc-600"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: i * 0.15 + 0.3 }}
                        >
                          0{i + 1}
                        </motion.span>
                      </div>
                      <div className="mb-20 md:mb-28" />
                      <h3 className="font-heading text-2xl md:text-3xl tracking-tight text-white">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-zinc-400 max-w-md leading-relaxed">{s.desc}</p>
                      <motion.span 
                        className="mt-6 inline-flex items-center gap-1.5 text-sm text-white"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Explore
                        <motion.div
                          whileHover={{ rotate: 45 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </motion.div>
                      </motion.span>
                    </div>
                  </Link>
                </MouseTilt3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
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
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: i * 0.1, 
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
            >
              <div className="border-l border-white/10 pl-5 group cursor-default">
                <div className="font-heading font-black tracking-tighter text-5xl md:text-6xl text-white">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <motion.p 
                  className="mt-3 font-mono text-xs tracking-wider uppercase text-zinc-500 group-hover:text-cyan-accent transition-colors"
                >
                  {s.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
