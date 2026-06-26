import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * MouseTilt3D - Card that tilts based on mouse position (3D effect)
 * @param {ReactNode} children - Content to wrap
 * @param {string} className - CSS classes
 * @param {number} strength - Tilt strength (0-1)
 */
export default function MouseTilt3D({ 
  children, 
  className = "",
  strength = 0.5,
  glowEffect = true,
  scaleOnHover = true
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [strength * 20, -strength * 20]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-strength * 20, strength * 20]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={scaleOnHover ? { scale: 1.03 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative ${className}`}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0,240,255,0.15) 0%, transparent 60%)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
