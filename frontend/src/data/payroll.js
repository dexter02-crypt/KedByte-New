// ============================================================
// KEDBYTE PAYROLL — page content.
// CLAIMS POLICY: every entry states only what the product does
// TODAY (calculates / produces / generates — never files or
// submits), or is explicitly listed under `roadmap`. HMRC PAYE
// recognition is always an in-progress application, never an
// outcome. No certifications, customer counts or pricing.
// ============================================================

export const features = [
  {
    title: "Penny-exact calculation engine",
    desc: "PAYE for every UK regime — rUK, Scottish and Welsh — National Insurance across categories, student and postgraduate loans, and pension auto-enrolment. Integer-pence arithmetic throughout: no floating-point drift, ever.",
  },
  {
    // Rendered as the prominent highlight card with the Counter
    highlight: true,
    title: "Verified against HMRC's own test data",
    desc: "Every row of HMRC's published 2026-27 payroll test data passes exactly. Not approximately — exactly.",
    stat: { to: 1129, label: "assertions passing across PAYE, NI and student loans" },
  },
  {
    title: "RTI-ready",
    desc: "Generates Full Payment Submissions and Employer Payment Summaries conforming to HMRC's published 2026-27 schemas, including Employment Allowance claims with built-in eligibility checks.",
  },
  {
    title: "Employment Allowance, handled properly",
    desc: "Eligibility gates for sole-director companies, connected companies and public-sector bodies; a claim-and-withdraw flow; and a P32 that always matches the claim state.",
  },
  {
    title: "Tamper-evident audit trail",
    desc: "Every action is recorded in a SHA-256 hash-chained audit log, and every statutory figure carries its source document and verification date.",
  },
  {
    title: "The outputs a bureau actually needs",
    desc: "Payslips, P32, BACS payment files, NEST and PAPDIS pension files, and CSV exports.",
  },
  {
    title: "Pay run lifecycle with input freezing",
    desc: "Committed runs are immutable and reproducible — the numbers you signed off are the numbers that stay.",
  },
];

export const compliance = {
  intro:
    "Every statutory figure in the engine is verified against HMRC's primary specifications — and carries its source and verification date in the audit trail.",
  sources: [
    "HMRC PAYE tax table routines",
    "HMRC National Insurance guidance for software developers",
    "HMRC RTI RIM artefacts (2026-27)",
  ],
  builder: "Built by Kedbyte Technologies Pvt Ltd.",
  status: "HMRC PAYE recognition: application in progress.",
};

export const roadmap = [
  {
    title: "Statutory payments",
    desc: "SMP, SPP, SAP, ShPP, SPBP and SNCP under the April 2026 rules.",
  },
  {
    title: "Director National Insurance",
    desc: "Annual and alternative methods, pro-rated appointments.",
  },
  {
    title: "Live HMRC submission",
    desc: "Direct RTI filing — switched on upon completion of HMRC recognition.",
  },
];
