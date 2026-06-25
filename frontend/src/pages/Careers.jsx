import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";

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

export default function Careers() {
  const [open, setOpen] = useState(0);

  return (
    <div data-testid="careers-page">
      <section className="pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent">Careers</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-heading font-black uppercase tracking-tighter text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] max-w-5xl">
              Build the future, with us.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-zinc-400 text-lg leading-relaxed">
              We hire curious people who care about craft. Remote-friendly, outcome-driven,
              and obsessed with shipping things that matter.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="border-t border-white/10">
            {roles.map((r, i) => {
              const isOpen = open === i;
              return (
                <div key={r.title} className="border-b border-white/10" data-testid={`role-row-${i}`}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-start md:items-center justify-between gap-6 py-8 text-left group"
                    data-testid={`role-toggle-${i}`}
                  >
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl md:text-4xl tracking-tight text-white group-hover:text-cyan-accent transition-colors">
                        {r.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-zinc-500 uppercase tracking-wider">
                        <span>{r.team}</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {r.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {r.type}
                        </span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 mt-2 md:mt-0">
                      <Plus className="h-6 w-6 text-white" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                <h3 className="font-heading text-2xl text-white tracking-tight">
                  Don't see your role?
                </h3>
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
