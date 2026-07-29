// ============================================================
// PROOF STRIP METRICS — VERIFY EACH NUMBER BEFORE PRODUCTION
// Only defensible, honest numbers belong here. Each entry
// feeds the animated Counter band on Home.
// ============================================================

export const metrics = [
  {
    to: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Deployment reliability",
    // VERIFY: this is the uptime target your pipelines are engineered to.
    // Replace with a measured figure once you have production history.
  },
  {
    to: 24,
    suffix: "/7",
    decimals: 0,
    label: "Pipeline monitoring",
    // Defensible if monitoring/alerting is actually always-on. Confirm.
  },
  {
    to: 24,
    prefix: "<",
    suffix: "h",
    decimals: 0,
    label: "Response time SLA",
    // VERIFY: the Contact page promises replies "within one business day" —
    // this mirrors that claim. Change if your real SLA differs.
  },
  {
    to: 2026,
    suffix: "",
    decimals: 0,
    label: "Founded in Gujarat",
    // Matches the incorporation date in the footer (08 May 2026).
  },
];
