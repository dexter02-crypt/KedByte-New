import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import PageScrollIndicator from "@/components/PageScrollIndicator";
import RouteCurtain from "@/components/RouteCurtain";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App font-body">
      <div className="grain" />
      <Cursor />
      <ScrollProgress />
      <PageScrollIndicator />
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <ScrollToTop />
        <RouteCurtain />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
