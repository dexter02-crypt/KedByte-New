import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Spotlight — mouse-following radial highlight overlay.
 *
 * Drop inside any `relative overflow-hidden` card: it tracks the pointer on
 * its PARENT element and fades in a cyan radial glow at the cursor position.
 * Renders nothing under reduced motion.
 */
export default function Spotlight({ className = "", size = 400 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const parent = ref.current?.parentElement;
    if (!parent) return undefined;

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, rgba(0,240,255,0.12), transparent 60%)`,
      }}
    />
  );
}
