import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/**
 * Spotlight - Creates a spotlight effect that follows the mouse
 */
export default function Spotlight({ className = "" }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      return () => element.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,240,255,0.12), transparent 60%)`,
        }}
        whileHover={{ opacity: 1 }}
      />
    </div>
  );
}
