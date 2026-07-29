const { test, expect } = require("@playwright/test");
const { gotoAndSettle, mongoDb } = require("../helpers");

test.afterAll(async () => {
  const { client, db } = await mongoDb();
  await db.collection("contacts").deleteMany({ email: /e2e-panel-.*@test\.dev/ });
  await client.close();
});

test("CTA panel: opens from Home, focus managed, closes", async ({ page, isMobile }) => {
  await gotoAndSettle(page, "/");
  await page.getByTestId("home-hero-cta").click();

  const dialog = page.locator("[role='dialog']");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  // Focus lands in the first field; background is inert
  await page.waitForTimeout(600);
  const focused = await page.evaluate(() => document.activeElement?.dataset?.testid);
  expect(focused).toBe("cta-panel-name");
  expect(await page.evaluate(() => document.getElementById("root").hasAttribute("inert"))).toBe(true);

  if (isMobile) {
    await page.getByTestId("cta-panel-close").click();
  } else {
    await page.keyboard.press("Escape");
  }
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.getElementById("root").hasAttribute("inert"))).toBe(false);
});

test("payroll variant tags the lead with source", async ({ page }) => {
  const email = `e2e-panel-${Date.now()}@test.dev`;
  await gotoAndSettle(page, "/payroll");
  await page.getByTestId("payroll-hero-cta").click();

  const dialog = page.locator("[role='dialog']");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/early-access list/i);

  await page.getByTestId("cta-panel-name").fill("E2E Payroll Lead");
  await page.getByTestId("cta-panel-email").fill(email);
  await page.getByTestId("cta-panel-message").fill("E2E bureau");
  await page.getByTestId("cta-panel-submit").click();
  await expect(page.getByTestId("cta-panel-submit")).toContainText(/MESSAGE SENT/i, {
    timeout: 10_000,
  });

  const { client, db } = await mongoDb();
  const doc = await db.collection("contacts").findOne({ email });
  await client.close();
  expect(doc).toBeTruthy();
  expect(doc.source).toBe("payroll-early-access");
});
