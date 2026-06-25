import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ease = [0.76, 0, 0.24, 1];

export default function RouteCurtain() {
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="pointer-events-none fixed inset-0 z-[150]">
        {/* Sliding panel */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0b] flex items-center justify-center"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease }}
          style={{ originY: 0 }}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-heading font-black tracking-tighter text-2xl text-white"
          >
            KED<span className="text-cyan-accent">BYTE</span>
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
