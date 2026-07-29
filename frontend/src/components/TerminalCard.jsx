import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const lines = [
  { t: "$ kedbyte deploy --stack ai,cloud", c: "text-zinc-300" },
  { t: "› provisioning infrastructure ...", c: "text-zinc-400" },
  { t: "✓ containers online  ·  region: ap-south", c: "text-emerald-400" },
  { t: "› training model ...", c: "text-zinc-400" },
  { t: "✓ accuracy 99.2%  ·  latency 38ms", c: "text-emerald-400" },
  { t: "✓ pipeline shipped to production", c: "text-cyan-accent" },
];

export default function TerminalCard({ progress }) {
  const [typedCommand, setTypedCommand] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const commandText = lines[0].t;

  // Character-by-character typing for the first line (command)
  useEffect(() => {
    if (!progress && isTyping) {
      if (typedCommand.length < commandText.length) {
        const timer = setTimeout(() => {
          setTypedCommand(commandText.slice(0, typedCommand.length + 1));
        }, 80); // 80ms per character - feels like human typing
        return () => clearTimeout(timer);
      } else {
        // Command finished typing, pause then start showing lines
        const pause = setTimeout(() => {
          setIsTyping(false);
          setShowCursor(false);
        }, 500);
        return () => clearTimeout(pause);
      }
    }
  }, [typedCommand, isTyping, progress, commandText]);

  // Show lines one by one after command is typed
  useEffect(() => {
    if (!progress && !isTyping && currentLineIndex < lines.length - 1) {
      const timer = setTimeout(() => {
        setVisibleLines([...visibleLines, currentLineIndex + 1]);
        setCurrentLineIndex(currentLineIndex + 1);
      }, 700); // 700ms between each line
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, isTyping, visibleLines, progress]);

  // Reset animation
  useEffect(() => {
    if (!progress && visibleLines.length >= lines.length - 1) {
      const reset = setTimeout(() => {
        setTypedCommand("");
        setIsTyping(true);
        setShowCursor(true);
        setVisibleLines([]);
        setCurrentLineIndex(0);
      }, 3200);
      return () => clearTimeout(reset);
    }
  }, [visibleLines, progress]);

  // If progress prop is provided (for scroll-driven animations)
  const displayCount = progress 
    ? Math.floor((progress.get?.() || progress) / 100 * lines.length)
    : null;

  // Render for scroll-driven mode
  if (progress && displayCount !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden"
        data-testid="hero-terminal"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[10px] tracking-wider text-zinc-400">
            kedbyte@core — zsh
          </span>
        </div>
        <div className="p-5 font-mono text-[12px] leading-6 min-h-[180px]">
          {lines.slice(0, displayCount).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={l.c}
            >
              {l.t}
            </motion.div>
          ))}
          <span className="inline-block w-2 h-4 align-middle bg-cyan-accent blink" />
        </div>
      </motion.div>
    );
  }

  // Render for typing animation mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden"
      data-testid="hero-terminal"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[10px] tracking-wider text-zinc-400">
          kedbyte@core — zsh
        </span>
      </div>
      <div className="p-5 font-mono text-[12px] leading-6 min-h-[180px]">
        {/* Typing command line */}
        <div className={lines[0].c}>
          {typedCommand}
          {showCursor && (
            <motion.span
              className="inline-block w-2 h-4 align-middle bg-cyan-accent ml-0.5"
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>

        {/* Status lines - fade in one by one */}
        <AnimatePresence>
          {visibleLines.map((lineIndex) => (
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={lines[lineIndex].c}
            >
              {lines[lineIndex].t}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Final blinking cursor when complete */}
        {!isTyping && visibleLines.length >= lines.length - 1 && (
          <motion.span
            className="inline-block w-2 h-4 align-middle bg-cyan-accent"
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
