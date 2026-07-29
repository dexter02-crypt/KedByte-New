import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * TextScramble - text that decodes left-to-right from scrambled glyphs.
 *
 * Layout-shift-proof: the FINAL text is rendered invisibly as the layout
 * element (locking the block's size and line-breaks from first paint) and
 * the scrambling text is absolutely positioned on top of it — the random
 * glyphs can never re-wrap the heading or move content below it.
 *
 * Decode is time-based (`duration` ms, default 700): multiple characters
 * resolve per frame, left to right, with a small random look-ahead.
 */

const chars = "!<>-_\\/[]{}—=+*^?#";

export default function TextScramble({
  text,
  className = "",
  duration = 700,
  trigger = "view" // "view", "hover", "always"
}) {
  const [displayText, setDisplayText] = useState(text);
  const activeRef = useRef(false);
  const rafRef = useRef(null);

  const scramble = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      if (p === 1) {
        setDisplayText(text);
        activeRef.current = false;
        return;
      }
      const solved = Math.floor(text.length * p);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < solved || ch === " ") out += ch;
        else if (i < solved + 3 && Math.random() < 0.4) out += ch;
        else out += chars[(Math.random() * chars.length) | 0];
      }
      setDisplayText(out);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [text, duration]);

  useEffect(() => {
    if (trigger === "always") {
      scramble();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, scramble]);

  const handleViewport = () => {
    if (trigger === "view") {
      scramble();
    }
  };

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onViewportEnter={trigger === "view" ? handleViewport : undefined}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      viewport={{ once: true, margin: "-40px" }}
    >
      <span className="sr-only">{text}</span>
      {/* Final text owns the layout — invisible but fully measured */}
      <span className="invisible" aria-hidden>
        {text}
      </span>
      {/* Scrambling overlay — same box, cannot affect layout */}
      <span className="absolute inset-0" aria-hidden>
        {displayText}
      </span>
    </motion.span>
  );
}
