import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * TextScramble - Text that scrambles and resolves letter by letter
 * Perfect for dramatic reveals and cyberpunk aesthetics
 */

const chars = "!<>-_\\/[]{}—=+*^?#________";

export default function TextScramble({ 
  text, 
  className = "",
  speed = 50,
  trigger = "view" // "view", "hover", "always"
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (trigger === "always") {
      scramble();
    }
  }, [trigger]);

  const handleViewport = () => {
    if (trigger === "view") {
      scramble();
    }
  };

  return (
    <motion.span
      className={className}
      onViewportEnter={trigger === "view" ? handleViewport : undefined}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      viewport={{ once: true, margin: "-100px" }}
    >
      {displayText}
    </motion.span>
  );
}
