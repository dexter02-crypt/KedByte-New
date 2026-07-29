// ============================================================
// SELECTED WORK — EDIT ME
// These three entries are honest capability demonstrations /
// internal builds, framed as exactly that. When real client
// case studies exist, replace entries here (the section renders
// whatever this file exports — no component changes needed).
// Each entry: kicker (honest framing), title, problem, engineered
// (what was actually built), stack chips, one metric, and the
// expanded-panel writeup paragraphs.
// ============================================================

export const work = [
  {
    id: "ops-platform",
    kicker: "Internal build — capability demonstration",
    title: "Multi-tenant operations platform",
    problem:
      "Prove out the studio's reference architecture for SaaS products: tenant isolation, role-based access and real-time dashboards without per-client rework.",
    engineered:
      "A React + FastAPI + MongoDB platform template with tenant-scoped data access, live metrics streaming and a component system built on the studio design language.",
    stack: ["React", "FastAPI", "MongoDB", "WebSockets", "Docker"],
    metric: { value: "99.9%", label: "uptime target it is engineered to" }, // EDIT ME: verify
    img: "/images/bento-software-800.webp",
    imgSet: "/images/bento-software-800.webp 800w, /images/bento-software-1600.webp 1600w",
    imgW: 1600,
    imgH: 900,
    writeup: [
      "Built as the studio's internal reference for multi-tenant SaaS work, this platform demonstrates the patterns we bring to client engagements: strict tenant data isolation at the query layer, role-based access control, and dashboards that stream live operational metrics instead of polling.",
      "The frontend is the same ultra-minimal design system this site runs on; the backend is FastAPI with async MongoDB access, containerised and wired into an automated deploy pipeline from day one.",
    ],
  },
  {
    id: "rag-assistant",
    kicker: "Internal build — applied AI",
    title: "Retrieval-augmented product assistant",
    problem:
      "Demonstrate production-grade LLM integration: grounded answers over private documents with low latency and controlled costs — not a thin API wrapper.",
    engineered:
      "A RAG pipeline with document ingestion, chunking and embedding, hybrid retrieval, and a streaming chat interface with source citations.",
    stack: ["Python", "LLM APIs", "Vector search", "FastAPI", "React"],
    metric: { value: "<2s", label: "first-token latency target" }, // EDIT ME: verify
    img: "/images/svc-aiml-800.webp",
    imgSet: "/images/svc-aiml-800.webp 800w, /images/svc-aiml-1600.webp 1600w",
    imgW: 1600,
    imgH: 1067,
    writeup: [
      "This build exercises the full applied-AI loop we offer clients: ingesting private documents, chunking and embedding them, and serving grounded answers with citations rather than hallucinated text.",
      "Retrieval is hybrid (semantic + keyword), responses stream token-by-token into the interface, and the pipeline is instrumented for cost and latency so the economics are visible before anything ships to production.",
    ],
  },
  {
    id: "delivery-pipeline",
    kicker: "Internal build — infrastructure",
    title: "Zero-touch delivery pipeline",
    problem:
      "Codify the studio's DevOps standard: every project should ship through an automated, monitored pipeline from the first commit — not after launch.",
    engineered:
      "A reusable CI/CD template with containerised builds, automated tests as a deploy gate, environment promotion, and uptime monitoring with alerting.",
    stack: ["GitHub Actions", "Docker", "Terraform", "Monitoring"],
    metric: { value: "24/7", label: "pipeline & uptime monitoring" },
    img: "/images/infra-800.webp",
    imgSet: "/images/infra-800.webp 800w, /images/infra-1600.webp 1600w",
    imgW: 1600,
    imgH: 1068,
    writeup: [
      "Every Kedbyte project inherits this pipeline: commits build in containers, tests gate the deploy, and promotion from staging to production is a reviewed, one-step action rather than a manual ritual.",
      "Monitoring and alerting are part of the template, not an afterthought — which is what lets us stand behind reliability targets on client work.",
    ],
  },
];
