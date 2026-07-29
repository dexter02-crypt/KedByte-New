import { useCallback, useEffect, useRef, useState } from "react";
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
  // Refs (not state) so `scramble` stays referentially stable and the
  // "always" effect doesn't retrigger itself every time a run finishes.
  const scramblingRef = useRef(false);
  const intervalRef = useRef(null);

  const scramble = useCallback(() => {
    if (scramblingRef.current) return;
    scramblingRef.current = true;

    let iteration = 0;
    intervalRef.current = setInterval(() => {
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
        clearInterval(intervalRef.current);
        scramblingRef.current = false;
      }

      iteration += 1 / 3;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (trigger === "always") {
      scramble();
    }
    return () => clearInterval(intervalRef.current);
  }, [trigger, scramble]);

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
      viewport={{ once: true, margin: "-40px" }}
    >
      {displayText}
    </motion.span>
  );
}
