const { test, expect } = require("@playwright/test");
const { installApiBypass } = require("../helpers");

// Cinematic intro: desktop-only, first visit to Home, once per session,
// skippable. These specs navigate WITHOUT the helpers' suppression flag.

test("desktop first visit: intro plays and Escape skips to the hero", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, "intro is desktop-only by design");
  test.skip(browserName !== "chromium", "autoplay policies differ; chromium covers the shipped desktop path");

  await installApiBypass(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const intro = page.getByTestId("intro-sequence");
  await expect(intro).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("intro-skip")).toBeVisible({ timeout: 5_000 });

  await page.keyboard.press("Escape");
  await expect(intro).toHaveCount(0, { timeout: 5_000 });
  await expect(page.getByTestId("home-hero")).toBeVisible({ timeout: 10_000 });

  const seen = await page.evaluate(() => sessionStorage.getItem("kb_intro_seen"));
  expect(seen).toBe("1");
});

test("intro plays only once per session", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, "intro is desktop-only by design");
  test.skip(browserName !== "chromium", "chromium covers the shipped desktop path");

  await installApiBypass(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("intro-sequence")).toBeVisible({ timeout: 10_000 });
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("home-hero")).toBeVisible({ timeout: 10_000 });

  await page.reload({ waitUntil: "domcontentloaded" });
  // Same session: the intro must not return; the standard preloader runs.
  await expect(page.getByTestId("intro-sequence")).toHaveCount(0);
  await expect(page.getByTestId("home-hero")).toBeVisible({ timeout: 20_000 });
});

test("touch profiles never see the intro", async ({ page, isMobile }) => {
  test.skip(!isMobile, "covers the touch path only");
  await installApiBypass(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("intro-sequence")).toHaveCount(0);
  await expect(page.getByTestId("home-hero")).toBeVisible({ timeout: 20_000 });
});
