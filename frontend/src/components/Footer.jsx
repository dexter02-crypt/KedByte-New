import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/services", label: "Custom Software & Apps" },
      { to: "/services", label: "Frontend & Backend" },
      { to: "/services", label: "AI & Machine Learning" },
      { to: "/services", label: "DevOps & Automation" },
      { to: "/services", label: "UI/UX Design" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <span className="font-heading font-black text-3xl tracking-tighter text-white">
              KED<span className="text-cyan-accent">BYTE</span>
            </span>
            <p className="mt-5 text-zinc-400 max-w-sm leading-relaxed">
              An ultra-minimal, futuristic software studio — building intelligent,
              high-performance digital products from interface to infrastructure.
            </p>
            <a
              href="mailto:techteam@kedbyte.com"
              className="mt-6 inline-flex items-center gap-1.5 text-white hover:text-cyan-accent transition-colors"
              data-testid="footer-email"
            >
              techteam@kedbyte.com <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mb-5">
                {c.title}
              </h4>
              <ul className="space-y-3">
                {c.links.map((l, i) => (
                  <li key={i}>
                    <Link
                      to={l.to}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mb-5">
              Registered
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Kedbyte Private Limited
              <br />
              Vadodara, Gujarat, India
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-zinc-500 font-mono">
          <span>© {new Date().getFullYear()} Kedbyte Private Limited. All rights reserved.</span>
          <span>Incorporated 08 May 2026 · Vadodara, Gujarat.</span>
        </div>
      </div>
    </footer>
  );
}
