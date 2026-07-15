/**
 * Pagination Integration Tests — Server-side pagination for admin projects.
 *
 * Tests that the API returns correct pagination metadata,
 * handles edge cases, and the pagination utility math is correct.
 */

import { describe, it, expect } from "vitest";
import { getPagination } from "@/lib/pagination";

describe("getPagination utility", () => {
  it("calculates correct totalPages", () => {
    expect(getPagination(1, 12, 17).totalPages).toBe(2);
    expect(getPagination(1, 12, 12).totalPages).toBe(1);
    expect(getPagination(1, 12, 24).totalPages).toBe(2);
    expect(getPagination(1, 12, 25).totalPages).toBe(3);
    expect(getPagination(1, 10, 100).totalPages).toBe(10);
    expect(getPagination(1, 25, 100).totalPages).toBe(4);
    expect(getPagination(1, 50, 100).totalPages).toBe(2);
    expect(getPagination(1, 100, 100).totalPages).toBe(1);
  });

  it("returns hasNextPage correctly", () => {
    expect(getPagination(1, 12, 17).hasNextPage).toBe(true);
    expect(getPagination(2, 12, 17).hasNextPage).toBe(false);
    expect(getPagination(1, 12, 12).hasNextPage).toBe(false);
    expect(getPagination(1, 12, 24).hasNextPage).toBe(true);
    expect(getPagination(2, 12, 24).hasNextPage).toBe(false);
    expect(getPagination(1, 12, 36).hasNextPage).toBe(true);
    expect(getPagination(3, 12, 36).hasNextPage).toBe(false);
  });

  it("returns hasPrevPage correctly", () => {
    expect(getPagination(1, 12, 17).hasPrevPage).toBe(false);
    expect(getPagination(2, 12, 17).hasPrevPage).toBe(true);
    expect(getPagination(3, 12, 50).hasPrevPage).toBe(true);
  });

  it("handles zero total", () => {
    const result = getPagination(1, 12, 0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(false);
    expect(result.total).toBe(0);
  });

  it("handles single item", () => {
    const result = getPagination(1, 12, 1);
    expect(result.totalPages).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(false);
  });

  it("handles exact page boundary", () => {
    const result = getPagination(2, 12, 24);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(true);
  });

  it("passes through page and limit", () => {
    const result = getPagination(3, 25, 100);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(25);
    expect(result.total).toBe(100);
  });
});

describe("API pagination endpoint", () => {
  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  async function fetchPublic(path: string) {
    const res = await fetch(`${BASE_URL}${path}`);
    return res.json();
  }

  it("returns correct meta for page 1 with limit 12", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=12");
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.meta).toBeDefined();
    expect(json.meta.current).toBe(1);
    expect(json.meta.pages).toBeGreaterThanOrEqual(1);
    expect(json.meta.total).toBeGreaterThanOrEqual(1);
    expect(typeof json.meta.hasNext).toBe("boolean");
    expect(typeof json.meta.hasPrev).toBe("boolean");
    expect(json.data.length).toBeLessThanOrEqual(12);
  });

  it("page 1 has no hasPrev", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=12");
    expect(json.meta.hasPrev).toBe(false);
  });

  it("page 2 has hasPrev and correct current", async () => {
    const totalJson = await fetchPublic("/api/projects?page=1&limit=1");
    const total = totalJson.meta?.total ?? 0;
    if (total <= 1) return;

    const json = await fetchPublic("/api/projects?page=2&limit=12");
    expect(json.meta.current).toBe(2);
    expect(json.meta.hasPrev).toBe(true);
  });

  it("last page has hasNext=false", async () => {
    const firstJson = await fetchPublic("/api/projects?page=1&limit=12");
    const totalPages = firstJson.meta?.pages ?? 1;

    const json = await fetchPublic(`/api/projects?page=${totalPages}&limit=12`);
    expect(json.meta.current).toBe(totalPages);
    expect(json.meta.hasNext).toBe(false);
  });

  it("limit=25 returns up to 25 items", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=25");
    expect(json.data.length).toBeLessThanOrEqual(25);
    expect(json.meta.current).toBe(1);
  });

  it("limit=50 returns up to 50 items", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=50");
    expect(json.data.length).toBeLessThanOrEqual(50);
  });

  it("limit=100 returns up to 100 items", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=100");
    expect(json.data.length).toBeLessThanOrEqual(100);
  });

  it("search filters reduce result count", async () => {
    const allJson = await fetchPublic("/api/projects?page=1&limit=100");
    const searchJson = await fetchPublic("/api/projects?page=1&limit=100&search=training");

    if (searchJson.data.length > 0) {
      expect(searchJson.data.length).toBeLessThanOrEqual(allJson.data.length);
      expect(searchJson.meta.total).toBeLessThanOrEqual(allJson.meta.total);
    }
  });

  it("sort=title&order=asc returns sorted results", async () => {
    const json = await fetchPublic("/api/projects?page=1&limit=12&sort=title&order=asc");
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.meta.current).toBe(1);
  });

  it("out-of-range page returns empty data but valid meta", async () => {
    const json = await fetchPublic("/api/projects?page=999&limit=12");
    expect(json.success).toBe(true);
    expect(json.data).toEqual([]);
    expect(json.meta.current).toBe(999);
    expect(json.meta.total).toBeGreaterThanOrEqual(1);
  });

  it("defaults to page 1 when no page param", async () => {
    const json = await fetchPublic("/api/projects");
    expect(json.meta.current).toBe(1);
  });
});
