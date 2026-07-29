import { motion } from "framer-motion";

/**
 * WaveText - Text with wave animation effect
 * Each character animates in a wave pattern.
 *
 * Words are wrapped in inline-block, nowrap spans so the browser can only
 * break lines at word boundaries — the per-letter inline-block spans would
 * otherwise allow a break between any two letters (e.g. "ENGINEERI-NG").
 */
export default function WaveText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  let letterIndex = 0;

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: delay + i * 0.03,
      },
    }),
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, w) => (
        // The separating space lives OUTSIDE the nowrap span so the browser
        // still has a soft-wrap opportunity between words.
        <span key={w}>
          <span className="inline-block" style={{ whiteSpace: "nowrap" }}>
            {word.split("").map((letter) => {
              const i = letterIndex++;
              return (
                <motion.span
                  key={i}
                  custom={i}
                  variants={child}
                  className="inline-block"
                  whileHover={{
                    y: -5,
                    color: "#00F0FF",
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
          </span>
          {w < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
