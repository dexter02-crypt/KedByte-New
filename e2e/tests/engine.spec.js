const { test, expect } = require("@playwright/test");
const { gotoAndSettle, scrollTo } = require("../helpers");

// Scrub engine selection: video (all-keyframe MP4 via currentTime) is the
// measured default on Chromium/Safari desktops; the frame-canvas pipeline
// remains behind ?engine=frames and as the Firefox/save-data default.

test("desktop chromium defaults to the video scrub engine", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, "journey inactive on touch");
  test.skip(browserName !== "chromium", "engine default asserted on chromium");

  await gotoAndSettle(page, "/");
  const video = page.locator("[data-testid='journey-ch03'] video");
  await expect(video).toHaveAttribute("src", /ch03-scrub\.mp4/);
  await scrollTo(page, "[data-testid='journey-ch03']");
  await page.waitForTimeout(800);
  // Scrubbing must actually seek the element as scroll moves
  const t1 = await video.evaluate((v) => v.currentTime);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(600);
  const t2 = await video.evaluate((v) => v.currentTime);
  expect(t2).not.toBe(t1);
});

test("?engine=frames renders the canvas fallback", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, "journey inactive on touch");
  test.skip(browserName !== "chromium", "fallback asserted on chromium");

  await gotoAndSettle(page, "/?engine=frames");
  await expect(page.locator("[data-testid='journey-ch03'] canvas")).toHaveCount(1);
  await expect(page.locator("[data-testid='journey-ch03'] video")).toHaveCount(0);
});
