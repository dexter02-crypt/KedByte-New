import { motion } from "framer-motion";

/**
 * GlitchText - Cyberpunk-style glitch effect on text
 * Perfect for tech/futuristic themes
 */
export default function GlitchText({ 
  children, 
  className = "",
  glitchOnHover = false 
}) {
  const glitchVariants = {
    initial: { x: 0 },
    glitch: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.4,
        repeat: glitchOnHover ? 0 : Infinity,
        repeatDelay: 2,
      },
    },
  };

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial="initial"
      animate={glitchOnHover ? "initial" : "glitch"}
      whileHover={glitchOnHover ? "glitch" : undefined}
      variants={glitchVariants}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 text-cyan-accent opacity-70"
        style={{ clipPath: "inset(0 0 50% 0)" }}
        animate={{
          x: [0, -2, 2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute top-0 left-0 text-pink-500 opacity-70"
        style={{ clipPath: "inset(50% 0 0 0)" }}
        animate={{
          x: [0, 2, -2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
          delay: 0.1,
        }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
