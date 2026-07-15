"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export interface ProjectsFilters {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  status: string;
  category: string;
}

const VALID_PAGE_SIZES = [10, 25, 50, 100];
const VALID_SORT_FIELDS = ["createdAt", "updatedAt", "title", "status", "category", "clientName", "year"];
const VALID_STATUSES = ["", "draft", "published"];
const VALID_CATEGORIES = ["", "branding", "web", "mobile", "ui-ux", "motion", "other"];
const VALID_ORDERS = ["asc", "desc"];
const STORAGE_KEY_PAGE_SIZE = "admin-projects-page-size";

function getStoredPageSize(): number {
  if (typeof window === "undefined") return 12;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PAGE_SIZE);
    if (stored) {
      const parsed = Number(stored);
      if (VALID_PAGE_SIZES.includes(parsed)) return parsed;
    }
  } catch {}
  return 12;
}

function parseSearchParams(searchParams: URLSearchParams): ProjectsFilters {
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawLimit = Number(searchParams.get("limit"));
  const limit = Number.isFinite(rawLimit) && VALID_PAGE_SIZES.includes(rawLimit) ? rawLimit : getStoredPageSize();

  const search = searchParams.get("search") ?? "";

  const sort = searchParams.get("sort") ?? "createdAt";
  const rawOrder = searchParams.get("order");
  const order: "asc" | "desc" = VALID_ORDERS.includes(rawOrder ?? "") ? (rawOrder as "asc" | "desc") : "desc";

  const status = searchParams.get("status") ?? "";
  const category = searchParams.get("category") ?? "";

  return { page, limit, search, sort, order, status, category };
}

export function useProjectsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<ProjectsFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (key === "page" && value === 1) {
          params.delete(key);
        } else if (key === "limit" && value === getStoredPageSize()) {
          params.delete(key);
        } else if (key === "sort" && value === "createdAt") {
          params.delete(key);
        } else if (key === "order" && value === "desc") {
          params.delete(key);
        } else if (key === "status" && value === "") {
          params.delete(key);
        } else if (key === "category" && value === "") {
          params.delete(key);
        } else if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      }
      const url = `?${params.toString()}`;
      router.push(url, { scroll: false });
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  return {
    filters,
    updateFilters,
    resetFilters,
    isValidSort: VALID_SORT_FIELDS.includes(filters.sort),
  };
}

export { VALID_PAGE_SIZES, VALID_SORT_FIELDS, VALID_STATUSES, VALID_CATEGORIES, VALID_ORDERS, STORAGE_KEY_PAGE_SIZE, getStoredPageSize };
