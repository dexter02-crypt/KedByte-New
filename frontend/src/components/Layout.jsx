import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// CONFIRM: production domain (used for canonical + og:url + sitemap)
const SITE = "https://kedbyte.com";

const META = {
  "/": {
    title: "Kedbyte — Software · AI · Automation",
    desc: "Kedbyte is an ultra-minimal software studio in Vadodara, India — engineering custom software, applied AI and automated infrastructure from interface to production.",
  },
  "/services": {
    title: "Kedbyte — Services",
    desc: "Custom software, frontend & backend engineering, applied AI & machine learning, infrastructure automation and UI/UX design — one connected pipeline, one partner.",
  },
  "/payroll": {
    title: "Kedbyte Payroll — UK payroll software for bureaux & accountants",
    desc: "In development for tax year 2026/27: a penny-exact UK payroll engine that passes every row of HMRC's published test data. HMRC PAYE recognition in progress — join the early-access list.",
  },
  "/about": {
    title: "Kedbyte — About",
    desc: "A studio for the curious and the bold. Founded 2026 in Vadodara, Gujarat — full-spectrum engineering at the intersection of advanced technology and ultra-minimal design.",
  },
  "/careers": {
    title: "Kedbyte — Careers",
    desc: "Build the future with us. Remote-friendly engineering, design and AI roles at Kedbyte — outcome-driven work with real ownership.",
  },
  "/contact": {
    title: "Kedbyte — Contact",
    desc: "Tell us about your project. Kedbyte replies within one business day — custom software, AI and automation from Vadodara, India.",
  },
};

function applyMeta(pathname) {
  const meta = META[pathname] || {
    title: "Kedbyte — Page not found",
    desc: META["/"].desc,
  };
  document.title = meta.title;

  const ensure = (selector, create) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = create();
      document.head.appendChild(el);
    }
    return el;
  };
  const setMeta = (attr, key, content) => {
    ensure(`meta[${attr}="${key}"]`, () => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      return m;
    }).setAttribute("content", content);
  };

  setMeta("name", "description", meta.desc);
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.desc);
  setMeta("property", "og:url", SITE + pathname);
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.desc);
  ensure('link[rel="canonical"]', () => {
    const l = document.createElement("link");
    l.rel = "canonical";
    return l;
  }).href = SITE + pathname;
}

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyMeta(pathname);
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
