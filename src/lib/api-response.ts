import { NextResponse } from "next/server";
import type { PaginationResult } from "./pagination";

/**
 * Standard success envelope for list endpoints.
 * Optionally includes pagination meta derived from a PaginationResult.
 */
export function successResponse<T>(data: T, pagination?: PaginationResult) {
  return NextResponse.json({
    success: true,
    data,
    ...(pagination && {
      meta: {
        current: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
        hasNext: pagination.hasNextPage,
        hasPrev: pagination.hasPrevPage,
      }
    })
  });
}
