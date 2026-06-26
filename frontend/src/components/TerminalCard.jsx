import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  { t: "$ kedbyte deploy --stack ai,cloud", c: "text-zinc-300" },
  { t: "› provisioning infrastructure ...", c: "text-zinc-500" },
  { t: "✓ containers online  ·  region: ap-south", c: "text-emerald-400" },
  { t: "› training model ...", c: "text-zinc-500" },
  { t: "✓ accuracy 99.2%  ·  latency 38ms", c: "text-emerald-400" },
  { t: "✓ pipeline shipped to production", c: "text-cyan-accent" },
];

export default function TerminalCard({ progress }) {
  const [count, setCount] = useState(0);

  // Use progress if provided, otherwise use time-based animation
  useEffect(() => {
    if (!progress) {
      if (count >= lines.length) {
        const reset = setTimeout(() => setCount(0), 3200);
        return () => clearTimeout(reset);
      }
      const t = setTimeout(() => setCount((c) => c + 1), 700);
      return () => clearTimeout(t);
    }
  }, [count, progress]);

  // If progress is provided, calculate lines to show based on progress
  const displayCount = progress 
    ? Math.floor((progress.get?.() || progress) / 100 * lines.length)
    : count;

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
        <span className="ml-2 font-mono text-[10px] tracking-wider text-zinc-500">
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
