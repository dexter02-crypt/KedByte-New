import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

/**
 * SectionIndicator - Shows current section with animated dots
 */
const sections = ["Hero", "Services", "Stats", "CTA"];

export default function SectionIndicator() {
  const { scrollYProgress } = useScroll();
  const currentSection = useTransform(scrollYProgress, (latest) => {
    return Math.floor(latest * sections.length);
  });

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {sections.map((section, i) => (
        <div key={section} className="flex items-center gap-3 group cursor-pointer">
          <motion.span
            className="text-xs font-mono uppercase tracking-wider text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: 10 }}
            whileHover={{ x: 0 }}
          >
            {section}
          </motion.span>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full border border-zinc-600"
              animate={{
                borderColor: i === Math.floor(scrollYProgress.get() * sections.length) 
                  ? "rgb(0, 240, 255)" 
                  : "rgb(82, 82, 91)",
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-accent"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: i === Math.floor(scrollYProgress.get() * sections.length) ? 1 : 0,
                opacity: i === Math.floor(scrollYProgress.get() * sections.length) ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
