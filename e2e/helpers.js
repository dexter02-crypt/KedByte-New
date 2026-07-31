// Shared helpers: preloader settling, Lenis-aware scrolling, console capture,
// and Mongo access for assertions/cleanup.
const { MongoClient } = require("mongodb");

const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "kedbyte";

// Known-benign, intermittent WebKit + CRA dev-server noise (HMR blob race).
// Matched narrowly; anything else still fails the assertion.
const BENIGN = [/WebKitBlobResource error 1/];

/** Attach a console-error collector BEFORE navigation. */
function collectConsoleErrors(page) {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !BENIGN.some((re) => re.test(msg.text()))) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  return errors;
}

/**
 * Add the local-dev rate-limit bypass header ONLY to backend API calls
 * (a global extraHTTPHeaders leaks onto font CDNs and breaks CORS).
 * The rate-limit spec posts without this to prove the 429s.
 */
async function installApiBypass(page) {
  await page.route("**/api/**", (route) =>
    route.continue({
      headers: { ...route.request().headers(), "x-e2e-bypass": "kedbyte-e2e-local" },
    })
  );
}

/**
 * Navigate and wait out the one-time preloader + route settling.
 * The preloader unmounts when its exit completes; #main-content mounts at
 * the reveal. We wait for main to be visible and the preloader gone.
 */
async function gotoAndSettle(page, path = "/") {
  await installApiBypass(page);
  // Suppress the first-visit cinematic intro for all specs except the intro
  // suite itself (which navigates directly): the intro marks itself seen via
  // this sessionStorage key, so pre-setting it routes to the Preloader path.
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem("kb_intro_seen", "1");
    } catch {}
  });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#main-content", { state: "visible", timeout: 20_000 });
  await page
    .waitForSelector("[data-testid='site-preloader']", { state: "detached", timeout: 20_000 })
    .catch(() => {});
  // Let entrance choreography begin painting real content
  await page.waitForTimeout(600);
}

/** Scroll via Lenis when present (desktop); native fallback (touch/reduced). */
async function scrollTo(page, yOrSelector) {
  await page.evaluate(async (target) => {
    const el =
      typeof target === "string" ? document.querySelector(target) : null;
    const y =
      typeof target === "number"
        ? target
        : el
          ? el.getBoundingClientRect().top + window.scrollY - 96
          : 0;
    window.scrollTo({ top: y, behavior: "auto" });
  }, yOrSelector);
  await page.waitForTimeout(400);
}

async function mongoDb() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return { client, db: client.db(DB_NAME) };
}

module.exports = { collectConsoleErrors, gotoAndSettle, scrollTo, mongoDb, installApiBypass };
