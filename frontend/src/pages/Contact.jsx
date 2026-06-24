import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowUpRight, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const budgets = ["< $10k", "$10k – $50k", "$50k – $150k", "$150k+", "Not sure yet"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/contact`, form);
      toast.success(data.message || "Message sent!");
      setForm({ name: "", email: "", company: "", budget: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-zinc-600 focus:border-cyan-accent focus:outline-none transition-colors";

  return (
    <div data-testid="contact-page">
      <section className="pt-40 pb-24 md:pt-52 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent">Contact</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-heading font-black uppercase tracking-tighter text-6xl md:text-8xl text-white leading-[0.85]">
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
                  href="mailto:hello@kedbyte.com"
                  className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
                  data-testid="contact-email-link"
                >
                  <Mail className="h-5 w-5 text-cyan-accent" /> hello@kedbyte.com
                </a>
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin className="h-5 w-5 text-cyan-accent" /> Bengaluru, India
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.2}>
            <form onSubmit={submit} className="space-y-8" data-testid="contact-form">
              <div>
                <label className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
                  Your name *
                </label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <label className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
                  Email *
                </label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={update("email")}
                  placeholder="jane@company.com"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <label className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
                  Company
                </label>
                <input
                  className={inputCls}
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Acme Inc."
                  data-testid="contact-company-input"
                />
              </div>
              <div>
                <label className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
                  Estimated budget
                </label>
                <select
                  className={`${inputCls} appearance-none cursor-pointer`}
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
              <div>
                <label className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
                  Project details *
                </label>
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none`}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us what you're building..."
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit-button"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-8 py-4 text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
