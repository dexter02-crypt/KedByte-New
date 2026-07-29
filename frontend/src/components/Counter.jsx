import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export const Counter = ({ to, suffix = "", prefix = "", decimals = 0, duration = 2000 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setVal(to);
      return undefined;
    }
    let start;
    let id;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) {
        id = requestAnimationFrame(step);
      } else {
        setVal(to);
        setDone(true);
      }
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [inView, reduced, to, duration]);

  return (
    <motion.span
      ref={ref}
      className="font-mono"
      // Brief cyan flash as the counter lands on its final value
      animate={
        done
          ? {
              color: ["#00F0FF", "#FFFFFF"],
              textShadow: [
                "0 0 24px rgba(0, 240, 255, 0.8)",
                "0 0 0px rgba(0, 240, 255, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
};

export default Counter;
