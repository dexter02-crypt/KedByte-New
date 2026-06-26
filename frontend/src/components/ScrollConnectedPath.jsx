import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ScrollConnectedPath - SVG path that draws/animates based on scroll position
 * Perfect for timeline visualizations, process flows, etc.
 */
export default function ScrollConnectedPath({ 
  children,
  pathColor = "#00F0FF",
  dotColor = "#00F0FF",
  lineWidth = 2,
  className = ""
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, pathLength]);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* SVG Path */}
      <svg
        className="absolute left-8 md:left-16 top-0 h-full w-1"
        style={{ zIndex: 0 }}
      >
        {/* Background path */}
        <motion.path
          ref={pathRef}
          d="M 0 0 L 0 100%"
          stroke={pathColor}
          strokeWidth={lineWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Animated path */}
        <motion.path
          d="M 0 0 L 0 100%"
          stroke={pathColor}
          strokeWidth={lineWidth}
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={useTransform(pathProgress, (v) => pathLength - v)}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${pathColor})`
          }}
        />
        {/* Animated dot at the end */}
        <motion.circle
          cx="0"
          cy={useTransform(scrollYProgress, [0, 1], ["0%", "100%"])}
          r="4"
          fill={dotColor}
          style={{
            filter: `drop-shadow(0 0 6px ${dotColor})`
          }}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 pl-20 md:pl-32">
        {children}
      </div>
    </div>
  );
}
