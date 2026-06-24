import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import CTASection from "@/components/CTASection";

const values = [
  { title: "Craft over haste", desc: "We ship fast — but never at the cost of code we'd be embarrassed to maintain." },
  { title: "Ownership", desc: "We act like founders. Your outcomes are our outcomes, from kickoff to scale." },
  { title: "Clarity", desc: "Plain language, honest timelines, no jargon walls. You always know where things stand." },
  { title: "Long horizons", desc: "We build systems meant to last years, not demos meant to impress for a week." },
];

const OFFICE_IMG =
  "https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="pt-40 pb-16 md:pt-52 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent">About Kedbyte</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-heading font-black uppercase tracking-tighter text-5xl md:text-7xl lg:text-[7rem] text-white leading-[0.88] max-w-5xl">
              A studio for the <span className="text-cyan-accent text-glow">curious</span> & the bold.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Big image */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-[16/9]">
              <motion.img
                src={OFFICE_IMG}
                alt="Kedbyte studio"
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

      {/* Editorial story */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">Our story</p>
            </Reveal>
          </div>
          <div className="md:col-span-8 space-y-8">
            <Reveal>
              <p className="font-heading text-2xl md:text-3xl text-white leading-snug tracking-tight">
                Kedbyte Technologies began with a simple belief: great software is
                equal parts engineering rigor and design intuition.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-zinc-400 text-lg leading-relaxed">
                We're a full-service technology company partnering with startups and
                enterprises to build products that scale. From cloud-native platforms
                and DevOps automation to AI features and pixel-perfect interfaces, our
                cross-functional teams move as one — fast, focused and accountable.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Today we operate across continents, but the ethos hasn't changed: do
                fewer things, do them exceptionally, and treat every product as if our
                name is on the door — because it is.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/10 bg-surface/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { to: 2018, suffix: "", label: "Founded" },
            { to: 80, suffix: "+", label: "Engineers & designers" },
            { to: 120, suffix: "+", label: "Products delivered" },
            { to: 14, suffix: "", label: "Countries" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="font-heading font-black tracking-tighter text-4xl md:text-5xl text-white">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-zinc-500 text-sm">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white mb-16">
              What we stand for.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/10 bg-surface p-8 md:p-10 h-full transition-colors duration-500 hover:border-cyan-accent/40">
                  <span className="font-mono text-cyan-accent text-sm">0{i + 1}</span>
                  <h3 className="mt-4 font-heading text-2xl text-white tracking-tight">{v.title}</h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection eyebrow="Want to work with us?" title="Let's make something remarkable." />
    </div>
  );
}
