const { test, expect } = require("@playwright/test");
const { gotoAndSettle, mongoDb } = require("../helpers");

const EMAIL = `e2e-contact-${Date.now()}@test.dev`;

test.afterAll(async () => {
  const { client, db } = await mongoDb();
  await db.collection("contacts").deleteMany({ email: /e2e-contact-.*@test\.dev/ });
  await client.close();
});

test("contact form: validation failure then real success", async ({ page }) => {
  await gotoAndSettle(page, "/contact");

  // Empty submit → validation toast, no success state
  await page.getByTestId("contact-submit-button").click();
  await expect(page.getByText(/fill in your name, email and message/i)).toBeVisible();

  await page.getByTestId("contact-name-input").fill("E2E Contact");
  await page.getByTestId("contact-email-input").fill(EMAIL);
  await page.getByTestId("contact-message-input").fill("End-to-end contact form test.");
  await page.getByTestId("contact-submit-button").click();
  await expect(page.getByTestId("contact-submit-button")).toContainText(/MESSAGE SENT/i, {
    timeout: 10_000,
  });

  // Stored in Mongo as a bare contact (source: "")
  const { client, db } = await mongoDb();
  const doc = await db.collection("contacts").findOne({ email: EMAIL });
  await client.close();
  expect(doc).toBeTruthy();
  expect(doc.source ?? "").toBe("");
});
