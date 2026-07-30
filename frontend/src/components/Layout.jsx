import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { faq } from "@/data/faq";
import { payrollFaq } from "@/data/payrollFaq";

// CONFIRM: production domain (used for canonical + og:url + sitemap)
const SITE = "https://kedbyte.com";

// Titles ≤60 chars (primary keyword front, brand at end);
// descriptions ≤155 chars, keywords natural — no stuffing.
const META = {
  "/": {
    title: "Custom Software Development Company in India — Kedbyte",
    desc: "Kedbyte is a software studio in Vadodara, India building custom software, applied AI and automated cloud infrastructure — from interface to production.",
  },
  "/services": {
    title: "Custom Software, AI & DevOps Automation Services — Kedbyte",
    desc: "Custom software development, AI & machine learning, backend engineering, DevOps automation and UI/UX design — one connected pipeline, one partner.",
  },
  "/payroll": {
    title: "UK Payroll Software for Bureaux & Accountants — Kedbyte",
    desc: "In development for tax year 2026/27 — penny-exact UK payroll software for bureaux and accountants. HMRC PAYE recognition in progress. Join early access.",
  },
  "/about": {
    title: "About Kedbyte — Software Studio in Vadodara, Gujarat",
    desc: "Founded 2026 in Vadodara, Gujarat, Kedbyte Private Limited is a full-spectrum software studio pairing advanced engineering with ultra-minimal design.",
  },
  "/careers": {
    title: "Careers at Kedbyte — Engineering, Design & AI Roles",
    desc: "Remote-friendly engineering, design and AI roles at Kedbyte, Vadodara. Outcome-driven work with real ownership — build the future with us.",
  },
  "/contact": {
    title: "Contact Kedbyte — Start a Software Project",
    desc: "Tell us about your project — custom software, AI or automation. Kedbyte replies within one business day from Vadodara, India.",
  },
};

// ---- JSON-LD -------------------------------------------------------------
const ORG_REF = {
  "@type": "Organization",
  name: "Kedbyte Private Limited",
  url: SITE,
};

const breadcrumb = (name, path) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name, item: SITE + path },
  ],
});

const faqPage = (items) => ({
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});

const SERVICES = [
  "Custom Software & Application Development",
  "Frontend & Backend Engineering",
  "Artificial Intelligence & Machine Learning",
  "Infrastructure, Pipelines & Automation",
  "UI/UX Design",
];

// Per-route structured data. Answers/copy come verbatim from the data
// files, so the payroll claims policy holds by construction.
const JSONLD = {
  "/": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#business`,
      name: "Kedbyte Private Limited",
      url: SITE,
      email: "techteam@kedbyte.com",
      description: META["/"].desc,
      image: `${SITE}/og-image.png`,
      logo: `${SITE}/icon-512.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vadodara",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: 22.3072, longitude: 73.1812 },
    },
  ],
  "/services": [
    ...SERVICES.map((s) => ({
      "@type": "Service",
      serviceType: s,
      provider: ORG_REF,
      areaServed: "Worldwide",
      url: `${SITE}/services`,
    })),
    breadcrumb("Services", "/services"),
  ],
  "/payroll": [
    {
      "@type": "SoftwareApplication",
      name: "Kedbyte Payroll",
      url: `${SITE}/payroll`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      // Claims policy: in development; recognition only ever "in progress".
      description:
        "UK payroll software for bureaux and accountants, in development for tax year 2026/27. HMRC PAYE recognition in progress.",
      author: ORG_REF,
      offers: {
        "@type": "Offer",
        url: `${SITE}/payroll`,
        availability: "https://schema.org/PreOrder",
        description:
          "Free to join the early-access list; product pricing to be announced.",
      },
    },
    faqPage(payrollFaq),
    breadcrumb("Kedbyte Payroll", "/payroll"),
  ],
  "/about": [breadcrumb("About", "/about")],
  "/careers": [breadcrumb("Careers", "/careers")],
  "/contact": [faqPage(faq), breadcrumb("Contact", "/contact")],
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

  // Route-scoped JSON-LD (the static Organization block in index.html is
  // site-wide and stays untouched).
  const blocks = JSONLD[pathname];
  const existing = document.getElementById("route-jsonld");
  if (blocks) {
    const script = existing || document.createElement("script");
    script.type = "application/ld+json";
    script.id = "route-jsonld";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": blocks });
    if (!existing) document.head.appendChild(script);
  } else if (existing) {
    existing.remove();
  }
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
