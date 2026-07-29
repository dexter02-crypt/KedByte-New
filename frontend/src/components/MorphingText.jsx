import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MorphingText - Text that morphs between different phrases
 * Perfect for hero sections and attention-grabbing headlines
 */
export default function MorphingText({
  words = [],
  className = "",
  interval = 3000,
  startDelay = 0
}) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(startDelay === 0);

  useEffect(() => {
    if (started) return undefined;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [started, startDelay]);

  useEffect(() => {
    if (!started) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [started, words.length, interval]);

  return (
    <span className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        {/* No filter blur here: blur() is a BOX-level effect — on a black-weight
            all-caps word the blurred box reads as a rectangular halo band
            behind the text on every swap. Pure y/opacity keeps the morph. */}
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
