const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

// Claims-policy tripwire: these phrases must never appear as page text.
const FORBIDDEN = /HMRC-recognised|HMRC recognised|HMRC approved|HMRC-approved|file directly/i;

test("payroll page never claims recognition or filing", async ({ page }) => {
  await gotoAndSettle(page, "/payroll");
  // Full progressive scroll so all content mounts
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "auto" });
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  const text = await page.evaluate(() => document.body.innerText);
  expect(text).not.toMatch(FORBIDDEN);
  // The honest phrasing must be present
  expect(text).toMatch(/recognition in progress/i);
});
