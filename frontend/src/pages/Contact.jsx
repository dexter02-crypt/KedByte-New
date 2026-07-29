import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Check, Loader2, ArrowUpRight, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionKicker from "@/components/SectionKicker";
import FAQSection from "@/components/FAQSection";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const budgets = ["< $10k", "$10k – $50k", "$50k – $150k", "$150k+", "Not sure yet"];

/**
 * Field — floating label, cyan focus hairline (scale-x), red hairline +
 * 4px/2-cycle shake on validation error. `nonce` remounts the shaker so
 * repeated failed submits replay the shake.
 */
function Field({
  label,
  value,
  onChange,
  error,
  nonce,
  textarea = false,
  type = "text",
  placeholder,
  testid,
  reduced,
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const InputTag = textarea ? "textarea" : "input";

  return (
    <motion.div
      key={`${label}-${nonce}`}
      className="relative pt-6"
      animate={error && !reduced ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label
        className={`pointer-events-none absolute left-0 font-mono uppercase transition-all duration-300 ${
          floated
            ? "top-0 text-[10px] tracking-[0.25em] " +
              (error ? "text-red-400" : focused ? "text-cyan-accent" : "text-zinc-500")
            : "top-9 text-xs tracking-[0.2em] text-zinc-500"
        }`}
      >
        {label}
      </label>
      <InputTag
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        className={`w-full bg-transparent border-b rounded-none py-3 text-white placeholder:text-zinc-600 focus:outline-none transition-colors ${
          error ? "border-red-400/60" : "border-white/20"
        } ${textarea ? "resize-none" : ""}`}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ""}
        data-testid={testid}
      />
      {/* Focus hairline draws along the bottom border */}
      <span
        className={`absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-500 ease-out ${
          error ? "scale-x-100 bg-red-400" : `bg-cyan-accent ${focused ? "scale-x-100" : "scale-x-0"}`
        }`}
      />
    </motion.div>
  );
}

export default function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});
  const [nonce, setNonce] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | success

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: false }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    const missing = {
      name: !form.name,
      email: !form.email,
      message: !form.message,
    };
    if (missing.name || missing.email || missing.message) {
      setErrors(missing);
      setNonce((n) => n + 1);
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setStatus("sending");
    try {
      const { data } = await axios.post(`${API}/contact`, form);
      setStatus("success");
      toast.success(data.message || "Message sent!");
      setForm({ name: "", email: "", company: "", budget: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("idle");
      setErrors({});
      setNonce((n) => n + 1);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const selectCls =
    "w-full bg-transparent border-b border-white/20 rounded-none py-3 text-white focus:border-cyan-accent focus:outline-none transition-colors appearance-none cursor-pointer";

  return (
    <div data-testid="contact-page">
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-40 overflow-hidden">
        <div className="tech-grid grid-fade absolute inset-0 opacity-40" />
        <div className="glow-orb animate-pulse-glow absolute top-1/4 left-[10%] h-[450px] w-[450px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div>
            <Reveal>
              <SectionKicker index="[ 05 ]">Contact</SectionKicker>
            </Reveal>
            <Reveal delay={0.1} variant="mask">
              <h1 className="mt-6 font-heading font-black uppercase tracking-tight text-6xl md:text-8xl text-white leading-[0.85]">
                Let's
                <br />
                <span className="text-cyan-accent text-glow">talk.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-zinc-400 text-lg leading-relaxed">
                Tell us about your project, your team or just say hello. We read every
                message and reply within one business day.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-12 space-y-5">
                <a
                  href="mailto:techteam@kedbyte.com"
                  className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
                  data-testid="contact-email-link"
                >
                  <Mail className="h-5 w-5 text-cyan-accent" /> techteam@kedbyte.com
                </a>
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin className="h-5 w-5 text-cyan-accent" /> Vadodara, Gujarat, India
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.2}>
            <form onSubmit={submit} className="space-y-6" data-testid="contact-form">
              <Field
                label="Your name *"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
                nonce={nonce}
                placeholder="Jane Doe"
                testid="contact-name-input"
                reduced={reduced}
              />
              <Field
                label="Email *"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                nonce={nonce}
                placeholder="jane@company.com"
                testid="contact-email-input"
                reduced={reduced}
              />
              <Field
                label="Company"
                value={form.company}
                onChange={update("company")}
                error={false}
                nonce={nonce}
                placeholder="Acme Inc."
                testid="contact-company-input"
                reduced={reduced}
              />
              <div className="relative pt-6">
                <label className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
                  Estimated budget
                </label>
                <select
                  className={selectCls}
                  value={form.budget}
                  onChange={update("budget")}
                  data-testid="contact-budget-select"
                >
                  <option value="" className="bg-surface">
                    Select a range
                  </option>
                  {budgets.map((b) => (
                    <option key={b} value={b} className="bg-surface">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Project details *"
                textarea
                value={form.message}
                onChange={update("message")}
                error={errors.message}
                nonce={nonce}
                placeholder="Tell us what you're building..."
                testid="contact-message-input"
                reduced={reduced}
              />

              {/* Submit: idle → SENDING... → cyan check + MESSAGE SENT → idle */}
              <motion.button
                type="submit"
                layout
                disabled={status !== "idle"}
                data-testid="contact-submit-button"
                className={`group inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium transition-colors duration-500 ${
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
                      transition={{ duration: 0.2 }}
                    >
                      Send message
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.span>
                  )}
                  {status === "sending" && (
                    <motion.span
                      key="sending"
                      className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs tracking-[0.25em]"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
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
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <Check className="h-4 w-4" /> MESSAGE SENT
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </Reveal>
        </div>

        {/* Page-intro hairline draws beneath the header */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="mt-16 h-px w-full origin-left bg-white/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          />
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
