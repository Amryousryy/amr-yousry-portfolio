import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test.describe("Pagination E2E", () => {
  test("CASE 1: Next button changes page, data, and range", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    const firstTitle1 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);

    expect(page.url()).toContain("page=2");
    const firstTitle2 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();
    expect(firstTitle2).not.toBe(firstTitle1);

    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("13");
  });

  test("CASE 2: Previous button returns to Page 1", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    const title2 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();

    await page.click('button[aria-label="Previous page"]');
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain("page=2");
    const title1 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();
    expect(title1).not.toBe(title2);

    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("1–");
  });

  test("CASE 3: Last button navigates to final page", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Last page"]');
    await page.waitForTimeout(2000);

    const nextDisabled = await page.locator('button[aria-label="Next page"]').isDisabled();
    const lastDisabled = await page.locator('button[aria-label="Last page"]').isDisabled();
    expect(nextDisabled).toBe(true);
    expect(lastDisabled).toBe(true);

    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("30");
  });

  test("CASE 4: First button returns to first page", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Last page"]');
    await page.waitForTimeout(2000);

    await page.click('button[aria-label="First page"]');
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain("page=2");
    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("1–");
  });

  test("CASE 5: Page size changes update row count and range", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    for (const size of [10, 25, 50]) {
      await page.selectOption('select[aria-label="Projects per page"]', String(size));
      await page.waitForTimeout(2000);

      const rowCount = await page.locator("tbody tr").count();
      expect(rowCount).toBeGreaterThan(0);
      expect(rowCount).toBeLessThanOrEqual(size);

      const range = await page.locator("text=Showing").textContent();
      expect(range).toContain("1–");
    }
  });

  test("CASE 6: Browser refresh persists current page", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("page=2");

    const titleBefore = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    expect(page.url()).toContain("page=2");
    const titleAfter = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();
    expect(titleAfter).toBe(titleBefore);
  });

  test("CASE 7: Deep link loads correct page and data", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects?page=2&limit=25`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    expect(page.url()).toContain("page=2");
    expect(page.url()).toContain("limit=25");
    const rowCount = await page.locator("tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(25);

    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("26");
  });

  test("CASE 8: Browser Back/Forward follows history", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    const title2 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    const title3 = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();

    await page.goBack();
    await page.waitForTimeout(2000);
    const backTitle = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();
    expect(backTitle).toBe(title2);

    await page.goForward();
    await page.waitForTimeout(2000);
    const fwdTitle = await page.locator("tbody tr:first-child td:nth-child(2)").textContent();
    expect(fwdTitle).toBe(title3);
  });

  test("CASE 9: Search on page 3 resets to page 1", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(1000);
    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("page=3");

    await page.fill('input[placeholder="Search projects..."]', "training");
    await page.waitForTimeout(1500);

    expect(page.url()).not.toContain("page=3");
    expect(page.url()).toContain("search=training");
    const rowCount = await page.locator("tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("CASE 10: Filter change on page 2 resets to page 1", async ({ page }) => {
    await page.goto(`${BASE}/admin/projects`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("table tbody tr", { timeout: 15000 });

    await page.click('button[aria-label="Next page"]');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("page=2");

    await page.selectOption('select[aria-label="Projects per page"]', "25");
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain("page=2");
    const range = await page.locator("text=Showing").textContent();
    expect(range).toContain("1–");
  });
});
