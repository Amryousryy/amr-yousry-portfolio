# Changelog

## ADMIN-PAGINATION-001
**Status:** Fixed  
**Date:** 2026-07-15  
**Severity:** Critical  
**Description:** Admin projects pagination buttons (First, Previous, Next, Last) were completely non-functional.  
**Root Cause:** `DataTable.tsx` combined client-side `getPaginationRowModel()` with internal `pagination` state, causing `getCanNextPage()` to always return `false` (computed `getPageCount()` = `Math.ceil(12/12)` = 1). The `useProjectsFilters` hook existed but was never wired into the page.  
**Fix:** Rewrote `DataTable.tsx` to use `manualPagination: true` with server-provided `pageCount`. Rewrote `page.tsx` to wire `useProjectsFilters()` for URL-based state. Added `PaginationFooter` component with ARIA labels, page size selector, and "Showing X-Y of Z" display.  
**Files Changed:**  
- `src/components/admin/DataTable.tsx` — removed internal pagination state, added `manualPagination: true`  
- `src/app/admin/projects/page.tsx` — wired URL-based pagination, prefetch, auto-recovery  
**Verification:** 10/10 E2E Playwright tests pass in real Chromium browser. 190 total tests passing.  
**Production Audit:** 15/15 cases pass against live production (https://amr-yousry-portfolio.vercel.app).  
**Deployment:** commit `d99309e`, production at https://amr-yousry-portfolio.vercel.app  
**Deployment ID:** `dpl_2nRZTwWMgv9GZhaAP4T3Hw3sZDv3`
