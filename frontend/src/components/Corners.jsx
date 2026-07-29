import { motion } from "framer-motion";

const spring = { type: "spring", stiffness: 350, damping: 22 };

// Per-corner outward offsets for the "hover" variant (6px away from center)
const corners = [
  { pos: "left-3 top-3 border-l border-t", hover: { x: -6, y: -6 } },
  { pos: "right-3 top-3 border-r border-t", hover: { x: 6, y: -6 } },
  { pos: "left-3 bottom-3 border-l border-b", hover: { x: -6, y: 6 } },
  { pos: "right-3 bottom-3 border-r border-b", hover: { x: 6, y: 6 } },
];

/**
 * Corners — HUD bracket accents. When rendered inside a motion parent that
 * switches between "rest" and "hover" variants, the brackets spring outward
 * by 6px on hover (variants propagate through the tree). Standalone usage is
 * unchanged — they just render statically.
 */
export default function Corners({ className = "" }) {
  return (
    <span className={`pointer-events-none ${className}`} aria-hidden>
      {corners.map((c) => (
        <motion.span
          key={c.pos}
          className={`absolute h-3 w-3 border-cyan-accent/60 ${c.pos}`}
          variants={{ rest: { x: 0, y: 0 }, hover: c.hover }}
          transition={spring}
        />
      ))}
    </span>
  );
}
