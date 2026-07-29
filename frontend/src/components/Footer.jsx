import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import KLogo from "@/components/KLogo";

const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/services", label: "Custom Software & Apps" },
      { to: "/services", label: "Frontend & Backend" },
      { to: "/services", label: "AI & Machine Learning" },
      { to: "/services", label: "DevOps & Automation" },
      { to: "/services", label: "UI/UX Design" },
    ],
  },
];

const colVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const colItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Footer — curtain-lift reveal: the footer sits fixed behind the page at
 * z-0 (Layout's main is z-10 with an opaque background) and a same-height
 * spacer at the end of the flow provides the scroll room, so the last
 * section scrolls up and reveals it with a slight parallax.
 *
 * Falls back to normal document flow when the page is too short to scroll
 * meaningfully (Contact/404) or under reduced motion — no layout jump.
 */
export default function Footer() {
  const reduced = useReducedMotion();
  const [fixedMode, setFixedMode] = useState(false);
  const [footerH, setFooterH] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const footRef = useRef(null);
  const spacerRef = useRef(null);

  // useLayoutEffect: the flow→fixed swap must happen before first paint,
  // otherwise the footer visibly jumps from document-end to viewport-bottom
  // and registers a layout shift.
  useLayoutEffect(() => {
    const measure = () => {
      const h = footRef.current?.offsetHeight || 0;
      setFooterH(h);
      const main = document.querySelector("main");
      const mainH = main?.offsetHeight || 0;
      // Only use the reveal when there's real scroll room past the fold
      setFixedMode(!reduced && mainH > window.innerHeight + h * 0.5);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start end", "end end"],
  });
  // Low parallax: footer content drifts up as it's revealed
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.12 && !revealed) setRevealed(true);
  });

  const inner = (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <motion.div
        className="grid md:grid-cols-12 gap-12"
        variants={colVariants}
        initial={fixedMode ? "hidden" : false}
        animate={!fixedMode || revealed ? "visible" : "hidden"}
      >
        <motion.div variants={colItem} className="md:col-span-4">
          <span className="flex items-center gap-3">
            <KLogo className="h-10 w-10" />
            <span className="font-heading font-black text-3xl tracking-tighter text-white">
              KED<span className="text-cyan-accent">BYTE</span>
            </span>
          </span>
          <p className="mt-5 text-zinc-400 max-w-sm leading-relaxed">
            An ultra-minimal, futuristic software studio — building intelligent,
            high-performance digital products from interface to infrastructure.
          </p>
          <a
            href="mailto:techteam@kedbyte.com"
            className="mt-6 inline-flex items-center gap-1.5 text-white hover:text-cyan-accent transition-colors"
            data-testid="footer-email"
          >
            techteam@kedbyte.com <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>

        {cols.map((c) => (
          <motion.div variants={colItem} key={c.title} className="md:col-span-2">
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mb-5">
              {c.title}
            </h4>
            <ul className="space-y-3">
              {c.links.map((l, i) => (
                <li key={i}>
                  <Link
                    to={l.to}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div variants={colItem} className="md:col-span-2">
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mb-5">
            Product
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/payroll"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
                data-testid="footer-payroll-link"
              >
                Kedbyte Payroll
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={colItem} className="md:col-span-2">
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mb-5">
            Registered
          </h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Kedbyte Private Limited
            <br />
            Vadodara, Gujarat, India
          </p>
        </motion.div>
      </motion.div>

      {/* Big wordmark — settles via scaleX (transform-only; the previous
          letter-spacing animation was a layout-shift source) */}
      <div className="mt-16 overflow-hidden" aria-hidden>
        <motion.div
          className="text-center font-heading font-black uppercase leading-none text-[13vw] md:text-[10vw] text-white/[0.06] select-none whitespace-nowrap tracking-[0.02em]"
          style={{ willChange: "transform" }}
          initial={fixedMode ? { scaleX: 1.18, opacity: 0 } : false}
          animate={
            !fixedMode || revealed
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 1.18, opacity: 0 }
          }
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          KEDBYTE
        </motion.div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-zinc-500 font-mono">
        <span>© {new Date().getFullYear()} Kedbyte Private Limited. All rights reserved.</span>
        <span>Incorporated 08 May 2026 · Vadodara, Gujarat.</span>
      </div>
    </div>
  );

  if (!fixedMode) {
    return (
      <>
        {/* Keeps the useScroll target hydrated in flow mode (no layout impact) */}
        <div ref={spacerRef} aria-hidden />
        <footer ref={footRef} className="border-t border-white/10 bg-ink" data-testid="site-footer">
          {inner}
        </footer>
      </>
    );
  }

  return (
    <>
      {/* Scroll room standing in for the fixed footer */}
      <div ref={spacerRef} style={{ height: footerH }} aria-hidden />
      <footer
        ref={footRef}
        className="fixed bottom-0 left-0 right-0 z-0 border-t border-white/10 bg-ink"
        data-testid="site-footer"
      >
        <motion.div style={{ y: parallaxY }}>{inner}</motion.div>
      </footer>
    </>
  );
}
