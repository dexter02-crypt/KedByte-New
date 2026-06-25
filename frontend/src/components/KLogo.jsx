import { motion } from "framer-motion";

/**
 * Crisp, transparent, theme-matched Kedbyte "K" mark (pure SVG — blends on any bg).
 * Set `animate` to draw the strokes on mount for a premium reveal.
 */
export default function KLogo({ className = "h-8 w-8", animate = false, accent = "#00F0FF" }) {
  const common = {
    strokeWidth: 13,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };

  const drawProps = (delay) =>
    animate
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        }
      : {};

  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Kedbyte">
      {/* vertical stem */}
      <motion.path d="M30 10 V90" stroke="#FFFFFF" {...common} {...drawProps(0)} />
      {/* upper arm */}
      <motion.path d="M30 52 L74 10" stroke="#FFFFFF" {...common} {...drawProps(0.15)} />
      {/* lower arm — cyan accent */}
      <motion.path d="M30 52 L78 90" stroke={accent} {...common} {...drawProps(0.3)} />
    </svg>
  );
}
