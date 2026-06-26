import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * SplitText - Character by character animation reveal
 * @param {string} text - Text to animate
 * @param {string} className - CSS classes
 * @param {number} delay - Initial delay before animation starts
 * @param {number} charDelay - Delay between each character
 */
export default function SplitText({ 
  text, 
  className = "", 
  delay = 0, 
  charDelay = 0.03,
  type = "chars" // "chars" or "words"
}) {
  const elements = useMemo(() => {
    if (type === "words") {
      return text.split(" ").map((word, i) => ({ content: word, key: `word-${i}` }));
    }
    return text.split("").map((char, i) => ({ content: char, key: `char-${i}` }));
  }, [text, type]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: charDelay,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {elements.map((element, i) => (
        <motion.span
          key={element.key}
          variants={childVariants}
          style={{ display: "inline-block" }}
        >
          {element.content === " " ? "\u00A0" : element.content}
        </motion.span>
      ))}
    </motion.span>
  );
}
