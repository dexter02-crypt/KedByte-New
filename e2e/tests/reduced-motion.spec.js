const { test, expect } = require("@playwright/test");
const { collectConsoleErrors, gotoAndSettle } = require("../helpers");

test.use({ contextOptions: { reducedMotion: "reduce" } });

const ROUTES = ["/", "/services", "/payroll", "/about", "/careers", "/contact"];

test("reduced motion: all routes render with zero console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  for (const path of ROUTES) {
    await gotoAndSettle(page, path);
    await expect(page.locator("h1").first()).toBeVisible();
  }
  expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);
});
