const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

test("selected work: open scrolls case panel into view, close returns", async ({ page }) => {
  await gotoAndSettle(page, "/");
  const card = page.getByTestId("work-card-ops-platform");
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await card.click();
  await page.waitForTimeout(1600); // expand + lenis scroll settle

  const panel = page.locator("#work-case-panel");
  await expect(panel).toBeVisible();
  const top = await panel.evaluate((el) => el.getBoundingClientRect().top);
  expect(top, `panel top ${top} should sit just below the header`).toBeGreaterThanOrEqual(-10);
  expect(top).toBeLessThanOrEqual(130);

  await page.getByTestId("work-case-close").click();
  await page.waitForTimeout(1400);
  await expect(panel).not.toBeVisible();
  // Close-return: the card grid is back in (or very near) the viewport
  const gridTop = await card.evaluate((el) => el.getBoundingClientRect().top);
  const vh = await page.evaluate(() => window.innerHeight);
  expect(gridTop).toBeGreaterThan(-vh);
  expect(gridTop).toBeLessThan(vh);
});
