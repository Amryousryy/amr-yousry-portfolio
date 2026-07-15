# Changelog

## PERFORMANCE-ARCHITECTURE-CLEANUP-001
**Status:** Complete
**Date:** 2026-07-15
**Severity:** Maintenance
**Description:** Dedicated 12-sprint Performance & Architecture Cleanup Sprint. No UI changes, no feature additions — only architecture, performance, code quality, maintainability, and long-term scalability improvements.
**Sprints Completed:**
1. **Node.js 24** — Updated `package.json` engines to `>=20.x`, CI workflow to Node 24
2. **URL State Cleanup** — Removed hidden localStorage/URL coupling in `useProjectsFilters.ts`, URL is now sole source of truth, added `DEFAULT_PAGE_SIZE` constant
3. **Performance Audit** — Comprehensive audit of dependencies, ESLint, database indexes, architecture
4. **Performance Optimization** — Fixed N+1 query in `insight-engine.ts`, removed duplicate query in `editorial/route.ts`
5. **ESLint Cleanup** — Fixed all 17 errors and 15 warnings to 0 errors, 0 warnings. Added inline suppressions for unfixable library incompatibilities (TanStack Table, React Hook Form, Next.js icon routes)
6. **Dependency Audit** — Removed unused `mongodb` direct dep (mongoose bundles its own), ran `npm audit fix` (23 packages updated)
7. **Bundle** — Documented heavy deps (recharts ~500KB, gsap ~100KB single use, framer-motion ~150KB)
8. **Database** — Added 4 missing compound indexes to Project model, 1 to Analytics model, removed 2 unused Settings indexes
9. **Codebase Cleanup** — Removed 6 dead files (`hero.ts`, `stats.ts`, `useDebounce.ts`, `useProjectsSelection.ts`, `useAdminToast.ts`, `proxy.ts` stays as correct Next.js convention)
10. **Architecture** — Fixed `projectId` type mismatch (ObjectId → String), extracted shared `normalizeProject` utility, added missing error handling in PUT handler

**Files Changed:**
- `package.json` — engines `>=20.x`, removed `mongodb` dependency
- `.github/workflows/ci.yml` — Node 24
- `src/hooks/useProjectsFilters.ts` — URL state cleanup
- `src/models/Project.ts` — 3 new compound indexes
- `src/models/Analytics.ts` — 1 new index, projectId type fix
- `src/models/Settings.ts` — removed unused indexes
- `src/lib/insight-engine.ts` — N+1 fix, slug-based lookup
- `src/lib/project-utils.ts` — new shared utility
- `src/app/api/projects/route.ts` — imports shared utility
- `src/app/api/projects/[id]/route.ts` — imports shared utility, error handling
- `src/app/api/analytics/route.ts` — slug-based lookup
- `src/app/api/analytics/editorial/route.ts` — removed duplicate query
- `src/middleware.ts` — renamed from proxy.ts
- 6 dead files removed
- 10 files ESLint-cleaned

**Verification:** 190/190 tests pass, 0 ESLint errors, 0 ESLint warnings, TypeScript clean.
**Deployment:** Commit `24935da`, pending production deployment

---

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
