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
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.85]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen overflow-hidden" data-testid="home-hero">
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img src={HERO_IMG} alt="Abstract technology" className="h-[120%] w-full object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
        <div className="tech-grid grid-fade absolute inset-0 opacity-60" />
        <div className="glow-orb animate-pulse-glow absolute -top-20 right-[10%] h-[420px] w-[420px]" />

        {/* HUD corner readouts */}
        <div className="absolute top-28 left-6 md:left-12 z-10 hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse-glow" />
          Systems operational
        </div>
        <div className="absolute top-28 right-6 md:right-12 z-10 hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
          22.31°N · 73.18°E — Vadodara
        </div>

        {/* Floating terminal */}
        <div className="absolute bottom-12 right-6 md:right-12 z-20 hidden lg:block">
          <TerminalCard />
        </div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-accent mb-6"
          >
            Kedbyte Private Limited — Software · AI · Automation
          </motion.p>

          <h1 className="font-heading font-black uppercase tracking-tighter text-white leading-[0.85] text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            {heroWords.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w === "FUTURES" ? <span className="text-glow text-cyan-accent">{w}</span> : w}
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
            <p className="max-w-md text-zinc-300 text-base md:text-lg leading-relaxed">
              An ultra-minimal software studio engineering intelligent, high-performance
              products — from interface to AI to infrastructure.
            </p>
            <MagneticButton to="/contact" testid="home-hero-cta">
              Start a project
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500"
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="py-12 border-y border-white/10 bg-ink">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 text-center">
            The stack we engineer with
          </p>
        </div>
        <TechMarquee />
      </section>

      {/* SERVICES BENTO */}
      <section className="relative py-24 md:py-40 overflow-hidden" data-testid="home-services">
        <div className="tech-grid grid-fade absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <Reveal>
                <SectionKicker index="[01]">What we do</SectionKicker>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
                  Capabilities engineered for scale.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                data-testid="home-services-link"
              >
                All services
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-12 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1} className={s.span}>
                <Link
                  to="/services"
                  data-testid={`home-service-card-${i}`}
                  className="glow-card group block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 md:p-10 hover:-translate-y-1"
                >
                  <Corners className="opacity-0 group-hover:opacity-100" />
                  {s.img && (
                    <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                      <img src={s.img} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <s.icon className="h-9 w-9 text-cyan-accent" />
                      <span className="font-mono text-xs text-zinc-600">0{i + 1}</span>
                    </div>
                    <div className="mb-20 md:mb-28" />
                    <h3 className="font-heading text-2xl md:text-3xl tracking-tight text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-zinc-400 max-w-md leading-relaxed">{s.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-white">
                      Explore
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-24 border-y border-white/10 bg-surface/40 overflow-hidden" data-testid="home-stats">
        <div className="tech-grid grid-fade absolute inset-0 opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-l border-white/10 pl-5">
                <div className="font-heading font-black tracking-tighter text-5xl md:text-6xl text-white">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <p className="mt-3 font-mono text-xs tracking-wider uppercase text-zinc-500">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
