const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

// Part D: 4x CPU throttle on the Pixel profile, full Home scroll,
// measure frame times. Chromium-only (CDP).
test("home scroll under 4x CPU throttle has acceptable frame times", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP throttling is Chromium-only");

  await gotoAndSettle(page, "/");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const stats = await page.evaluate(async () => {
    const deltas = [];
    let last = performance.now();
    let raf;
    const tick = (t) => {
      deltas.push(t - last);
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const step = window.innerHeight * 0.5;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "auto" });
      await new Promise((r) => setTimeout(r, 150));
    }
    cancelAnimationFrame(raf);
    const long = deltas.filter((d) => d > 50).length;
    return {
      frames: deltas.length,
      longFrames: long,
      pctLong: +((100 * long) / deltas.length).toFixed(1),
      worst: +Math.max(...deltas).toFixed(0),
    };
  });

  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  console.log("perf@4x:", JSON.stringify(stats));
  expect(stats.pctLong, `long-frame % too high: ${JSON.stringify(stats)}`).toBeLessThan(20);
});
