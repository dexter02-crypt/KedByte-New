import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/Stagger";
import SectionKicker from "@/components/SectionKicker";
import Counter from "@/components/Counter";
import CTASection from "@/components/CTASection";
import MorphingText from "@/components/MorphingText";
import GlitchText from "@/components/GlitchText";
import MouseTilt3D from "@/components/MouseTilt3D";
import TracingBeam from "@/components/TracingBeam";
import Spotlight from "@/components/Spotlight";

const EASE = [0.22, 1, 0.36, 1];

const values = [
  { title: "Craft over haste", desc: "We ship fast — but never at the cost of code we'd be embarrassed to maintain." },
  { title: "Ownership", desc: "We act like founders. Your outcomes are our outcomes, from kickoff to scale." },
  { title: "Clarity", desc: "Plain language, honest timelines, no jargon walls. You always know where things stand." },
  { title: "Long horizons", desc: "We build systems meant to last years, not demos meant to impress for a week." },
];

const morphingValues = ["Innovation", "Excellence", "Integrity", "Impact"];

const OFFICE_IMG = "/images/about-studio-1600.webp";
const OFFICE_IMG_SET =
  "/images/about-studio-800.webp 800w, /images/about-studio-1600.webp 1600w";

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="relative pt-32 pb-12 md:pt-52 md:pb-24 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        <div className="glow-orb animate-pulse-glow absolute -top-10 left-[20%] h-[420px] w-[420px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[ 03 ]">About Kedbyte</SectionKicker>
          </Reveal>
          <Reveal delay={0.1} variant="mask">
            <h1 className="mt-6 font-heading font-black uppercase tracking-tight text-5xl md:text-7xl lg:text-[7rem] text-white leading-[0.88] max-w-5xl">
              <span className="sr-only">
                About Kedbyte, a software studio in Vadodara, Gujarat —{" "}
              </span>
              A studio for the <GlitchText className="text-cyan-accent text-glow" glitchOnHover>curious</GlitchText> & the bold.
            </h1>
          </Reveal>

          {/* Page-intro hairline draws beneath the header */}
          <motion.div
            className="mt-14 h-px w-full origin-left bg-white/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          />
        </div>
      </section>

      {/* Big image */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-[16/9]">
              <motion.img
                src={OFFICE_IMG}
                srcSet={OFFICE_IMG_SET}
                sizes="(min-width: 1280px) 1152px, 92vw"
                width={1600}
                height={1067}
                loading="lazy"
                alt="Dark minimal room with a single cyan light line above a long table — a mood study of Kedbyte's design ethos"
                className="h-full w-full object-cover"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial story — tracing beam reading indicator on the left edge */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <TracingBeam>
            <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400">Our story</p>
            </Reveal>
          </div>
          <div className="md:col-span-8 space-y-8">
            <Reveal>
              <p className="font-heading text-2xl md:text-3xl text-white leading-snug tracking-tight">
                Kedbyte Private Limited began with a simple belief: ultimate
                sophistication lies in simplicity.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Founded in 2026 and headquartered in Vadodara, Gujarat, we're a
                full-spectrum technology studio operating at the intersection of
                advanced engineering and ultra-minimal design. From web and mobile
                apps to backend systems, AI models, smart contracts and automated
                pipelines, we turn complex requirements into fast, reliable and
                visually striking software.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-zinc-400 text-lg leading-relaxed">
                We strip away the noise. Every product we ship — whether a frontend
                interface or a fine-tuned machine learning model — is built to feel
                fast, focused and effortless. The result is a single port of call,
                taking businesses from ideation to production-grade technology.
              </p>
            </Reveal>
          </div>
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/10 bg-surface/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { to: 2026, suffix: "", label: "Founded" },
            { to: 6, suffix: "", label: "Core capabilities" },
            { to: 100, suffix: "%", label: "In-house delivery" },
            { to: 1, suffix: "", label: "Single partner" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="font-heading font-black tracking-tighter text-4xl md:text-5xl text-white">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-zinc-400 text-sm">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal variant="mask">
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white mb-4">
              What we stand for.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-cyan-accent text-xl mb-16">
              <MorphingText words={morphingValues} interval={2500} />
            </p>
          </Reveal>
          <StaggerGroup className="grid md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <StaggerItem key={v.title}>
                <MouseTilt3D strength={0.3}>
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 md:p-10 h-full transition-colors duration-500 hover:border-cyan-accent/40">
                    <Spotlight />
                    <span className="font-mono text-cyan-accent text-sm">
                      0{i + 1}
                    </span>
                    <h3 className="mt-4 font-heading text-2xl text-white tracking-tight">{v.title}</h3>
                    <p className="mt-3 text-zinc-400 leading-relaxed">{v.desc}</p>
                  </div>
                </MouseTilt3D>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection eyebrow="Want to work with us?" title="Let's make something remarkable." />
    </div>
  );
}
