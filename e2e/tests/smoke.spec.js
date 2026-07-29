const { test, expect } = require("@playwright/test");
const { collectConsoleErrors, gotoAndSettle } = require("../helpers");

test("home loads: h1 visible, zero console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await gotoAndSettle(page, "/");
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();
  await expect(h1).toContainText(/WE/i);
  expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);
});
