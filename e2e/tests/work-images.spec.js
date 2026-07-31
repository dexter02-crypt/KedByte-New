const { test, expect } = require("@playwright/test");
const { gotoAndSettle } = require("../helpers");

// Phase 10.1 regression spec: every Selected Work card image must be
// network-loaded AND painted (not hidden behind a stuck clip-path/opacity).
// Run against dev (default), a served prod build, or the live site:
//   TARGET_URL=http://localhost:3005 npx playwright test work-images
//   TARGET_URL=https://kedbyte.com   npx playwright test work-images
const BASE = process.env.TARGET_URL || "";

test("selected work card images load and are visible", async ({ page }) => {
  await gotoAndSettle(page, `${BASE}/`);

  const imgs = page.locator("[data-testid^='work-card'] img");
  await imgs.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // reveal animation + lazy decode settle

  const count = await imgs.count();
  expect(count).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const s = await img.evaluate((el) => {
      const wrap = el.closest("[class*='aspect-']") || el.parentElement;
      const wrapCs = getComputedStyle(wrap);
      const r = el.getBoundingClientRect();
      return {
        currentSrc: el.currentSrc,
        complete: el.complete,
        naturalWidth: el.naturalWidth,
        width: r.width,
        height: r.height,
        wrapOpacity: parseFloat(wrapCs.opacity),
        wrapClip: wrapCs.clipPath,
        wrapVisibility: wrapCs.visibility,
      };
    });
    const label = `card ${i} (${s.currentSrc}) → ${JSON.stringify(s)}`;
    expect(s.complete, label).toBe(true);
    expect(s.naturalWidth, label).toBeGreaterThan(0);
    expect(s.width, label).toBeGreaterThan(50);
    expect(s.height, label).toBeGreaterThan(50);
    expect(s.wrapVisibility, label).toBe("visible");
    // Phase 14.1: on desktop the journey's glass-card state INTENTIONALLY
    // fades the media layer to 0 while the chapter is live behind the card
    // (.chapter-live on the journey root). The still-image assertions apply
    // wherever the glass state is not active: touch (journey passthrough),
    // reduced motion, and desktop resting states.
    const glassLive = await img.evaluate(
      (el) => !!el.closest(".chapter-live")
    );
    if (glassLive) {
      expect(s.wrapOpacity, `${label} — glass state should hide media`).toBeLessThan(0.1);
    } else {
      expect(s.wrapOpacity, label).toBeGreaterThan(0.9);
      // A stuck reveal leaves inset(...100%...) — any large inset means hidden
      expect(s.wrapClip, label).not.toMatch(/100%|9\d(\.\d+)?%/);
    }
  }
});
