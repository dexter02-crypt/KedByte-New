import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export default function CTASection({
  eyebrow = "Ready when you are",
  title = "Let's build something that lasts.",
}) {
  return (
    <section className="relative py-24 md:py-40 border-t border-white/10" data-testid="cta-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-heading font-black uppercase tracking-tighter text-4xl md:text-6xl text-white max-w-4xl mx-auto leading-[0.95]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton to="/contact" testid="cta-section-button">
              Start a project
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
