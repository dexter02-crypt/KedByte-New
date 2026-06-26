import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import KLogo from "@/components/KLogo";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const logoRef = useRef(null);

  // Mouse position for 3D logo tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateY = useTransform(smoothMouseX, [-200, 200], [-15, 15]);
  const rotateX = useTransform(smoothMouseY, [-200, 200], [15, -15]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        scrolled 
          ? "bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-black/95 backdrop-blur-3xl border-b border-gradient shadow-[0_4px_30px_rgba(0,240,255,0.12)]" 
          : "bg-transparent"
      }`}
      data-testid="site-header"
      style={{
        borderImage: scrolled ? "linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent) 1" : "none"
      }}
    >
      {/* Animated gradient overlay on scroll - more visible */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-accent/8 via-cyan-accent/4 to-cyan-accent/8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Animated top border line - thicker and more visible */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-accent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: scrolled ? 1 : 0,
          opacity: scrolled ? 1 : 0
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow: "0 0 10px rgba(0,240,255,0.5), 0 0 20px rgba(0,240,255,0.3)"
        }}
      />

      {/* Animated bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0.6 : 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center group">
          <motion.div
            ref={logoRef}
            style={{
              rotateY,
              rotateX,
              transformStyle: "preserve-3d",
            }}
            animate={{ 
              rotate: scrolled ? -8 : 0, 
              scale: scrolled ? 1.05 : 1,
            }}
            whileHover={{ 
              scale: 1.15,
              filter: "drop-shadow(0 0 8px rgba(0,240,255,0.6))"
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0 cursor-pointer"
          >
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <KLogo className="h-8 w-8" animate />
            </motion.div>
          </motion.div>
          <motion.span
            animate={{
              maxWidth: scrolled ? 0 : 160,
              opacity: scrolled ? 0 : 1,
              marginLeft: scrolled ? 0 : 10,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden whitespace-nowrap font-heading font-black text-xl tracking-tighter text-white"
          >
            KED<span className="text-cyan-accent">BYTE</span>
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `relative text-sm tracking-tight transition-colors duration-300 group ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className="relative z-10"
                    whileHover={{ 
                      textShadow: "0 0 8px rgba(0,240,255,0.8)",
                      y: -2
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {l.label}
                  </motion.span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-accent to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {!isActive && (
                    <motion.span
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-cyan-accent origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton to="/contact" testid="header-contact-cta">
            Let's Talk
          </MagneticButton>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {[...links, { to: "/contact", label: "Contact" }].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  className="text-lg text-zinc-200 font-heading"
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
