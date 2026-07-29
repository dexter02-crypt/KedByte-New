import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import PageScrollIndicator from "@/components/PageScrollIndicator";
import RouteCurtain from "@/components/RouteCurtain";
import { CtaPanelProvider } from "@/components/StartProjectPanel";
import SmoothScroll, { useLenis } from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

/**
 * Jumps to the top on route change — instantly, and timed so it happens while
 * the RouteCurtain has the viewport fully covered (curtain-in takes ~0.5s).
 * Goes through Lenis when active so its internal scroll state stays in sync.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return undefined;
    }
    const t = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 500);
    return () => clearTimeout(t);
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
  // First-load-only preloader: App mounts once per full page load, so route
  // changes never bring it back. The app content mounts as the preloader
  // panels begin their exit wipe, so the hero entrance chains after it.
  const [revealed, setRevealed] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="App font-body">
        {!preloaderDone && (
          <Preloader
            onReveal={() => setRevealed(true)}
            onComplete={() => setPreloaderDone(true)}
          />
        )}
        {revealed && (
          <SmoothScroll>
            <div className="grain" />
            <Cursor />
            <ScrollProgress />
            <PageScrollIndicator />
            <Toaster position="bottom-right" />
            <BrowserRouter>
              <CtaPanelProvider>
                <ScrollToTop />
                <RouteCurtain />
                <AnimatedRoutes />
              </CtaPanelProvider>
            </BrowserRouter>
          </SmoothScroll>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
