import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CursorGlow - Ambient glow effect that follows the mouse cursor
 * Creates a "flashlight in the dark" or "neon aura" effect
 */
export default function CursorGlow() {
  const cursorX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Smooth spring animation with lag effect for smooth following
  const smoothX = useSpring(cursorX, {
    damping: 50,
    stiffness: 100,
    restDelta: 0.5
  });
  
  const smoothY = useSpring(cursorY, {
    damping: 50,
    stiffness: 100,
    restDelta: 0.5
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Pure black background layer */}
      <div
        className="fixed inset-0 pointer-events-none bg-black"
        style={{ zIndex: -2 }}
      />
      
      {/* Cursor-tracking glow layer */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -1,
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <motion.div
          className="absolute w-[1400px] h-[1400px] rounded-full"
          style={{
            left: smoothX,
            top: smoothY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, rgba(15, 20, 35, 0.6) 0%, rgba(12, 16, 30, 0.45) 20%, rgba(10, 14, 26, 0.3) 40%, rgba(8, 11, 22, 0.18) 60%, rgba(5, 8, 18, 0.08) 80%, transparent 100%)",
            filter: "blur(180px)",
          }}
        />
      </motion.div>
    </>
  );
}
