const { test, expect } = require("@playwright/test");
const { collectConsoleErrors, gotoAndSettle } = require("../helpers");

const ROUTES = [
  ["/", /WE/i, "Custom Software Development Company in India — Kedbyte"],
  ["/services", /END-TO-END/i, "Custom Software, AI & DevOps Automation Services — Kedbyte"],
  ["/payroll", /Kedbyte/i, "UK Payroll Software for Bureaux & Accountants — Kedbyte"],
  ["/about", /A STUDIO/i, "About Kedbyte — Software Studio in Vadodara, Gujarat"],
  ["/careers", /BUILD THE FUTURE/i, "Careers at Kedbyte — Engineering, Design & AI Roles"],
  ["/contact", /LET'S/i, "Contact Kedbyte — Start a Software Project"],
  ["/definitely-missing", /404/, "Kedbyte — Page not found"],
];

test("nav loop: every route has correct h1, title, zero console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  for (const [path, h1re, title] of ROUTES) {
    await gotoAndSettle(page, path);
    await expect(page.locator("h1").first()).toContainText(h1re);
    await expect(page).toHaveTitle(title);
  }
  expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);
});

test("SPA navigation scrolls back to top", async ({ page, isMobile }) => {
  await gotoAndSettle(page, "/");
  await page.evaluate(() => window.scrollTo({ top: 2500, behavior: "auto" }));
  await page.waitForTimeout(300);
  // The header hides on scroll-down; a small scroll-up reveals it (real UX)
  await page.evaluate(() => window.scrollTo({ top: 2350, behavior: "auto" }));
  await page.waitForTimeout(700);

  if (isMobile) {
    await page.getByTestId("mobile-menu-toggle").click();
    await page.getByTestId("mobile-nav-services").click();
  } else {
    await page.getByTestId("nav-services").click();
  }
  // Route curtain covers, scroll-to-top fires under it (~500ms), curtain lifts
  await page.waitForTimeout(2200);
  const y = await page.evaluate(() => window.scrollY);
  expect(y).toBeLessThan(50);
  await expect(page.locator("h1").first()).toContainText(/END-TO-END/i);
});
