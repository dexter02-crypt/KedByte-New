import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ParallaxLayer - Wrapper that creates parallax scroll effect
 * @param {ReactNode} children - Content to parallax
 * @param {number} speed - Parallax speed multiplier (negative = move up, positive = move down)
 * @param {string} className - CSS classes
 */
export default function ParallaxLayer({ 
  children, 
  speed = 0.5, 
  className = "",
  horizontal = false 
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const x = useTransform(scrollYProgress, [0, 1], [0, horizontal ? speed * 100 : 0]);

  return (
    <motion.div
      ref={ref}
      style={horizontal ? { x } : { y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
