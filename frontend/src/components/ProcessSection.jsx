import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import ScrollConnectedPath, { PathNode } from "@/components/ScrollConnectedPath";

const steps = [
  {
    title: "Discover",
    desc: "We map the product, the users and the constraints — and give you an honest scope, not a sales estimate.",
    duration: "Week 1–2",
  },
  {
    title: "Design",
    desc: "Journeys, wireframes and a working design system in the studio's ultra-minimal language — reviewed with you, not at you.",
    duration: "Week 2–4",
  },
  {
    title: "Engineer",
    desc: "Weekly demos of real software on a live staging environment. Tests and CI gate every merge from the first commit.",
    duration: "Week 4–10",
  },
  {
    title: "Ship & monitor",
    desc: "A reviewed, one-step production release — with uptime monitoring and alerting already wired in when it lands.",
    duration: "Launch +",
  },
];

function ProcessStep({ step, i }) {
  const ref = useRef(null);
  const active = useInView(ref, { amount: 0.5 });

  return (
    <div
      ref={ref}
      className="relative border-l border-white/10 pl-5 md:border-l-0 md:pl-0"
      data-testid={`process-step-${i}`}
    >
      <PathNode index={i + 1} active={active} top={16} />
      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="font-heading font-bold tracking-tight text-2xl md:text-3xl text-white">
            {step.title}
          </h3>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-accent/80">
            {step.duration}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-zinc-400 leading-relaxed">{step.desc}</p>
      </Reveal>
    </div>
  );
}

/**
 * ProcessSection — "How we ship". Rides the same rail/node language as the
 * Services pipeline so process and capability read as one system.
 */
export default function ProcessSection() {
  return (
    <section className="relative py-16 md:py-32 border-t border-white/10 overflow-hidden" data-testid="home-process">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <SectionKicker index="[03]">How we ship</SectionKicker>
        </Reveal>
        <Reveal delay={0.1} variant="mask">
          <h2 className="mt-4 mb-14 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
            One pipeline, from idea to production.
          </h2>
        </Reveal>

        <ScrollConnectedPath>
          <motion.div className="space-y-10 md:space-y-16">
            {steps.map((s, i) => (
              <ProcessStep key={s.title} step={s} i={i} />
            ))}
          </motion.div>
        </ScrollConnectedPath>
      </div>
    </section>
  );
}
