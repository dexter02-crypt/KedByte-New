import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const Counter = ({ to, suffix = "", prefix = "", decimals = 0, duration = 2000 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) requestAnimationFrame(step);
      else setVal(to);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default Counter;
