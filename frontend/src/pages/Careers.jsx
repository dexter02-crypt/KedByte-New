import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import CTASection from "@/components/CTASection";
import WaveText from "@/components/WaveText";
import MouseTilt3D from "@/components/MouseTilt3D";

const roles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote / Vadodara",
    type: "Full-time",
    desc: "Lead the build of multi-tenant SaaS platforms across React, Node and Python. You'll own features end-to-end and mentor a small pod of engineers.",
  },
  {
    title: "Cloud / DevOps Engineer",
    team: "Platform",
    location: "Remote",
    type: "Full-time",
    desc: "Design and automate resilient infrastructure on AWS & GCP. Kubernetes, Terraform and a love for clean pipelines required.",
  },
  {
    title: "AI / ML Engineer",
    team: "Intelligence",
    location: "Remote / Vadodara",
    type: "Full-time",
    desc: "Ship production LLM and ML features — RAG systems, data pipelines and model deployment for real products.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
    desc: "Craft research-led, accessible interfaces and contribute to our evolving design system. Motion and prototyping skills a plus.",
  },
  {
    title: "Engineering Internship",
    team: "Engineering",
    location: "Vadodara",
    type: "Internship",
    desc: "A 6-month immersive program working alongside senior engineers on real client products.",
  },
];

const rowSpring = { type: "spring", stiffness: 300, damping: 30 };

export default function Careers() {
  const [open, setOpen] = useState(-1);
  const reduced = useReducedMotion();

  return (
    <div data-testid="careers-page">
      <section className="relative pt-32 pb-14 md:pt-52 md:pb-28 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        <div className="glow-orb animate-pulse-glow absolute -top-10 right-[18%] h-[400px] w-[400px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[ 04 ]">Careers</SectionKicker>
          </Reveal>
          <Reveal delay={0.1} variant="mask">
            <h1 className="mt-6 font-heading font-black uppercase tracking-tight text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] max-w-5xl">
              <span className="sr-only">Careers at Kedbyte — </span>
              Build the future, with us.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-zinc-400 text-lg leading-relaxed">
              Engineering, design and AI careers at Kedbyte. We hire curious people
              who care about craft — remote-friendly, outcome-driven, and obsessed
              with shipping things that matter.
            </p>
          </Reveal>

          {/* Page-intro hairline draws beneath the header */}
          <motion.div
            className="mt-14 h-px w-full origin-left bg-white/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          />
        </div>
      </section>

      <section className="pb-16 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="border-t border-white/10">
            {roles.map((r, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={r.title}
                  className="group relative border-b border-white/10 transition-colors duration-500 hover:bg-white/[0.03]"
                  data-testid={`role-row-${i}`}
                >
                  {/* Cyan hairline sweeping the top border on hover */}
                  <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-cyan-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <motion.button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-start md:items-center justify-between gap-6 py-8 text-left"
                    data-testid={`role-toggle-${i}`}
                    data-cursor-text={isOpen ? "CLOSE" : "OPEN"}
                    aria-expanded={isOpen}
                    aria-controls={`role-panel-${i}`}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                  >
                    <motion.div
                      className="flex-1"
                      variants={{ rest: { x: 0 }, hover: { x: 8 } }}
                      transition={rowSpring}
                    >
                      <h2 className="font-heading text-2xl md:text-4xl tracking-tight text-white group-hover:text-cyan-accent transition-colors">
                        <WaveText text={r.title} />
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-zinc-400 uppercase tracking-wider">
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {r.team}
                        </motion.span>
                        <motion.span
                          className="flex items-center gap-1.5"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <MapPin className="h-3.5 w-3.5" /> {r.location}
                        </motion.span>
                        <motion.span
                          className="flex items-center gap-1.5"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Clock className="h-3.5 w-3.5" /> {r.type}
                        </motion.span>
                      </div>
                    </motion.div>
                    <motion.div
                      className="shrink-0 mt-2 md:mt-0"
                      variants={{
                        rest: { rotate: isOpen ? 45 : 0, x: 0 },
                        hover: { rotate: 45, x: 4 },
                      }}
                      transition={rowSpring}
                    >
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`role-panel-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : {
                                height: { type: "spring", stiffness: 240, damping: 32 },
                                opacity: { duration: 0.25 },
                              }
                        }
                        className="overflow-hidden"
                      >
                        <div className="pb-10 max-w-2xl">
                          <p className="text-zinc-400 text-lg leading-relaxed">{r.desc}</p>
                          <Link
                            to="/contact"
                            data-testid={`role-apply-${i}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-6 py-3 text-sm font-medium hover:bg-zinc-200 transition-colors"
                          >
                            Apply now
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <Reveal className="mt-16">
            <div className="rounded-2xl border border-white/10 bg-surface p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="font-heading text-2xl text-white tracking-tight">
                  Don't see your role?
                </h2>
                <p className="mt-2 text-zinc-400">
                  We're always meeting exceptional people. Send us a note.
                </p>
              </div>
              <Link
                to="/contact"
                data-testid="careers-open-application"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Open application
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection eyebrow="Life at Kedbyte" title="Great people. Real ownership." />
    </div>
  );
}
