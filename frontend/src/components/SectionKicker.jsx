import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * SectionKicker — mono section label with index badge.
 * On entering the viewport the cyan rule draws itself (scale-x from left),
 * then the label characters type in. Reduced motion: simple fade.
 */
export default function SectionKicker({ index, children, className = "" }) {
  const reduced = useReducedMotion();
  const label = typeof children === "string" ? children : null;

  if (reduced || !label) {
    return (
      <motion.div
        className={`flex items-center gap-3 ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        {index && (
          <span className="font-mono text-xs text-cyan-accent">{index}</span>
        )}
        <span className="h-px w-8 bg-cyan-accent/50" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
          {children}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {index && (
        <motion.span
          className="font-mono text-xs text-cyan-accent"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.3 } },
          }}
        >
          {index}
        </motion.span>
      )}
      <motion.span
        className="h-px w-8 origin-left bg-cyan-accent/50"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.5, ease: EASE } },
        }}
      />
      <motion.span
        className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500"
        variants={{
          hidden: {},
          visible: { transition: { delayChildren: 0.25, staggerChildren: 0.02 } },
        }}
        aria-label={label}
      >
        {label.split("").map((char, i) => (
          <motion.span
            key={i}
            aria-hidden
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.02 } },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </motion.div>
  );
}
