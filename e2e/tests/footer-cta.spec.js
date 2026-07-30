const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

// Phase 12.1: footer service-list completeness + contextual CTA subline
// (no link may point at the page it sits on).

test("footer services column lists all six services in block order", async ({ page }) => {
  await gotoAndSettle(page, "/");
  const links = page.locator(
    "[data-testid='site-footer'] h2:has-text('Services') + ul a"
  );
  await expect(links).toHaveText([
    "Custom Software & Apps",
    "Frontend & Backend",
    "AI & Machine Learning",
    "Blockchain & Web3",
    "DevOps & Automation",
    "UI/UX Design",
  ]);
});

test("CTA subline is contextual: services link never self-links", async ({ page }) => {
  // On Home: subline links to /services and /contact
  await gotoAndSettle(page, "/");
  const cta = page.locator("[data-testid='cta-section']");
  await cta.scrollIntoViewIfNeeded();
  await expect(cta.locator("a[href='/services']")).toHaveText(/software development services/);
  await expect(cta.locator("a[href='/contact']")).toHaveText(/contact Kedbyte/);

  // On /services: services link is replaced by the payroll product
  await gotoAndSettle(page, "/services");
  await cta.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(cta.locator("a[href='/services']")).toHaveCount(0);
  const payrollLink = cta.locator("a[href='/payroll']");
  await expect(payrollLink).toHaveText(/Kedbyte Payroll/);

  // Click-test: the swapped link really navigates
  await payrollLink.click();
  await page.waitForTimeout(2200); // route curtain
  await expect(page.locator("h1").first()).toContainText(/Kedbyte/i);
  await expect(page).toHaveURL(/\/payroll$/);
});
