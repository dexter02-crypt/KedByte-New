import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const MagneticButton = ({
  children,
  to,
  href,
  variant = "primary",
  className = "",
  onClick,
  type,
  arrow = true,
  testid,
  disabled,
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setPos({ x, y });
  };
  
  const reset = () => setPos({ x: 0, y: 0 });

  const handleClick = (e) => {
    if (disabled) return;
    
    // Create ripple effect
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    
    if (onClick) onClick(e);
  };

  const base =
    "shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-all duration-300 disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-white text-[#050505] hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      : "border border-white/20 text-white hover:bg-white/10 hover:border-cyan-accent/50";

  const inner = (
    <>
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      
      <motion.span
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {arrow && (
        <motion.div
          whileHover={{ rotate: 45, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.div>
      )}
    </>
  );

  const motionProps = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onClick: handleClick,
    animate: { x: pos.x, y: pos.y },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 200, damping: 15 },
    className: `${base} ${styles} ${className}`,
    "data-testid": testid,
  };

  if (to)
    return (
      <motion.div {...motionProps} style={{ display: "inline-flex" }}>
        <Link to={to} className="inline-flex items-center gap-2" data-testid={testid ? `${testid}-link` : undefined}>
          {inner}
        </Link>
      </motion.div>
    );
  if (href)
    return (
      <motion.a {...motionProps} href={href}>
        {inner}
      </motion.a>
    );
  return (
    <motion.button {...motionProps} onClick={handleClick} type={type} disabled={disabled}>
      {inner}
    </motion.button>
  );
};

export default MagneticButton;
