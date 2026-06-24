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

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setPos({ x, y });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors duration-300 disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-white text-[#050505] hover:bg-zinc-200"
      : "border border-white/20 text-white hover:bg-white/10";

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  const motionProps = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    animate: { x: pos.x, y: pos.y },
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
    <motion.button {...motionProps} onClick={onClick} type={type} disabled={disabled}>
      {inner}
    </motion.button>
  );
};

export default MagneticButton;
