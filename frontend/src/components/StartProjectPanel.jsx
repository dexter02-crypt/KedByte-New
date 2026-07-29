import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CtaPanelContext = createContext({ open: () => {}, close: () => {} });
export const useCtaPanel = () => useContext(CtaPanelContext);

/**
 * CtaPanelProvider — site-wide "Start a project" slide-over funnel.
 *
 * Opens from any page: right slide-over on a spring, focus-trapped,
 * aria-modal, Esc closes, background #root set inert, focus returned to
 * the opener on close. Posts the 3-field quick form to /api/contact so a
 * prospect can reach out in seconds without navigating to Contact.
 */
export function CtaPanelProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef(null);

  const open = useCallback(() => {
    openerRef.current = document.activeElement;
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
  }, []);

  return (
    <CtaPanelContext.Provider value={{ open, close }}>
      {children}
      <Panel isOpen={isOpen} onClose={close} />
    </CtaPanelContext.Provider>
  );
}

function Panel({ isOpen, onClose }) {
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success

  // Inert background + Esc + focus trap while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        "button, [href], input, textarea, select"
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Focus the first field once mounted
    const t = setTimeout(
      () => panelRef.current?.querySelector("input")?.focus(),
      reduced ? 50 : 350
    );
    return () => {
      root?.removeAttribute("inert");
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen, onClose, reduced]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all three fields.");
      return;
    }
    setStatus("sending");
    try {
      await axios.post(`${API}/contact`, { ...form, company: "", budget: "" });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2200);
    } catch (err) {
      setStatus("idle");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-zinc-600 focus:border-cyan-accent focus:outline-none transition-colors";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250]" data-testid="cta-panel-root">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          {/* Slide-over */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Start a project"
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-[#0a0a0b] p-8 md:p-10 overflow-y-auto"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={
              reduced
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 320, damping: 32 }
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-accent">
                  Start a project
                </p>
                <h2 className="mt-3 font-heading font-bold tracking-tight text-3xl text-white">
                  Tell us the one-liner.
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                data-testid="cta-panel-close"
                className="rounded-full border border-white/15 p-2 text-zinc-400 hover:text-white hover:border-cyan-accent/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-zinc-400 leading-relaxed text-sm">
              Three fields, fifteen seconds. We reply within one business day.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-6" data-testid="cta-panel-form">
              <div>
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
                  Your name
                </label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  data-testid="cta-panel-name"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={update("email")}
                  placeholder="jane@company.com"
                  data-testid="cta-panel-email"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
                  What are you building?
                </label>
                <input
                  className={inputCls}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="One line is enough…"
                  data-testid="cta-panel-message"
                />
              </div>

              <motion.button
                type="submit"
                layout
                disabled={status !== "idle"}
                data-testid="cta-panel-submit"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-500 ${
                  status === "success"
                    ? "bg-cyan-accent text-[#050505]"
                    : "bg-white text-[#050505] hover:bg-zinc-200"
                }`}
                transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === "idle" && (
                    <motion.span
                      key="idle"
                      className="inline-flex items-center gap-2 whitespace-nowrap"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      Send it <ArrowUpRight className="h-4 w-4" />
                    </motion.span>
                  )}
                  {status === "sending" && (
                    <motion.span
                      key="sending"
                      className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs tracking-[0.25em]"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" /> SENDING...
                    </motion.span>
                  )}
                  {status === "success" && (
                    <motion.span
                      key="success"
                      className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs tracking-[0.25em]"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <Check className="h-4 w-4" /> MESSAGE SENT
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <p className="mt-8 text-sm text-zinc-500">
              Prefer the full brief?{" "}
              <Link
                to="/contact"
                onClick={onClose}
                className="text-zinc-300 underline decoration-cyan-accent/50 underline-offset-4 hover:text-cyan-accent transition-colors"
              >
                Use the detailed form
              </Link>
              .
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
