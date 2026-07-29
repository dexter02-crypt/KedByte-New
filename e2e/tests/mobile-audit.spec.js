const { test, expect } = require("@playwright/test");
const { collectConsoleErrors, gotoAndSettle } = require("../helpers");

const ROUTES = [
  ["/", "home"],
  ["/services", "services"],
  ["/payroll", "payroll"],
  ["/about", "about"],
  ["/careers", "careers"],
  ["/contact", "contact"],
  ["/zz-missing", "404"],
];

test.describe("mobile layout audit", () => {
  for (const [path, name] of ROUTES) {
    test(`${name}: no overflow, h1 fits`, async ({ page }, testInfo) => {
      const errors = collectConsoleErrors(page);
      await gotoAndSettle(page, path);

      // Progressive scroll to trigger all whileInView reveals
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.7;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "auto" });
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo({ top: 0, behavior: "auto" });
      });
      await page.waitForTimeout(400);

      // 1. No horizontal document overflow
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        vw: window.innerWidth,
      }));
      expect(overflow.doc, `document scrollWidth ${overflow.doc} > viewport ${overflow.vw}`)
        .toBeLessThanOrEqual(overflow.vw + 1);

      // 2. Every display heading fits its box
      const h1s = await page.evaluate(() =>
        [...document.querySelectorAll("h1")].map((h) => ({
          text: h.textContent.slice(0, 30),
          scrollW: h.scrollWidth,
          clientW: h.clientWidth,
        }))
      );
      for (const h of h1s) {
        expect(h.scrollW, `h1 "${h.text}" overflows: ${h.scrollW} > ${h.clientW}`)
          .toBeLessThanOrEqual(h.clientW + 1);
      }

      expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);

      await testInfo.attach(`${name}-top`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });
  }
});
