import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Code2, Cloud, BrainCircuit, Palette, Layers, Workflow, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import CTASection from "@/components/CTASection";
import TextScramble from "@/components/TextScramble";
import WaveText from "@/components/WaveText";
import ScrollConnectedPath, { PathNode } from "@/components/ScrollConnectedPath";
import Corners from "@/components/Corners";

const EASE = [0.22, 1, 0.36, 1];
const hoverSpring = { type: "spring", stiffness: 350, damping: 22 };

const services = [
  {
    icon: Code2,
    tag: "01 — Build",
    title: "Custom Software & Application Development",
    desc: "We design and engineer products end-to-end — high-performance web apps, polished native and cross-platform mobile apps, and bespoke enterprise software that automates operations and removes manual bottlenecks.",
    points: ["Responsive web applications", "Native & cross-platform mobile", "Bespoke enterprise software", "Workflow-driven platforms"],
    img: "/images/bento-software-800.webp", imgSet: "/images/bento-software-800.webp 800w, /images/bento-software-1600.webp 1600w", imgW: 1600, imgH: 900,
  },
  {
    icon: Layers,
    tag: "02 — Engineer",
    title: "Frontend & Backend Engineering",
    desc: "Production-ready interfaces built to an ultra-minimal, futuristic design system, backed by secure, high-performance APIs and scalable server-side infrastructure capable of heavy, real-time workloads.",
    points: ["Pixel-perfect frontend", "Secure high-performance APIs", "Scalable backend architecture", "Real-time systems"],
    img: "/images/svc-backend-800.webp", imgSet: "/images/svc-backend-800.webp 800w, /images/svc-backend-1600.webp 1600w", imgW: 1600, imgH: 1067,
  },
  {
    icon: BrainCircuit,
    tag: "03 — Intelligence",
    title: "Artificial Intelligence & Machine Learning",
    desc: "From custom AI architectures to rigorous training and fine-tuning for accuracy and low latency, we embed intelligent systems seamlessly into your software and workflows.",
    points: ["Custom AI models", "Training & fine-tuning", "Low-latency inference", "Seamless AI integration"],
    img: "/images/svc-aiml-800.webp", imgSet: "/images/svc-aiml-800.webp 800w, /images/svc-aiml-1600.webp 1600w", imgW: 1600, imgH: 1067,
  },
  {
    icon: Workflow,
    tag: "04 — Scale",
    title: "Infrastructure, Pipelines & Automation",
    desc: "Robust CI/CD pipelines for rapid, error-free releases, workflow automation that removes repetitive toil, and scalable, monitored, highly available cloud architectures.",
    points: ["Automated CI/CD pipelines", "Workflow automation", "DevOps & cloud infrastructure", "Monitoring & high availability"],
    img: "/images/infra-800.webp", imgSet: "/images/infra-800.webp 800w, /images/infra-1600.webp 1600w", imgW: 1600, imgH: 1068,
  },
  {
    icon: Palette,
    tag: "05 — Craft",
    title: "UI/UX Design",
    desc: "End-to-end user journey mapping, wireframing and prototyping paired with dark-themed, futuristic, ultra-minimal interfaces that prioritise focus and aesthetic precision.",
    points: ["Product design & journeys", "Wireframing & prototyping", "Ultra-minimal UI systems", "Dark, futuristic aesthetics"],
    img: "/images/studio-office-800.webp", imgSet: "/images/studio-office-800.webp 800w, /images/studio-office-1600.webp 1600w", imgW: 1600, imgH: 1067,
  },
];

function ServiceBlock({ s, i }) {
  const ref = useRef(null);
  const kickerRef = useRef(null);
  const reduced = useReducedMotion();
  // Drives the pipeline node light-up and the active-heading lift.
  // amount 0.2: the node lights as the block meaningfully enters, not
  // after half of a tall block is visible.
  const active = useInView(ref, { amount: 0.2 });

  // Anchor the rail node beside this block's kicker line ("01 — Build"),
  // not the block's vertical center. Uses the offsetTop chain rather than
  // getBoundingClientRect so the entrance reveal's transient y-transform
  // doesn't skew the measurement; local images carry width/height so the
  // layout is stable from first paint.
  const [nodeTop, setNodeTop] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      let el = kickerRef.current;
      const block = ref.current;
      if (!el || !block) return;
      let top = el.offsetHeight / 2;
      while (el && el !== block) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      setNodeTop(top);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={ref}
      id={`service-${i + 1}`}
      className={`relative grid md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-32 border-l border-white/10 pl-5 md:border-l-0 md:pl-0 ${
        i % 2 === 1 ? "md:[direction:rtl]" : ""
      }`}
      data-testid={`service-block-${i}`}
    >
      <PathNode index={i + 1} active={active} top={nodeTop} />

      <Reveal variant="clip" className="md:[direction:ltr]">
        <motion.div
          className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/3] transition-colors duration-500 hover:border-cyan-accent/30"
          data-cursor-text="VIEW"
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          <motion.div
            className="h-full w-full transition-[filter] duration-700 group-hover:brightness-110"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
            transition={hoverSpring}
          >
            <motion.img
              src={s.img}
              srcSet={s.imgSet}
              sizes="(min-width: 768px) 45vw, 100vw"
              width={s.imgW}
              height={s.imgH}
              loading="lazy"
              alt={s.title}
              className="h-full w-full object-cover"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 to-transparent" />
          </motion.div>
          <Corners className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute left-0 top-0 z-20 h-px w-full origin-left scale-x-0 bg-cyan-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </motion.div>
      </Reveal>

      <Reveal delay={0.08} className="md:[direction:ltr]">
        <p ref={kickerRef} className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">{s.tag}</p>
        <div className="mt-5 flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <s.icon className="h-9 w-9 text-cyan-accent" />
          </motion.div>
          {/* Active service lifts to full brightness; inactive sit at 85% */}
          <motion.h2
            className="font-heading font-bold tracking-tight text-3xl md:text-4xl text-white"
            animate={{ opacity: active || reduced ? 1 : 0.85 }}
            transition={{ duration: 0.5 }}
          >
            <TextScramble text={s.title} trigger="view" duration={550} />
          </motion.h2>
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
              transition={{ delay: idx * 0.06, duration: 0.4 }}
            >
              <Check className="h-4 w-4 text-cyan-accent shrink-0" />
              <span className="text-sm">{p}</span>
            </motion.li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

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
          <Reveal delay={0.1} variant="mask">
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

      {/* SERVICE BLOCKS — connected pipeline. space-y-28 (7rem): blocks
          breathe but the next block is visible as you finish the previous */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollConnectedPath>
            <div className="space-y-20 md:space-y-28">
              {services.map((s, i) => (
                <ServiceBlock key={s.title} s={s} i={i} />
              ))}
            </div>
          </ScrollConnectedPath>
        </div>
      </section>

      <CTASection eyebrow="Have a project in mind?" title="Tell us what you're building." />
    </div>
  );
}
