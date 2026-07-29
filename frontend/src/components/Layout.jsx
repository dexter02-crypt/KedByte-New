import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TITLES = {
  "/": "Kedbyte — Software · AI · Automation",
  "/services": "Kedbyte — Services",
  "/about": "Kedbyte — About",
  "/careers": "Kedbyte — Careers",
  "/contact": "Kedbyte — Contact",
};

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] || "Kedbyte — Page not found";
  }, [pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:rounded-full focus:bg-cyan-accent focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:tracking-[0.15em] focus:uppercase focus:text-[#050505]"
      >
        Skip to content
      </a>
      <Header />
      <motion.main
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 min-h-screen bg-ink"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </>
  );
}
