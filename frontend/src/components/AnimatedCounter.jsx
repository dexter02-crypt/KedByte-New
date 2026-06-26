import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * AnimatedCounter - Odometer-style number animation
 * @param {number} value - Target number
 * @param {string} suffix - Text to append (%, +, etc)
 * @param {number} decimals - Decimal places
 */
export default function AnimatedCounter({ 
  value, 
  suffix = "", 
  decimals = 0,
  duration = 2.5 
}) {
  const spring = useSpring(0, { 
    duration: duration * 1000, 
    bounce: 0 
  });
  
  const display = useTransform(spring, (latest) => 
    latest.toFixed(decimals) + suffix
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}
