import { motion } from "framer-motion";
import { Code2, Cloud, BrainCircuit, Palette, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";

const services = [
  {
    icon: Code2,
    tag: "01 — Build",
    title: "Custom Software & SaaS",
    desc: "We design and engineer products end-to-end. From validating an idea to launching a multi-tenant SaaS platform, our teams ship maintainable, well-tested code on modern stacks.",
    points: ["Web & mobile apps", "Multi-tenant SaaS platforms", "API & systems design", "Legacy modernization"],
    img: "https://images.pexels.com/photos/12627677/pexels-photo-12627677.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: Cloud,
    tag: "02 — Scale",
    title: "Cloud & DevOps",
    desc: "Infrastructure that's resilient, observable and cost-aware. We automate delivery pipelines and harden production across AWS, GCP and Azure so your team ships with confidence.",
    points: ["Infrastructure as Code", "CI/CD automation", "Kubernetes & containers", "Monitoring & SRE"],
    img: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    icon: BrainCircuit,
    tag: "03 — Intelligence",
    title: "AI & Data Solutions",
    desc: "Turn data into a competitive edge. We build pipelines, analytics and production-grade AI — including LLM features, RAG systems and ML models embedded in your product.",
    points: ["LLM & RAG features", "Data engineering", "ML model deployment", "Analytics dashboards"],
    img: "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    icon: Palette,
    tag: "04 — Craft",
    title: "Product Design",
    desc: "Interfaces people love. Our designers partner with engineers to deliver research-led, accessible and beautiful experiences across every screen.",
    points: ["UX research", "Design systems", "Interaction & motion", "Prototyping"],
    img: "https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function Services() {
  return (
    <div data-testid="services-page">
      {/* HERO */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent">Services</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-heading font-black uppercase tracking-tighter text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] max-w-5xl">
              End-to-end engineering, one partner.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-zinc-400 text-lg leading-relaxed">
              We cover the full lifecycle of building modern software — strategy,
              design, engineering, cloud and AI — so you move faster with less overhead.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICE BLOCKS */}
      <section className="pb-24 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-40">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
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
                  <s.icon className="h-9 w-9 text-cyan-accent" />
                  <h2 className="font-heading font-bold tracking-tight text-3xl md:text-4xl text-white">
                    {s.title}
                  </h2>
                </div>
                <p className="mt-5 text-zinc-400 text-lg leading-relaxed">{s.desc}</p>
                <ul className="mt-7 grid sm:grid-cols-2 gap-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-4 w-4 text-cyan-accent shrink-0" />
                      <span className="text-sm">{p}</span>
                    </li>
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
