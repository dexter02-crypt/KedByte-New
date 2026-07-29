const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");
const { gotoAndSettle } = require("../helpers");

// Phase 8: axe-core scan across every route. serious/critical must be zero;
// moderate/minor are logged for the audit report but do not fail the build.
const ROUTES = ["/", "/services", "/payroll", "/about", "/careers", "/contact", "/definitely-missing"];

for (const path of ROUTES) {
  test(`axe scan: ${path}`, async ({ page }) => {
    await gotoAndSettle(page, path);
    // Mount below-fold content so axe sees the full page, then return to top
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "auto" });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      // Ghost watermark text (6% white, aria-hidden) — WCAG 1.4.3 "pure
      // decoration" exemption; axe cannot infer intent, so exclude it.
      .exclude('[data-decorative="true"]')
      .analyze();

    const byImpact = (impacts) =>
      results.violations.filter((v) => impacts.includes(v.impact));
    const blocking = byImpact(["critical", "serious"]);
    const advisory = byImpact(["moderate", "minor"]);

    for (const v of advisory) {
      console.log(
        `[axe:${path}] ${v.impact} ${v.id} (${v.nodes.length} nodes): ${v.help} — ${v.nodes[0]?.target}`
      );
    }
    const detail = blocking
      .map((v) => `${v.impact} ${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.target).join("\n  ")}`)
      .join("\n");
    expect(blocking, `serious/critical axe violations on ${path}:\n${detail}`).toEqual([]);
  });
}
