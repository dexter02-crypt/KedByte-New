import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/Stagger";
import SectionKicker from "@/components/SectionKicker";
import Corners from "@/components/Corners";
import { useLenis } from "@/components/SmoothScroll";
import useMediaQuery from "@/hooks/use-media-query";
import { work } from "@/data/work";

const EASE = [0.22, 1, 0.36, 1];
const hoverSpring = { type: "spring", stiffness: 350, damping: 22 };

/**
 * SelectedWork — flagship builds as case-study cards (data: src/data/work.js,
 * honestly framed as internal builds until real client work replaces them).
 * Clicking a card opens an in-page expanded panel below the grid and
 * smooth-scrolls it into view (the panel is otherwise below the fold and
 * the click would appear to do nothing).
 */
export default function SelectedWork() {
  const [openId, setOpenId] = useState(null);
  const reduced = useReducedMotion();
  const touch = useMediaQuery("(hover: none)");
  const lenis = useLenis();
  const gridRef = useRef(null);
  const openCase = work.find((w) => w.id === openId);

  // Scroll so `el`'s top sits just below the fixed header. Falls back to
  // native scrolling when Lenis is absent (reduced motion / touch).
  const scrollToEl = (el) => {
    if (!el) return;
    const OFFSET = -96;
    if (lenis && !reduced) {
      lenis.scrollTo(el, { offset: OFFSET, duration: 0.9 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + OFFSET;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
  };

  const toggleCase = (id) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) {
      // ~180ms: the expand has begun, so the panel has a real position
      setTimeout(() => scrollToEl(document.getElementById("work-case-panel")), 180);
    } else {
      // Closing: if the collapse left the grid above the viewport, return to it
      setTimeout(() => {
        const rect = gridRef.current?.getBoundingClientRect();
        if (rect && rect.top < 0) scrollToEl(gridRef.current);
      }, 220);
    }
  };

  return (
    <section className="relative py-16 md:py-32 border-t border-white/10 overflow-hidden" data-testid="home-work">
      <div className="tech-grid grid-fade absolute inset-0 opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <SectionKicker index="[02]">Selected work</SectionKicker>
        </Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal delay={0.1} variant="mask">
            <h2 className="mt-4 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
              Built in-house, engineered to standard.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm text-zinc-500 leading-relaxed">
              Capability builds from the studio — the same architecture, motion
              and reliability standards every client project inherits.
            </p>
          </Reveal>
        </div>

        <div ref={gridRef}>
        <StaggerGroup stagger={0.08} className="mt-14 grid md:grid-cols-3 gap-5">
          {work.map((w) => {
            const active = openId === w.id;
            return (
            <StaggerItem key={w.id}>
              <button
                onClick={() => toggleCase(w.id)}
                data-testid={`work-card-${w.id}`}
                data-cursor-text={active ? "CLOSE" : "VIEW CASE"}
                aria-expanded={active}
                aria-controls="work-case-panel"
                className="group relative block w-full h-full text-left"
              >
                <motion.div
                  className={`glow-card relative h-full overflow-hidden rounded-2xl border bg-surface transition-colors duration-500 ${
                    active
                      ? "border-cyan-accent/60"
                      : "border-white/10 hover:border-cyan-accent/30"
                  }`}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                >
                  <Reveal variant="clip" className="relative aspect-[16/10] overflow-hidden">
                    <motion.div
                      className="h-full w-full transition-[filter] duration-700 group-hover:brightness-110"
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
                      transition={hoverSpring}
                    >
                      <motion.img
                        src={w.img}
                        srcSet={w.imgSet}
                        sizes="(min-width: 768px) 30vw, 100vw"
                        width={w.imgW}
                        height={w.imgH}
                        loading="lazy"
                        alt={w.title}
                        className="h-full w-full object-cover"
                        initial={false}
                        whileInView={reduced || touch ? {} : { scale: [1, 1.06, 1] }}
                        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                    </motion.div>
                  </Reveal>

                  <div className="relative p-7">
                    {/* Kicker line sweeps cyan on hover */}
                    <div className="flex items-center gap-3">
                      <span className="relative h-px w-8 overflow-hidden bg-white/20">
                        <span
                          className={`absolute inset-0 origin-left bg-cyan-accent transition-transform duration-500 ease-out ${
                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </span>
                      <p
                        className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                          active ? "text-cyan-accent" : "text-zinc-500 group-hover:text-cyan-accent"
                        }`}
                      >
                        {w.kicker}
                      </p>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl tracking-tight text-white">
                      {w.title}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{w.problem}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {w.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <span className="font-heading font-bold text-xl text-cyan-accent">{w.metric.value}</span>
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          {w.metric.label}
                        </span>
                      </div>
                      <motion.span
                        variants={{ rest: { x: 0, y: 0 }, hover: { x: 4, y: -4 } }}
                        transition={hoverSpring}
                        className="text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.span>
                    </div>
                  </div>
                  <Corners
                    className={`transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </motion.div>
              </button>
            </StaggerItem>
            );
          })}
        </StaggerGroup>
        </div>

        {/* In-page expanded case panel */}
        <AnimatePresence initial={false}>
          {openCase && (
            <motion.div
              key={openCase.id}
              id="work-case-panel"
              role="region"
              aria-label={openCase.title}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { height: { type: "spring", stiffness: 220, damping: 30 }, opacity: { duration: 0.25 } }
              }
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-2xl border border-cyan-accent/20 bg-surface/60 p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-accent">
                      {openCase.kicker}
                    </p>
                    <h3 className="mt-3 font-heading font-bold text-3xl tracking-tight text-white">
                      {openCase.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCase(openCase.id)}
                    aria-label="Close case"
                    data-testid="work-case-close"
                    className="shrink-0 rounded-full border border-white/15 p-3 text-zinc-400 hover:text-white hover:border-cyan-accent/50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6 grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-8 space-y-4">
                    {openCase.writeup.map((p, i) => (
                      <p key={i} className="text-zinc-400 leading-relaxed">{p}</p>
                    ))}
                  </div>
                  <div className="md:col-span-4 space-y-5">
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-2">
                        Engineered
                      </p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{openCase.engineered}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-2">
                        Stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {openCase.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
