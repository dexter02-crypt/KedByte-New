import { Link, useLocation } from "react-router-dom";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { useCtaPanel } from "@/components/StartProjectPanel";
import { motion } from "framer-motion";

const sublineLink =
  "text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-cyan-accent transition-colors";

export default function CTASection({
  eyebrow = "Ready when you are",
  title = "Let's build something that lasts.",
}) {
  const ctaPanel = useCtaPanel();
  const { pathname } = useLocation();
  return (
    <section className="relative py-16 md:py-40 border-t border-white/10 overflow-hidden" data-testid="cta-section">
      <div className="tech-grid grid-fade absolute inset-0 opacity-30" />
      <div className="glow-orb animate-pulse-glow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-heading font-black uppercase text-4xl md:text-6xl lg:text-7xl text-white max-w-4xl mx-auto leading-[0.95]" style={{ letterSpacing: '0.02em', wordSpacing: '0.15em' }}>
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-3 md:mr-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -5, color: "#00F0FF" }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton onClick={() => ctaPanel.open()} testid="cta-section-button">
              Start a project
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          {/* No link may point at the page it sits on: on /services the
              services link becomes the payroll product instead. */}
          <p className="mt-8 text-sm text-zinc-400">
            Explore{" "}
            {pathname === "/services" ? (
              <Link to="/payroll" className={sublineLink}>
                Kedbyte Payroll
              </Link>
            ) : (
              <Link to="/services" className={sublineLink}>
                our software development services
              </Link>
            )}{" "}
            or{" "}
            <Link to="/contact" className={sublineLink}>
              contact Kedbyte
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
