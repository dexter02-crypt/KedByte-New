import { motion } from "framer-motion";

/**
 * Reveal — single scroll-triggered fade-up.
 * Spec: opacity 0 → 1, translateY 30px → 0, duration 0.6s, ease-out, fires once.
 * Pass `delay` (seconds) to create manual stagger between adjacent reveals.
 */
export const Reveal = ({ children, delay = 0, y = 30, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
