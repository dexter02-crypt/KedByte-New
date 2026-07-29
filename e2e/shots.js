// Ad-hoc evidence capture: viewport screenshots down each route on a device.
// Usage: node shots.js [device] [outdir]
const { webkit, chromium, devices } = require("playwright");
const fs = require("fs");

(async () => {
  const deviceName = process.argv[2] || "iPhone 14 Pro";
  const outDir = process.argv[3] || "./shots";
  fs.mkdirSync(outDir, { recursive: true });
  const dev = devices[deviceName];
  const browser = await (dev.defaultBrowserType === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(dev);
  const page = await ctx.newPage();

  const routes = ["/", "/services", "/payroll", "/about", "/careers", "/contact"];
  for (const route of routes) {
    await page.goto(`http://localhost:3001${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#main-content", { state: "visible", timeout: 20000 });
    await page.waitForTimeout(2500);
    const name = route === "/" ? "home" : route.slice(1);
    const steps = await page.evaluate(() => Math.ceil(document.body.scrollHeight / (window.innerHeight * 0.85)));
    for (let i = 0; i < Math.min(steps, 12); i++) {
      await page.evaluate((i) => window.scrollTo({ top: i * window.innerHeight * 0.85, behavior: "auto" }), i);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${outDir}/${name}-${String(i).padStart(2, "0")}.png` });
    }
  }
  await browser.close();
  console.log("done:", outDir);
})();
