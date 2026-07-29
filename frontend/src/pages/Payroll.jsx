import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import MagneticButton from "@/components/MagneticButton";
import Counter from "@/components/Counter";
import FAQSection from "@/components/FAQSection";
import ScrollConnectedPath, { PathNode } from "@/components/ScrollConnectedPath";
import { useCtaPanel } from "@/components/StartProjectPanel";
import { features, compliance, roadmap } from "@/data/payroll";
import { payrollFaq } from "@/data/payrollFaq";

const EASE = [0.22, 1, 0.36, 1];

// Panel context for payroll leads — tags the Mongo document via `source`
const PAYROLL_CTA = {
  source: "payroll-early-access",
  eyebrow: "Early access",
  title: "Join the early-access list.",
  subtitle:
    "Three fields, fifteen seconds. You'll hear first when Kedbyte Payroll launches — early-access members get first access.",
  messageLabel: "Your practice / bureau",
  messagePlaceholder: "Who runs payroll on your side?",
};

function FeatureBlock({ feature, i }) {
  const ref = useRef(null);
  const active = useInView(ref, { amount: 0.3 });

  if (feature.highlight) {
    return (
      <div
        ref={ref}
        className="relative border-l border-white/10 pl-5 md:border-l-0 md:pl-0"
        data-testid={`payroll-feature-${i}`}
      >
        <PathNode index={i + 1} active={active} top={28} />
        <Reveal>
          <div className="rounded-2xl border border-cyan-accent/25 bg-surface/60 p-8 md:p-10">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-accent">
              Verified against HMRC's own test data
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-heading font-black tracking-tighter text-6xl md:text-7xl text-white">
                <Counter to={feature.stat.to} />
              </span>
              <span className="max-w-sm font-mono text-xs uppercase tracking-wider text-zinc-400">
                {feature.stat.label}
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-zinc-400 leading-relaxed">{feature.desc}</p>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative border-l border-white/10 pl-5 md:border-l-0 md:pl-0"
      data-testid={`payroll-feature-${i}`}
    >
      <PathNode index={i + 1} active={active} top={18} />
      <Reveal>
        <h3 className="font-heading font-bold tracking-tight text-2xl md:text-3xl text-white">
          {feature.title}
        </h3>
        <p className="mt-3 max-w-2xl text-zinc-400 leading-relaxed">{feature.desc}</p>
      </Reveal>
    </div>
  );
}

export default function Payroll() {
  const ctaPanel = useCtaPanel();

  return (
    <div data-testid="payroll-page">
      {/* HERO */}
      <section className="relative pt-32 pb-14 md:pt-52 md:pb-24 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        <div className="glow-orb animate-pulse-glow absolute -top-10 right-[12%] h-[420px] w-[420px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[06]">Product</SectionKicker>
          </Reveal>
          {/* Stacked mask-reveal lines (same pattern as the Home hero) so the
              wordmark never crowds one line; the cyan word runs at
              tracking-tight — tighter fuses letterforms at font-black */}
          <h1 className="mt-6 font-heading font-black uppercase tracking-tight text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] max-w-5xl">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              >
                Kedbyte
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block text-cyan-accent text-glow"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.22, duration: 0.8, ease: EASE }}
              >
                Payroll.
              </motion.span>
            </span>
          </h1>

          {/* Status badge — claims policy: in-development state visible near the top */}
          <Reveal delay={0.18}>
            <div
              className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-4 py-2"
              data-testid="payroll-status-badge"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse-glow" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-cyan-accent">
                In development — HMRC PAYE recognition in progress
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-zinc-400 text-lg leading-relaxed">
              UK payroll software for bureaux and accountants, built for tax year
              2026/27 — a penny-exact engine that already passes every row of
              HMRC's published test data.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <MagneticButton
                onClick={() => ctaPanel.open(PAYROLL_CTA)}
                testid="payroll-hero-cta"
              >
                Join the early-access list
              </MagneticButton>
              <MagneticButton to="/contact" variant="ghost" testid="payroll-talk-cta">
                Talk to us
              </MagneticButton>
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

      {/* WHO IT'S FOR */}
      <section className="pb-14 md:pb-28" data-testid="payroll-audience">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent">
              Built for bureaux
            </p>
            <h2 className="mt-4 font-heading font-bold tracking-tight text-2xl md:text-3xl text-white">
              Payroll bureaux & accountants
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Run payroll across many client companies from one place —
              multi-company from the ground up, with the P32, pension files and
              audit trail each client engagement demands.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400">
              Also for
            </p>
            <h2 className="mt-4 font-heading font-bold tracking-tight text-2xl md:text-3xl text-white">
              Small UK employers
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              If you run your own payroll, you get the same penny-exact engine
              and the same outputs — payslips, P32 and pension files — without
              the bureau layer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT IT DOES — rides the studio's pipeline rail */}
      <section className="relative py-14 md:py-28 border-t border-white/10" data-testid="payroll-features">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[01]">What it does</SectionKicker>
          </Reveal>
          <Reveal delay={0.1} variant="mask">
            <h2 className="mt-4 mb-14 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-3xl">
              Calculates. Produces. Proves it.
            </h2>
          </Reveal>

          <ScrollConnectedPath>
            <div className="space-y-14 md:space-y-16">
              {features.map((f, i) => (
                <FeatureBlock key={f.title} feature={f} i={i} />
              ))}
            </div>
          </ScrollConnectedPath>
        </div>
      </section>

      {/* COMPLIANCE & TRUST */}
      <section className="relative py-14 md:py-28 border-t border-white/10 bg-surface/40" data-testid="payroll-compliance">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <SectionKicker index="[02]">Compliance & trust</SectionKicker>
            </Reveal>
            <Reveal delay={0.1} variant="mask">
              <h2 className="mt-4 font-heading font-bold tracking-tighter text-3xl md:text-4xl text-white">
                Sourced from the primary specifications.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-zinc-400 leading-relaxed">{compliance.intro}</p>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-white/10 bg-surface p-8">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400 mb-4">
                  Verified against
                </p>
                <ul className="space-y-3">
                  {compliance.sources.map((s) => (
                    <li key={s} className="flex items-center gap-3 font-mono text-sm text-zinc-300">
                      <span className="h-px w-5 bg-cyan-accent/60 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border-t border-white/10 pt-5 space-y-1.5">
                  <p className="text-sm text-zinc-400">{compliance.builder}</p>
                  <p className="font-mono text-xs tracking-wider text-cyan-accent">
                    {compliance.status}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="relative py-14 md:py-28 border-t border-white/10" data-testid="payroll-roadmap">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <SectionKicker index="[03]">Roadmap</SectionKicker>
          </Reveal>
          <Reveal delay={0.1} variant="mask">
            <h2 className="mt-4 mb-12 font-heading font-bold tracking-tighter text-3xl md:text-4xl text-white max-w-2xl">
              On the way.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {roadmap.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-surface p-7 transition-colors duration-500 hover:border-cyan-accent/30">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-accent/80">
                    On the way
                  </p>
                  <h3 className="mt-3 font-heading text-xl tracking-tight text-white">{r.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — reuses the site's accordion pattern */}
      <div className="border-t border-white/10 pt-14 md:pt-24">
        <FAQSection
          items={payrollFaq}
          kicker="Payroll, answered"
          heading="What bureaux ask us first."
          testid="payroll-faq"
        />
      </div>

      {/* FINAL CTA */}
      <section className="relative py-16 md:py-36 border-t border-white/10 overflow-hidden" data-testid="payroll-cta">
        <div className="tech-grid grid-fade absolute inset-0 opacity-30" />
        <div className="glow-orb animate-pulse-glow absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400">
              Launching upon HMRC recognition
            </p>
          </Reveal>
          <Reveal delay={0.1} variant="mask">
            <h2 className="mt-6 font-heading font-black uppercase text-4xl md:text-6xl text-white max-w-4xl mx-auto leading-[0.95]">
              Be first in the queue.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <MagneticButton
                onClick={() => ctaPanel.open(PAYROLL_CTA)}
                testid="payroll-footer-cta"
              >
                Join the early-access list
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
