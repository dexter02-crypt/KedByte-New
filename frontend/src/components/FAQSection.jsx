import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import { faq } from "@/data/faq";

const rowSpring = { type: "spring", stiffness: 300, damping: 30 };

/**
 * FAQSection — accordion rows reusing the Careers row interaction:
 * hover bg lift + cyan hairline sweep + title shift, spring expand,
 * one open at a time, aria-expanded/aria-controls.
 * Content: src/data/faq.js (CONFIRM notes inside).
 */
export default function FAQSection({
  items = faq,
  kicker = "Before you ask",
  heading = "The questions every project starts with.",
  testid = "contact-faq",
}) {
  const [open, setOpen] = useState(-1);
  const reduced = useReducedMotion();

  return (
    <section className="relative pb-24 md:pb-32" data-testid={testid}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <SectionKicker index="[FAQ]">{kicker}</SectionKicker>
        </Reveal>
        <Reveal delay={0.1} variant="mask">
          <h2 className="mt-4 mb-12 font-heading font-bold tracking-tighter text-4xl md:text-5xl text-white max-w-2xl">
            {heading}
          </h2>
        </Reveal>

        <div className="border-t border-white/10">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="group relative border-b border-white/10 transition-colors duration-500 hover:bg-white/[0.03]"
                data-testid={`faq-row-${i}`}
              >
                <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-cyan-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <motion.button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  data-testid={`faq-toggle-${i}`}
                  data-cursor-text={isOpen ? "CLOSE" : "OPEN"}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                >
                  <motion.h3
                    className="font-heading text-xl md:text-2xl tracking-tight text-white group-hover:text-cyan-accent transition-colors"
                    variants={{ rest: { x: 0 }, hover: { x: 8 } }}
                    transition={rowSpring}
                  >
                    {item.q}
                  </motion.h3>
                  <motion.div
                    className="shrink-0"
                    variants={{
                      rest: { rotate: isOpen ? 45 : 0, x: 0 },
                      hover: { rotate: 45, x: 4 },
                    }}
                    transition={rowSpring}
                  >
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
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
                      <p className="pb-8 max-w-2xl text-zinc-400 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
