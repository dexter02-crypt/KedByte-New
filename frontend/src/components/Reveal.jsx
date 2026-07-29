import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
// -40px: content greets you as you scroll — -80px made reveals feel late
const VIEWPORT = { once: true, margin: "-40px" };

/**
 * Reveal — scroll-triggered entrance, GPU-friendly (transform/opacity/clip-path
 * only), fires once, default ease cubic-bezier(0.22, 1, 0.36, 1).
 *
 * Variants:
 *   "fade-up" (default) — opacity 0 → 1, translateY `y`px → 0
 *   "mask"              — content rises out of an overflow-hidden mask (headings)
 *   "clip"              — clip-path inset wipe, top → bottom (images/cards)
 *
 * `delay` (seconds) creates manual stagger between adjacent reveals.
 * Reduced motion: every variant collapses to a simple fade.
 */
export const Reveal = ({
  children,
  delay = 0,
  y = 30,
  variant = "fade-up",
  duration,
  className = "",
  ...rest
}) => {
  const reduced = useReducedMotion();
  const innerRef = useRef(null);
  const clearWillChange = () => {
    if (innerRef.current) innerRef.current.style.willChange = "auto";
  };

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay }}
        className={className}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === "mask") {
    // The observer must watch the un-transformed wrapper: the inner element
    // starts fully outside the overflow-hidden clip, so IntersectionObserver
    // would never report it visible. Variants propagate parent → child.
    return (
      <motion.div
        className={`overflow-hidden ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        {...rest}
      >
        <motion.div
          ref={innerRef}
          variants={{
            hidden: { y: "110%" },
            visible: {
              y: "0%",
              transition: { duration: duration ?? 0.7, delay, ease: EASE },
            },
          }}
          style={{ willChange: "transform" }}
          onAnimationComplete={clearWillChange}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  if (variant === "clip") {
    return (
      <motion.div
        ref={innerRef}
        initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: duration ?? 0.75, delay, ease: EASE }}
        style={{ willChange: "clip-path" }}
        onAnimationComplete={clearWillChange}
        className={className}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: duration ?? 0.6, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
