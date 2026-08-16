import { describe, it, expect } from "vitest";
import { successResponse } from "@/lib/api-response";

describe("successResponse", () => {
  it("returns success envelope without meta when no pagination given", async () => {
    const res = successResponse([1, 2, 3]);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true, data: [1, 2, 3] });
  });

  it("includes pagination meta when provided", async () => {
    const res = successResponse(["x"], {
      page: 2,
      limit: 12,
      total: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
    });
    const body = await res.json();
    expect(body).toEqual({
      success: true,
      data: ["x"],
      meta: { current: 2, pages: 3, total: 25, hasNext: true, hasPrev: true },
    });
  });

  it("omits the meta key entirely when pagination is undefined", async () => {
    const res = successResponse(null);
    const body = await res.json();
    expect("meta" in body).toBe(false);
  });
});
