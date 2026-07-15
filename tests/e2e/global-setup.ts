import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

export default async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE}/login`);
  await page.waitForLoadState("networkidle");
  await page.fill('input[placeholder="admin@example.com"]', "amryousryy@gmail.com");
  await page.fill('input[placeholder="••••••••"]', "1937468250Aa@");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin**", { timeout: 20000 });

  await context.storageState({ path: "tests/e2e/auth-state.json" });
  await browser.close();
}
