import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import useMediaQuery from "@/hooks/use-media-query";
import {
  SiVercel,
  SiCloudflare,
  SiDigitalocean,
  SiGooglecloud,
  SiReact,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiTypescript,
  SiPostgresql,
  SiTensorflow,
  SiNodedotjs,
  SiGo,
  SiTerraform,
  SiSolidity,
  SiEthereum,
} from "react-icons/si";

const icons = [
  { Icon: SiGooglecloud, name: "Google Cloud" },
  { Icon: SiCloudflare, name: "Cloudflare" },
  { Icon: SiDigitalocean, name: "DigitalOcean" },
  { Icon: SiVercel, name: "Vercel" },
  { Icon: SiKubernetes, name: "Kubernetes" },
  { Icon: SiDocker, name: "Docker" },
  { Icon: SiTerraform, name: "Terraform" },
  { Icon: SiReact, name: "React" },
  { Icon: SiTypescript, name: "TypeScript" },
  { Icon: SiNodedotjs, name: "Node.js" },
  { Icon: SiPython, name: "Python" },
  { Icon: SiGo, name: "Go" },
  { Icon: SiTensorflow, name: "TensorFlow" },
  { Icon: SiSolidity, name: "Solidity" },
  { Icon: SiEthereum, name: "Ethereum" },
  { Icon: SiPostgresql, name: "PostgreSQL" },
];

const COPIES = 3;

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function IconRow() {
  return (
    <>
      {icons.map(({ Icon, name }, i) => (
        <div
          key={i}
          className="mx-10 flex items-center gap-3 text-zinc-400 hover:text-white transition-colors duration-300"
          title={name}
        >
          <Icon className="h-8 w-8" aria-hidden="true" focusable="false" />
          <span className="font-mono text-sm tracking-tight hidden sm:inline">{name}</span>
        </div>
      ))}
    </>
  );
}

/**
 * TechMarquee — scroll-velocity-reactive marquee.
 *
 * Base drift plus a boost proportional to (spring-smoothed) scroll velocity;
 * scrolling up reverses the travel direction. A slight skew, clamped to
 * ±2.5deg and proportional to the same velocity, springs back to 0 at rest.
 * Lenis drives the real window scroll, so useScroll/useVelocity pick it up
 * directly. Reduced motion: a static row, no animation.
 */
export default function TechMarquee() {
  const reduced = useReducedMotion();
  // Mobile: no skew, gentler velocity response
  const mobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef(null);
  // Pause the rAF work entirely while the marquee is off-screen
  const inView = useInView(containerRef);
  const baseX = useMotionValue(0);
  const direction = useRef(-1);
  const paused = useRef(false);
  // A scroll flick should make the marquee hurry, not teleport
  const boostRef = useRef(0.6);
  boostRef.current = mobile ? 0.3 : 0.6;

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 180 });
  const velocityFactor = useTransform(smoothVelocity, [-1500, 1500], [-2.5, 2.5], {
    clamp: true,
  });
  const skewX = useTransform(smoothVelocity, [-1500, 1500], [-2.5, 2.5], {
    clamp: true,
  });

  useAnimationFrame((t, delta) => {
    if (!inView) return;
    const vf = velocityFactor.get();
    // Scroll direction steers travel direction; it sticks after scrolling stops
    if (vf < 0) direction.current = 1;
    else if (vf > 0) direction.current = -1;

    const base = paused.current ? 0 : 2.5;
    const moveBy =
      direction.current * (base + base * Math.abs(vf) * boostRef.current) * (delta / 1000);
    baseX.set(wrap(-100 / COPIES, 0, baseX.get() + moveBy));
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  if (reduced) {
    return (
      <div className="marquee-mask overflow-hidden py-4" data-testid="tech-marquee">
        <div className="flex w-max">
          <IconRow />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="marquee-mask overflow-hidden py-4" data-testid="tech-marquee">
      <motion.div
        className="flex w-max"
        style={{ x, skewX: mobile ? 0 : skewX, willChange: "transform" }}
        onHoverStart={() => (paused.current = true)}
        onHoverEnd={() => (paused.current = false)}
      >
        {Array.from({ length: COPIES }, (_, i) => (
          <IconRow key={i} />
        ))}
      </motion.div>
    </div>
  );
}
