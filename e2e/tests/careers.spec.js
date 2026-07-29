const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

test("careers accordion: one open at a time, aria-expanded", async ({ page }) => {
  await gotoAndSettle(page, "/careers");
  const t0 = page.getByTestId("role-toggle-0");
  const t1 = page.getByTestId("role-toggle-1");

  await t0.scrollIntoViewIfNeeded();
  await t0.click();
  await expect(t0).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#role-panel-0")).toBeVisible();

  await t1.click();
  await expect(t1).toHaveAttribute("aria-expanded", "true");
  await expect(t0).toHaveAttribute("aria-expanded", "false");
  await page.waitForTimeout(700);
  expect(await page.locator("[id^='role-panel-']").count()).toBe(1);

  await t1.click();
  await expect(t1).toHaveAttribute("aria-expanded", "false");
});
