import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import TextScramble from "@/components/TextScramble";
import GlitchText from "@/components/GlitchText";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink"
      data-testid="notfound-page"
    >
      {/* Slowly drifting tech grid */}
      <motion.div
        className="tech-grid grid-fade absolute inset-0 opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <div className="glow-orb animate-pulse-glow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-cyan-accent mb-6"
        >
          <TextScramble text="Error · Signal lost" trigger="always" duration={900} />
        </motion.p>

        <motion.h1
          initial={{ y: "20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-black tracking-tight text-white leading-none text-[28vw] md:text-[18rem]"
        >
          <GlitchText glitchOnHover>
            4<span className="text-cyan-accent text-glow">0</span>4
          </GlitchText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto max-w-md text-zinc-400 text-lg leading-relaxed"
        >
          This route returned a null pointer. The page you're looking for has been
          moved, deprecated, or never deployed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <MagneticButton to="/" testid="notfound-home-cta" arrow={false} className="whitespace-nowrap">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <ArrowLeft className="h-4 w-4" /> Back home
            </span>
          </MagneticButton>
          <Link
            to="/contact"
            data-testid="notfound-contact-link"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Report an issue
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
