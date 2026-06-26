import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
          className="absolute w-[1200px] h-[1200px] rounded-full"
          style={{
            left: smoothX,
            top: smoothY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, rgba(20, 20, 40, 0.4) 0%, rgba(15, 15, 30, 0.3) 25%, rgba(10, 10, 25, 0.2) 50%, rgba(5, 5, 20, 0.1) 75%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>
    </>
  );
}
