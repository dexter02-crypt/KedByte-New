import { motion } from "framer-motion";
import { Code2, Cloud, BrainCircuit, Palette, Layers, Workflow, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import CTASection from "@/components/CTASection";
import TextScramble from "@/components/TextScramble";
import WaveText from "@/components/WaveText";
import ScrollConnectedPath from "@/components/ScrollConnectedPath";

const services = [
  {
    icon: Code2,
    tag: "01 — Build",
    title: "Custom Software & Application Development",
    desc: "We design and engineer products end-to-end — high-performance web apps, polished native and cross-platform mobile apps, and bespoke enterprise software that automates operations and removes manual bottlenecks.",
    points: ["Responsive web applications", "Native & cross-platform mobile", "Bespoke enterprise software", "Workflow-driven platforms"],
    img: "https://images.pexels.com/photos/12627677/pexels-photo-12627677.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: Layers,
    tag: "02 — Engineer",
    title: "Frontend & Backend Engineering",
    desc: "Production-ready interfaces built to an ultra-minimal, futuristic design system, backed by secure, high-performance APIs and scalable server-side infrastructure capable of heavy, real-time workloads.",
    points: ["Pixel-perfect frontend", "Secure high-performance APIs", "Scalable backend architecture", "Real-time systems"],
    img: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    icon: BrainCircuit,
    tag: "03 — Intelligence",
    title: "Artificial Intelligence & Machine Learning",
    desc: "From custom AI architectures to rigorous training and fine-tuning for accuracy and low latency, we embed intelligent systems seamlessly into your software and workflows.",
    points: ["Custom AI models", "Training & fine-tuning", "Low-latency inference", "Seamless AI integration"],
    img: "https://images.pexels.com/photos/14314636/pexels-photo-14314636.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: Workflow,
    tag: "04 — Scale",
    title: "Infrastructure, Pipelines & Automation",
    desc: "Robust CI/CD pipelines for rapid, error-free releases, workflow automation that removes repetitive toil, and scalable, monitored, highly available cloud architectures.",
    points: ["Automated CI/CD pipelines", "Workflow automation", "DevOps & cloud infrastructure", "Monitoring & high availability"],
    img: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: Palette,
    tag: "05 — Craft",
    title: "UI/UX Design",
    desc: "End-to-end user journey mapping, wireframing and prototyping paired with dark-themed, futuristic, ultra-minimal interfaces that prioritise focus and aesthetic precision.",
    points: ["Product design & journeys", "Wireframing & prototyping", "Ultra-minimal UI systems", "Dark, futuristic aesthetics"],
    img: "https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function Services() {
  const scrollToService = (index) => {
    const element = document.getElementById(`service-${index + 1}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div data-testid="services-page">
      {/* HERO */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        <div className="glow-orb animate-pulse-glow absolute -top-10 right-[15%] h-[400px] w-[400px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[ 02 ]">Services</SectionKicker>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-heading font-black uppercase tracking-tighter text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] max-w-5xl">
              <WaveText text="End-to-end engineering, one partner." />
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-zinc-400 text-lg leading-relaxed">
              We cover the full lifecycle of building modern software — from custom
              apps and AI to backend engineering, automation and ultra-minimal
              design — so you ship faster with a single partner.
            </p>
          </Reveal>
          
          {/* Quick Navigation */}
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap gap-3">
              {services.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollToService(i)}
                  className="px-4 py-2 rounded-full border border-white/10 bg-surface/50 backdrop-blur-sm text-sm text-zinc-300 hover:border-cyan-accent/50 hover:text-cyan-accent transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s.tag.split('—')[1].trim()}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICE BLOCKS */}
      <section className="pb-24 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-40">
          {services.map((s, i) => (
            <div
              key={s.title}
              id={`service-${i + 1}`}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-32 ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
              data-testid={`service-block-${i}`}
            >
              <Reveal className="md:[direction:ltr]">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/3]">
                  <motion.img
                    src={s.img}
                    alt={s.title}
                    className="h-full w-full object-cover"
                    initial={{ scale: 1.15 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 to-transparent" />
                </div>
              </Reveal>

              <Reveal delay={0.15} className="md:[direction:ltr]">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">{s.tag}</p>
                <div className="mt-5 flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <s.icon className="h-9 w-9 text-cyan-accent" />
                  </motion.div>
                  <h2 className="font-heading font-bold tracking-tight text-3xl md:text-4xl text-white">
                    <TextScramble text={s.title} trigger="view" speed={30} />
                  </h2>
                </div>
                <p className="mt-5 text-zinc-400 text-lg leading-relaxed">{s.desc}</p>
                <ul className="mt-7 grid sm:grid-cols-2 gap-3">
                  {s.points.map((p, idx) => (
                    <motion.li 
                      key={p} 
                      className="flex items-center gap-3 text-zinc-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <Check className="h-4 w-4 text-cyan-accent shrink-0" />
                      <span className="text-sm">{p}</span>
                    </motion.li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <CTASection eyebrow="Have a project in mind?" title="Tell us what you're building." />
    </div>
  );
}
