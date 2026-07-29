// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Kedbyte E2E harness.
 * Assumes the dev servers are already running:
 *   frontend http://localhost:3001  ·  backend http://localhost:8001
 *
 * Projects:
 *  - desktop-chrome  1512x982 (the user's actual screen)
 *  - iphone-14-pro   393x852 DPR3 touch (WebKit — real engine emulation)
 *  - iphone-se       375x667 (WebKit)          — smoke only
 *  - pixel-7         412x915 (Chromium, touch) — smoke + perf (CPU throttle)
 *
 * Full suite runs on desktop-chrome + iphone-14-pro per Phase 7 spec.
 * workers: 1 — tests share one dev server, one Mongo and per-IP rate limits.
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3001",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1512, height: 982 } },
    },
    {
      name: "iphone-14-pro",
      use: { ...devices["iPhone 14 Pro"] },
    },
    {
      name: "iphone-se",
      use: { ...devices["iPhone SE"] },
      testMatch: /smoke|mobile-audit/,
    },
    {
      name: "pixel-7",
      use: { ...devices["Pixel 7"] },
      testMatch: /smoke|mobile-audit|perf/,
    },
  ],
});
