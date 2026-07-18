# ENGINEERING INTELLIGENCE SYSTEM

## Amr Yousry Creatives Portfolio — Permanent Software System Bible

**Version:** 2.0 — Engineering Knowledge Operating System
**Repository:** `https://github.com/Amryousryy/amr-yousry-portfolio`
**Production:** `https://amr-yousry-portfolio.vercel.app`
**Generated:** July 2026

---

> This is not documentation. This is the permanent engineering brain of the repository.
> It is designed to be read by Staff Engineers, Principal Engineers, and the CTO.
> Every claim is backed by exact file paths and line numbers.
> If any line number drifts, the code has changed and this document must be updated.

---

# VOLUME I — SYSTEM TOPOLOGY AND IMPACT ANALYSIS

## PART XIII — SYSTEM KNOWLEDGE GRAPH

### 1.1 Dependency Graph — Complete Bidirectional Map

Every node in this repository is classified as either a **Hub** (many things depend on it), a **Leaf** (nothing depends on it), or a **Bridge** (connects two subsystems).

#### Tier 0 — Critical Infrastructure (Change these and everything breaks)

```
┌──────────────────────────────────────────────────────────────┐
│  src/lib/db.ts                    [15 dependents]            │
│  MongoDB connection singleton. The foundation of all data.   │
│  Imports: mongoose, dns (dev-only SRV workaround)           │
│  Imported by: ALL API routes, ALL content loaders            │
│                                                              │
│  src/lib/auth.ts                  [12 dependents]            │
│  NextAuth configuration + credential verification.           │
│  Imports: crypto, next-auth, next-auth/providers/credentials │
│  Imported by: ALL protected API routes, admin layout         │
│                                                              │
│  src/lib/validation/index.ts      [12 dependents]            │
│  Barrel re-export of ALL validation schemas.                 │
│  Imports: project.ts, settings.ts, hero-settings.ts, shared │
│  Imported by: ALL admin form components, ALL write API routes│
└──────────────────────────────────────────────────────────────┘
```

**Risk if changed:** Cascade failure across entire application.
**Safe modification strategy:** Never change the export shape. Add new exports only. If modifying a schema, run the full 190-test suite before commit.

#### Tier 1 — High-Coupling Modules

```
┌──────────────────────────────────────────────────────────────┐
│  src/components/ui/container.tsx   [10 dependents]           │
│  src/components/ui/section.tsx     [ 9 dependents]           │
│  src/lib/api-client.ts             [ 7 dependents]           │
│  src/lib/utils.ts                  [ 6 dependents]           │
│  src/lib/tracker.ts                [ 6 dependents]           │
│  src/lib/media/config.ts           [ 6 dependents]           │
│  src/models/Project.ts             [ 6 dependents]           │
│  src/models/Settings.ts            [ 5 dependents]           │
│  src/lib/validation/project-readiness.ts [5 dependents]      │
│  src/lib/contact-content-normalizer.ts   [5 dependents]      │
└──────────────────────────────────────────────────────────────┘
```

**Risk if changed:** 3-10 files affected directly, plus cascading indirect effects.
**Safe modification strategy:** Test the specific dependent pages. Run `npm run build` to catch import breakage.

#### Tier 2 — Medium-Coupling Modules

```
┌──────────────────────────────────────────────────────────────┐
│  src/lib/activity.ts               [ 4 dependents]           │
│  src/lib/analytics-types.ts        [ 4 dependents]           │
│  src/lib/projects/categories.ts    [ 4 dependents]           │
│  src/lib/projects/public-projects.ts [4 dependents]          │
│  src/models/Analytics.ts           [ 4 dependents]           │
│  src/lib/about-content-normalizer.ts [3 dependents]          │
│  src/lib/hooks/index.ts            [ 3 dependents]           │
│  src/content/about.ts              [ 3 dependents]           │
│  src/content/contact.ts            [ 3 dependents]           │
│  src/types/index.ts                [ 6 dependents]           │
└──────────────────────────────────────────────────────────────┘
```

**Risk if changed:** 2-5 files affected. Usually isolated to one subsystem.

#### Tier 3 — Low-Coupling / Leaf Nodes

```
┌──────────────────────────────────────────────────────────────┐
│  src/lib/auth-rate-limit.ts        [ 1 dependent ]           │
│  src/lib/safe-project-title.ts     [ 1 dependent ]           │
│  src/lib/cloudinary.ts             [ 1 dependent ]           │
│  src/lib/hero-content-normalizer.ts [1 dependent]            │
│  src/lib/pagination.ts             [ 2 dependents]           │
│  src/lib/text.ts                   [ 3 dependents]           │
│  src/lib/project-utils.ts          [ 2 dependents]           │
│  src/lib/logo-data-uri.ts          [ 2 dependents]           │
│  src/components/ui/pixel-button.tsx [0 dependents — UNUSED]  │
│  src/components/ui/dropdown-menu.tsx [0 dependents — UNUSED] │
│  src/components/ui/FilmStripSection.tsx [0 — UNUSED]         │
│  src/types/project-static.ts       [ 2 dependents]           │
│  src/types/constants.ts            [ 1 dependent ]           │
│  src/data/showreel.ts              [ 1 dependent ]           │
│  src/data/brands.ts                [ 1 dependent ]           │
│  src/data/social-links.ts          [ 3+ dependents]          │
└──────────────────────────────────────────────────────────────┘
```

**Risk if changed:** Minimal. Usually 1-2 files affected.
**Dead code detected:** `pixel-button.tsx`, `dropdown-menu.tsx`, `FilmStripSection.tsx` are imported nowhere. Candidates for removal.

---

### 1.2 Critical Dependency Chains

These are the data flow pipelines that define how the application works. Breaking any chain breaks an entire feature.

#### Chain 1: Public Page Data Pipeline (Most Critical)

```
process.env.MONGODB_URI
    |
src/lib/db.ts                          [connection singleton]
    |
src/lib/public-homepage-content.ts     [fetches Settings from DB]
    |
src/lib/hero-content-normalizer.ts     [normalizes bilingual hero data]
src/lib/about-content-normalizer.ts    [normalizes bilingual about data]
    |
src/app/(marketing)/page.tsx           [renders home page]
    |
src/components/sections/hero/index.tsx [hero section]
src/components/sections/about/index.tsx [about section]
src/components/sections/contact/index.tsx [contact section]
src/components/sections/projects/index.tsx [projects section]
```

**Failure mode:** If `db.ts` connection fails, homepage falls back to static `DEFAULT_CONTENT`. Silent degradation. No user-visible error, but stale content.

#### Chain 2: Admin Data Pipeline

```
src/proxy.ts (middleware)              [JWT verification]
    |
src/app/admin/layout.tsx              [server-side session check]
    |
src/lib/auth.ts                        [getServerSession]
    |
src/app/api/projects/route.ts         [GET/POST handlers]
    |
src/lib/api-client.ts (ProjectService) [client-side fetch wrapper]
    |
src/app/admin/projects/page.tsx       [project list]
    |
src/components/admin/DataTable.tsx    [TanStack Table rendering]
```

**Failure mode:** Auth middleware blocks, redirects to `/login`. API returns 401, React Query shows error state. DB down, returns empty array with 200 (silent failure).

#### Chain 3: Validation Pipeline

```
src/lib/validation/shared.ts           [base schemas: stringSchema, safeUrlSchema]
    |
src/lib/validation/project.ts          [projectCreateSchema, projectUpdateSchema]
src/lib/validation/settings.ts         [contentCreateSchema, socialLinksFormSchema]
src/lib/validation/hero-settings.ts    [heroCreateSchema]
    |
src/lib/validation/index.ts            [barrel re-export]
    |
[12 consumers: 8 admin form components + 4 API routes]
    |
API routes apply schemas at request boundary
Admin forms apply schemas via standardSchemaResolver (Zod 4)
```

**Failure mode:** Schema change breaks form submission OR API validation. The Zod 4 migration already caused one such break (save-bug regression, tested in `tests/regression/save-bug.test.ts`).

#### Chain 4: Analytics Pipeline

```
Client: src/lib/tracker.ts             [event collection]
    |
src/app/api/analytics/events/route.ts  [NO AUTH - accepts any POST]
    |
src/models/Analytics.ts                [9 indexes, unbounded growth]
    |
src/app/api/analytics/summary/route.ts [14 parallel DB queries]
src/app/api/analytics/insights/route.ts [insight-engine.ts]
    |
src/app/admin/analytics/page.tsx       [dashboard rendering]
```

**Failure mode:** High-traffic spike causes Analytics writes to go unbounded, summary endpoint times out (14 parallel queries). No TTL on Analytics documents means infinite DB growth.

#### Chain 5: Media Pipeline

```
src/components/admin/MediaUploader.tsx  [Cloudinary widget or URL input]
    |
src/components/admin/MediaFields.tsx    [420 lines, 14 props]
    |
src/lib/media/config.ts                 [CLOUDINARY_URL(), CLOUDINARY_UPLOAD_URL()]
    |
src/app/api/projects/[id]/route.ts     [type detection, readiness check]
    |
src/models/Project.ts                   [CaseStudyMedia schema]
    |
src/components/projects/ProjectMediaGallery.tsx [426 lines, video fallback chain]
    |
Public visitor sees media
```

**Failure mode:** Cloudinary outage triggers video fallback chain with 20s timeouts per source. Image failures render `MediaErrorFallback` component.

---

### 1.3 Coupling Analysis

| Module | Coupling Score | Risk | Safe to Refactor? |
|--------|---------------|------|-------------------|
| `src/lib/db.ts` | **Critical** | CRITICAL | No - needs full regression |
| `src/lib/auth.ts` | **Critical** | CRITICAL | No - auth gate for everything |
| `src/lib/validation/index.ts` | **Critical** | CRITICAL | No - 12 direct dependents |
| `src/models/Project.ts` | **High** | HIGH | Carefully - 6 dependents, schema changes ripple |
| `src/lib/api-client.ts` | **High** | HIGH | Yes - but test all admin pages |
| `src/components/admin/ProjectEditor.tsx` | **High** | HIGH | Yes - but 7 sub-components depend on its state |
| `src/components/admin/MediaFields.tsx` | **High** | MEDIUM | Yes - 14 props = needs decomposition |
| `src/lib/tracker.ts` | **Medium** | MEDIUM | Yes - 6 dependents, all simple imports |
| `src/components/projects/ProjectMediaGallery.tsx` | **Medium** | MEDIUM | Yes - self-contained, no dependents import it |
| `src/lib/hooks/useUnsavedChanges.ts` | **Low** | LOW | Yes - only 3 consumers via barrel |

### 1.4 Future Extraction Opportunities

| Current Location | Extraction Target | Reason |
|-----------------|-------------------|--------|
| `src/lib/validation/project-readiness.ts` (194 lines) | Separate `readiness/` module | Complex enough to warrant own package |
| `src/components/admin/MediaFields.tsx` (420 lines) | `MediaSection` compound component | 14 props = prop drilling anti-pattern |
| `src/components/admin/ProjectEditor.tsx` (237 lines) | `useProjectForm` custom hook | State management logic separated from UI |
| `src/app/api/analytics/summary/route.ts` (260 lines) | `analytics/` service module | 14 parallel queries belong in a service layer |
| `src/lib/public-homepage-content.ts` + `public-contact-content.ts` | `content/` service module | Content fetching logic duplicated across files |
| `src/lib/tracker.ts` + `src/lib/analytics-types.ts` | `@portfolio/analytics` package | Client-side analytics is a self-contained domain |

---

## PART XIV — ENGINEERING IMPACT MAP

### 2.1 Impact Analysis for Every Major File

#### `src/lib/db.ts` — MongoDB Connection Singleton

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | ALL API routes fail. ALL content loading fails. Homepage shows static fallback. |
| **What silently breaks?** | Dev-mode DNS SRV resolution (line 28-50) may stop working without error. Connection pool settings affect all queries. |
| **Tests that fail?** | All integration tests (`tests/integration/`), all E2E tests |
| **Pages affected?** | Every page (public and admin) |
| **APIs affected?** | Every API route (15 direct dependents) |
| **Deployment risks?** | Wrong `MONGODB_URI` = complete outage |
| **Rollback risks?** | Low - connection logic rarely changes |
| **Recovery strategy?** | Fix env var, redeploy. If schema changed, rollback to previous version. |

#### `src/lib/auth.ts` — Authentication Configuration

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Login fails. All admin API routes return 401. Admin pages show empty state. |
| **What silently breaks?** | Timing-safe comparison (line 63) could be weakened. Rate limiter (line 22-24) could be disabled. `ADMIN_PASSWORD` comparison could become case-sensitive or loose. |
| **Tests that fail?** | Regression test for save-bug (uses auth), integration CRUD tests |
| **Pages affected?** | `/admin/*` (entire admin dashboard) |
| **APIs affected?** | 12 routes that call `getServerSession(authOptions)` |
| **Deployment risks?** | `NEXTAUTH_SECRET` change invalidates all existing sessions |
| **Rollback strategy?** | Revert code + redeploy. Users must re-login. |

#### `src/models/Project.ts` — Project Mongoose Model

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Schema field changes break all CRUD operations. Index changes affect query performance. |
| **What silently breaks?** | Removing a field from the schema means existing documents with that field lose access. Adding `required: true` breaks existing documents missing that field. Index removal degrades query performance. |
| **Tests that fail?** | All 190 tests touch Project model indirectly |
| **Pages affected?** | Public: home, projects list, project detail. Admin: project list, editor. |
| **APIs affected?** | `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/[id]`, `POST /api/projects/bulk`, `GET /api/analytics/editorial` |
| **Deployment risks?** | Schema migration needed if fields change type. No migration system exists. |
| **Migration strategy?** | Additive changes only (new optional fields). Never remove or rename fields - add new field + deprecate old. |

#### `src/app/api/projects/[id]/route.ts` — Single Project API

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Project create/update/delete fails. Slug lookup fails. |
| **What silently breaks?** | Field-guard merge logic (lines 117-152) could silently drop fields. Cloudinary deletion (line 225) could leak assets. Revalidation paths could be wrong. |
| **Tests that fail?** | `tests/integration/api/projects-crud.test.ts` (all CRUD tests), `tests/regression/save-bug.test.ts` |
| **Pages affected?** | Admin project editor (save/update), public project detail page |
| **APIs affected?** | Direct: this route. Indirect: bulk route depends on same model |
| **Deployment risks?** | Breaking the merge logic = data loss on update. HIGH risk. |
| **Rollback strategy?** | Revert immediately. Data in MongoDB is safe (no destructive operation on rollback). |

#### `src/components/admin/MediaFields.tsx` — Media Management (420 lines)

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Media upload in project editor fails. Gallery management fails. Video poster management fails. |
| **What silently breaks?** | Auto-detect media type `useEffect` (line 70) could set wrong types. Gallery reorder logic (lines 271-285) could lose items. CldUploadWidget callbacks could silently fail. |
| **Tests that fail?** | None directly - no unit tests for this component |
| **Pages affected?** | `/admin/projects/new`, `/admin/projects/edit/[id]` |
| **Deployment risks?** | Medium - affects admin-only functionality |
| **Recovery strategy?** | Revert. No data loss risk (media URLs stored in DB, component is UI-only). |

#### `src/lib/projects/public-projects.ts` — Public Data Layer

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Public project listing, featured projects, individual project pages, sitemap generation. |
| **What silently breaks?** | Normalization logic could return wrong shapes. Static fallback could show stale data. |
| **Tests that fail?** | Indirectly: CRUD integration tests validate data shape |
| **Pages affected?** | Home page (featured projects), `/projects` (listing), `/projects/[slug]` (detail), `/sitemap.xml` |
| **Deployment risks?** | HIGH - affects all public-facing content |
| **Recovery strategy?** | Revert immediately. Stale ISR cache may show old data for up to 60s. |

#### `src/components/projects/ProjectMediaGallery.tsx` — Media Display (426 lines)

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Project case study media display fails. Video playback fails. |
| **What silently breaks?** | Video source fallback chain (20s timeouts) could silently skip sources. Keyboard navigation could break. |
| **Tests that fail?** | None - no unit tests |
| **Pages affected?** | `/projects/[slug]` (case study detail page) |
| **Deployment risks?** | Low - client-side only, no data mutation |
| **Recovery strategy?** | Revert. No data risk. |

#### `src/app/api/analytics/summary/route.ts` — Analytics Dashboard Data

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Admin analytics dashboard shows zero data. |
| **What silently breaks?** | 14 parallel queries (lines 46-163) could silently timeout. `distinct("visitorHash")` is O(n) in memory - large datasets could cause Lambda OOM. |
| **Tests that fail?** | None - no tests for this route |
| **Pages affected?** | `/admin/analytics` |
| **Deployment risks?** | Medium - admin-only, but blocks visibility into site performance |
| **Recovery strategy?** | Revert. Dashboard shows zeros. No data loss. |

#### `src/lib/api-client.ts` — Admin Data Access Layer

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | All admin CRUD operations fail. Data fetching on admin pages fails. |
| **What silently breaks?** | URL construction could be wrong (leading to 404s that React Query retries). Error handling could swallow errors. Bulk action methods could send wrong payloads. |
| **Tests that fail?** | Integration tests use API directly (not api-client), so they survive. But admin E2E would break. |
| **Pages affected?** | `/admin/projects`, `/admin/projects/new`, `/admin/projects/edit/[id]`, `/admin/content`, `/admin/content/hero` |
| **Deployment risks?** | Medium - admin-only impact |
| **Recovery strategy?** | Revert. No data loss risk. |

#### `src/lib/tracker.ts` — Client Analytics Tracker

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Page views, project views, showreel tracking, contact interactions stop being recorded. |
| **What silently breaks?** | Failed tracking events are silently swallowed (fire-and-forget). No error feedback to caller. |
| **Tests that fail?** | None - no tests for client analytics |
| **Pages affected?** | All marketing pages (6 consumers) |
| **Deployment risks?** | Low - analytics data loss only, no functional impact |
| **Recovery strategy?** | Revert. Historical data is safe in MongoDB. |

#### `src/lib/hooks/useUnsavedChanges.ts` — Form Dirty Detection

**If this file changes...**

| Impact | Details |
|--------|---------|
| **What breaks?** | Admin editors lose the "unsaved changes" warning on browser close. |
| **What silently breaks?** | Currently only intercepts `beforeunload`, NOT Next.js soft navigation (known TD-005). Users can navigate away from unsaved form data without warning. |
| **Tests that fail?** | None - no tests |
| **Pages affected?** | `/admin/content`, `/admin/content/hero`, project editor (via `ProjectEditor.tsx`) |
| **Deployment risks?** | Very low |
| **Recovery strategy?** | N/A - behavioral bug, not a crash. |

---

## PART XV — CHANGE IMPACT ANALYSIS

### 3.1 Change Matrix — Project Model

```
Changing src/models/Project.ts
|
+-- Validation
|   +-- src/lib/validation/project.ts (projectCreateSchema)
|   |   +-- If schema changes -> Zod schema must match
|   |   +-- If new required field -> all existing documents break
|   |   +-- Run: tests/unit/validation/project-schema.test.ts
|   +-- src/lib/validation/project-readiness.ts
|   |   +-- If new fields added -> readiness checks may need update
|   |   +-- Run: npm run qa:readiness
|   +-- src/lib/validation/shared.ts
|       +-- If base types change -> all downstream schemas break
|
+-- API Routes
|   +-- src/app/api/projects/route.ts (POST)
|   |   +-- Uses projectCreateSchema for validation
|   |   +-- Uses normalizeProject() for response
|   |   +-- Run: tests/integration/api/projects-crud.test.ts
|   +-- src/app/api/projects/[id]/route.ts (PUT)
|   |   +-- Uses projectUpdateSchema + field-guard merge logic
|   |   +-- Run: tests/integration/api/projects-crud.test.ts
|   +-- src/app/api/projects/[id]/route.ts (DELETE)
|   |   +-- Cloudinary cleanup depends on schema fields
|   |   +-- Run: tests/integration/api/projects-crud.test.ts
|   +-- src/app/api/projects/bulk/route.ts
|       +-- Uses deleteMany/updateMany on Project
|       +-- No Cloudinary cleanup (known gap)
|
+-- Admin UI
|   +-- src/components/admin/ProjectEditor.tsx
|   |   +-- 7 watch() calls map to schema fields
|   |   +-- reset() maps schema to form defaults
|   |   +-- Manual QA: create, edit, save cycle
|   +-- src/components/admin/MediaFields.tsx
|   |   +-- Auto-detect type relies on caseStudyMedia schema
|   |   +-- Gallery reorder maps to gallery[] schema
|   +-- src/components/admin/BasicInfoFields.tsx
|   +-- src/components/admin/SummaryFields.tsx
|   +-- src/components/admin/CategoriesFields.tsx
|   +-- src/components/admin/CaseStudyFields.tsx
|   +-- src/components/admin/ProjectStatusFields.tsx
|
+-- Public Pages
|   +-- src/lib/projects/public-projects.ts
|   |   +-- normalizeProject() must handle new fields
|   |   +-- Falls back to static data if DB fails
|   +-- src/app/(marketing)/projects/[slug]/page.tsx
|   |   +-- Renders project data with toPublicProject()
|   +-- src/components/projects/ProjectMediaGallery.tsx
|   |   +-- Renders caseStudyMedia[] items
|   +-- src/app/sitemap.ts
|       +-- Generates sitemap from published projects
|
+-- Tests
|   +-- tests/unit/validation/project-schema.test.ts (23 test cases)
|   +-- tests/regression/save-bug.test.ts (save flow regression)
|   +-- tests/integration/api/projects-crud.test.ts (full CRUD)
|   +-- tests/integration/api/pagination.test.ts (list pagination)
|   +-- tests/integration/db/persistence.test.ts (DB round-trip)
|   +-- tests/e2e/pagination.spec.ts (UI pagination)
|
+-- Deployment
|   +-- Vercel rebuild required
|   +-- revalidatePath() must include new slug patterns
|   +-- No migration system -> additive changes only
```

### 3.2 Change Matrix — Settings Model

```
Changing src/models/Settings.ts
|
+-- Validation
|   +-- src/lib/validation/settings.ts
|   |   +-- contentCreateSchema maps to SiteContentSchema
|   |   +-- socialLinksFormSchema has facebook/behance (NOT in DB schema)
|   |   +-- NOTE: Interface/schema mismatch exists (see 3.5 below)
|   +-- src/lib/validation/hero-settings.ts
|       +-- heroCreateSchema maps to HeroSchema subdoc
|
+-- API Routes
|   +-- src/app/api/settings/hero/route.ts (GET/PUT)
|   |   +-- Upserts into Settings.hero subdoc
|   |   +-- Draft gating: returns DEFAULT_HERO for non-admin non-published
|   +-- src/app/api/settings/content/route.ts (GET/PUT)
|       +-- Manual validation (no Zod) for content PUT
|       +-- Deep merge with existing content
|
+-- Public Content Pipeline
|   +-- src/lib/public-homepage-content.ts
|   |   +-- Reads Settings.hero + Settings.about
|   |   +-- Falls back to DEFAULT_CONTENT
|   +-- src/lib/public-contact-content.ts
|   |   +-- Reads Settings.siteContent
|   |   +-- Falls back to static contact.ts
|   +-- src/components/sections/about/index.tsx
|   +-- src/components/sections/contact/index.tsx
|   +-- src/components/layout/footer.tsx
|
+-- Admin UI
|   +-- src/app/admin/content/page.tsx (694 lines)
|   |   +-- Massive form for siteContent editing
|   |   +-- Bilingual support via BilingualInput
|   +-- src/app/admin/content/hero/page.tsx
|       +-- Hero editing form
|
+-- Data Fallback Chain
    +-- src/content/about.ts (static about content)
    +-- src/data/social-links.ts (social links defaults)
```

### 3.3 Change Matrix — Authentication System

```
Changing src/lib/auth.ts
|
+-- Middleware
|   +-- src/proxy.ts
|       +-- withAuth() uses authOptions
|       +-- Matcher: /admin/((?!login).*)
|
+-- Admin Layout
|   +-- src/app/admin/layout.tsx
|       +-- getServerSession(authOptions) server-side guard
|
+-- All Protected API Routes (12 routes)
|   +-- src/app/api/projects/route.ts
|   +-- src/app/api/projects/[id]/route.ts
|   +-- src/app/api/projects/bulk/route.ts
|   +-- src/app/api/settings/hero/route.ts
|   +-- src/app/api/settings/content/route.ts
|   +-- src/app/api/analytics/route.ts
|   +-- src/app/api/analytics/summary/route.ts
|   +-- src/app/api/analytics/editorial/route.ts
|   +-- src/app/api/analytics/insights/route.ts
|   +-- src/app/api/activity/route.ts
|   +-- (analytics/events has NO auth - known risk)
|
+-- Rate Limiting
|   +-- src/lib/auth-rate-limit.ts
|       +-- In-memory Map, per-Lambda instance
|       +-- 5 attempts per 15 minutes per email+IP
|
+-- Audit Logging
    +-- src/lib/activity.ts
        +-- Dynamic import in auth.ts for failed logins
```

### 3.4 Change Matrix — Validation Layer

```
Changing src/lib/validation/shared.ts
|
+-- ALL validation files depend on shared schemas
|   +-- project.ts (uses stringSchema, safeUrlSchema, seoSchema)
|   +-- settings.ts (uses stringSchema, contentStatusSchema)
|   +-- hero-settings.ts (uses stringSchema)
|
+-- ALL 12 consumers of validation/index.ts are affected
|   +-- 8 admin form components
|   +-- 4 API routes (projects POST, projects/[id] PUT, settings/hero PUT)
|
+-- Zod 4 compatibility
    +-- standardSchemaResolver from @hookform/resolvers/standard-schema
    +-- .issues (not .errors) for error access
    +-- ~standard.validate spec
    +-- See: tests/regression/save-bug.test.ts
```

### 3.5 Known Interface/Schema Mismatches (Technical Debt)

| Mismatch | Location | Impact |
|----------|----------|--------|
| `IServiceItem.displayOrder` + `isActive` in TS interface but NOT in Mongoose schema | `Settings.ts` L7-9 vs L106-110 | Fields silently dropped on save |
| `contactAvailability` in Mongoose schema but NOT in `ISiteContent` interface | `Settings.ts` L141 vs L40-67 | Field exists in DB but not typed |
| `socialLinksFormSchema` has `facebook` + `behance` but Mongoose `SocialLinksSchema` does not | `settings.ts` L58-59 vs `Settings.ts` L118-123 | Social links silently dropped |
| `servicesSubtitle` required in Zod but optional in Mongoose schema | `settings.ts` L105 vs `Settings.ts` L135 | Validation stricter than DB |
| `clientName` AND `client` both exist as separate fields | `Project.ts` L44-45 | Potential data duplication |

---

# VOLUME II — FAILURE, PERFORMANCE, AND SCALE

## PART XVI — FAILURE ATLAS

### 4.1 Authentication Failures

#### Failure: Admin Login Rejects Valid Credentials

**Symptoms:** User enters correct email/password, page shows "Invalid credentials" error, no redirect to dashboard.
**Root causes:**
- `ADMIN_PASSWORD` env var changed on Vercel but not locally (or vice versa)
- `NEXTAUTH_SECRET` rotated, invalidating JWT signing key
- `ADMIN_EMAIL` env var contains whitespace or wrong casing
- `crypto.timingSafeEqual` (src/lib/auth.ts:63) requires exact byte match, including case

**Detection:** Check Vercel environment variables. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` match between local `.env.local` and Vercel Dashboard.
**Logs:** NextAuth logs to stdout in dev. In production, check Vercel function logs for `NEXTAUTH` entries.
**Recovery:** Update env vars on Vercel Dashboard. Trigger redeploy. Users must re-login (sessions invalidated by secret change).
**Prevention:** Never rotate secrets without documenting the change. Use a secrets manager or at minimum maintain a `SECRETS-CHANGELOG.md`.
**Monitoring:** Set up a synthetic test that attempts login every 15 minutes.

#### Failure: Session Expired Mid-Admin-Workflow

**Symptoms:** Admin is editing a project, clicks Save, gets redirected to `/login`.
**Root causes:**
- JWT strategy (src/lib/auth.ts:93) means sessions expire based on NextAuth defaults
- No session refresh mechanism exists
- Browser clears cookies

**Detection:** User reports. Check if `session.expires` is in the past.
**Logs:** NextAuth debug logs if `NEXTAUTH_DEBUG=true` is set.
**Recovery:** User re-logs in. Form data may be lost (no auto-save).
**Prevention:** Implement session refresh callback in NextAuth config. Add auto-save to form editors.
**Monitoring:** None currently.

#### Failure: Rate Limiter Allows Brute Force (Per-Lambda)

**Symptoms:** Attacker makes 100+ login attempts without being blocked.
**Root causes:**
- `src/lib/auth-rate-limit.ts` uses in-memory `Map` (line 8-11)
- Vercel serverless functions have separate memory spaces
- Different Lambda instances get different rate limit state
- Attacker hitting different Lambdas bypasses the limit

**Detection:** Monitor login failure rate. If rate spikes without corresponding legitimate traffic, investigate.
**Logs:** Activity logs record failed login attempts (fire-and-forget in src/lib/auth.ts:19).
**Recovery:** N/A - this is a gap, not a failure.
**Prevention:** Implement rate limiting at Vercel Edge Config or Upstash Redis.
**Monitoring:** Set up alert on >50 failed logins per hour.

---

### 4.2 Database Failures

#### Failure: MongoDB Connection Timeout

**Symptoms:** API routes return empty arrays with 200 status (silent failure). Content pages show static fallback data.
**Root causes:**
- MongoDB Atlas cluster paused (free tier auto-pauses after inactivity)
- Network firewall rules blocking Vercel IP ranges
- DNS SRV resolution failure in dev mode (src/lib/db.ts:28-50)
- Connection pool exhausted under load

**Detection:** Check Vercel function logs for `MongooseServerSelectionError`. Check MongoDB Atlas dashboard for connection count.
**Logs:** Mongoose logs connection errors to stderr. `db.ts` does not add custom logging.
**Recovery:** Resume MongoDB Atlas cluster. If DNS issue, restart dev server. If pool exhaustion, increase `maxPoolSize` in connection options.
**Prevention:** Upgrade to MongoDB Atlas M10+ (no auto-pause). Add connection health check endpoint. Add retry logic with exponential backoff.
**Monitoring:** MongoDB Atlas monitoring dashboard. Set up uptime check on `/api/health`.

#### Failure: Schema Validation Rejects Existing Documents

**Symptoms:** After adding `required: true` to a schema field, existing documents with that field missing cause query failures or empty results.
**Root causes:**
- Mongoose strict mode + required fields
- No migration system exists
- Adding required fields to existing collections

**Detection:** API returns 400 or 500 for specific documents that predate the schema change.
**Logs:** Mongoose validation errors in function logs.
**Recovery:** Either: (1) Backfill missing fields with defaults, or (2) Remove `required: true` from schema.
**Prevention:** Never add `required: true` to existing fields. Only add optional fields. Use the `default` property.
**Prevention rule:** All schema changes must be additive and backward-compatible.

#### Failure: Analytics Collection Unbounded Growth

**Symptoms:** MongoDB storage approaching 512MB limit (free tier). Query performance degrading. Summary endpoint timing out.
**Root causes:**
- No TTL index on Analytics collection (src/models/Analytics.ts)
- No document count limit
- Each page view + interaction creates a document
- 9 indexes consume additional storage

**Detection:** MongoDB Atlas storage metrics. Slow query logs.
**Logs:** Mongoose slow query warnings if `mongoose.set('debug', true)`.
**Recovery:** Manual delete of old documents: `db.analytics.deleteMany({ createdAt: { $lt: new Date(Date.now() - 90*24*60*60*1000) } })`.
**Prevention:** Add TTL index: `{ createdAt: 1 }, { expireAfterSeconds: 7776000 }` (90 days). Reduce to 5 essential indexes.
**Monitoring:** MongoDB Atlas storage alerts.

---

### 4.3 Deployment Failures

#### Failure: Build Fails on Vercel

**Symptoms:** Vercel deployment shows "Build Error". Site shows previous deployment.
**Root causes:**
- TypeScript errors in new code
- Missing env vars (Vercel build needs `MONGODB_URI`, `NEXTAUTH_SECRET`)
- Google Fonts unreachable during build (network dependency)
- Package version mismatch

**Detection:** Check Vercel build logs. Common error: `Type error: ...`.
**Logs:** Vercel build output shows full error trace.
**Recovery:** Fix the error, push new commit. Vercel auto-deploys from `main`.
**Prevention:** Run `npm run build` locally before pushing. Run `npm run lint` and `npm run test` locally.
**Monitoring:** Vercel GitHub integration notifies on build failure.

#### Failure: Environment Variable Missing on Vercel

**Symptoms:** Feature works locally, fails in production. Usually 500 errors or silent fallback.
**Root causes:**
- New env var added to `.env.local` but not to Vercel Dashboard
- `NEXT_PUBLIC_` prefix required for client-side vars
- Env var name typo

**Detection:** Check Vercel function logs for `undefined` errors. Compare `.env.local` keys with Vercel Dashboard env vars.
**Logs:** Runtime error logs in Vercel dashboard.
**Recovery:** Add missing env var to Vercel Dashboard. Trigger redeploy.
**Prevention:** Maintain a canonical list of required env vars (already exists: `.env.example`). Diff it against Vercel Dashboard periodically.
**Monitoring:** None currently.

#### Failure: Revalidation Not Working After Deploy

**Symptoms:** New content saved in admin, public pages still show old content.
**Root causes:**
- `revalidatePath()` called but ISR cache not cleared
- Cloudflare/CDN cache layer above Vercel
- Path argument incorrect (e.g., missing trailing slash)

**Detection:** Manual page refresh shows old content. Direct API call shows new data.
**Logs:** Next.js revalidation logs in function output.
**Recovery:** Call `revalidatePath("/projects/[slug]")` manually via API or redeploy.
**Prevention:** Test revalidation in staging. Use `revalidateTag()` for more granular control.
**Monitoring:** None currently.

---

### 4.4 Validation Failures

#### Failure: Zod 4 Migration Breaks Form Submission

**Symptoms:** Admin clicks Save, form shows infinite loading spinner. No network request is made.
**Root causes:**
- Zod 4 uses `.issues` instead of `.errors` for validation results
- `standardSchemaResolver` from `@hookform/resolvers/standard-schema` expects `~standard.validate` spec
- Previous Zod 3 code expected `.errors`

**Detection:** React DevTools shows form state stuck in `isValidating: true`. No console errors.
**Logs:** None - client-side only failure.
**Recovery:** Already fixed in `tests/regression/save-bug.test.ts`. The test verifies the correct behavior.
**Prevention:** All Zod validation code must use the Zod 4 API. Never assume Zod 3 behavior.
**Monitoring:** Regression test catches this.

#### Failure: Empty String vs Undefined Mismatch

**Symptoms:** Form fields that should be empty show as `undefined` in the API, or vice versa. Validation rejects valid submissions.
**Root causes:**
- `draftSafeStringBase` defaults to `""` (empty string)
- Mongoose `undefined` means "field not set"
- React Hook Form `reset()` with `undefined` values vs `""` values

**Detection:** API returns 422 validation error for fields that appear filled in the UI.
**Logs:** Zod validation error details in API response.
**Recovery:** Ensure `reset()` passes empty strings, not undefined. Check `toPlainText()` for null handling.
**Prevention:** Standardize on empty strings for optional text fields. Document the convention.
**Monitoring:** Regression test for this exact scenario.

---

### 4.5 Media Failures

#### Failure: Cloudinary Upload Widget Fails to Load

**Symptoms:** Upload area shows "Upload" button but clicking it does nothing. Or shows error state.
**Root causes:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` missing or wrong
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` misconfigured
- CSP `frame-src` blocks Cloudinary widget iframe
- Cloudinary service outage

**Detection:** Browser console shows CSP violation or network error to `widget.cloudinary.com`.
**Logs:** Browser console. `MediaUploader.tsx` catches upload errors and shows toast (sonner).
**Recovery:** Verify env vars. Check Cloudinary status page. If CSP issue, update `next.config.ts` frame-src.
**Prevention:** Monitor Cloudinary status. Add health check for Cloudinary connectivity.
**Monitoring:** None currently.

#### Failure: Video Playback Fails (Multi-Source Fallback)

**Symptoms:** Project case study page shows video error state. No playback.
**Root causes:**
- Primary video URL is down or deleted from Cloudinary
- Secondary URLs (direct, Mux, Google Drive) also fail
- Browser does not support video format (WebM vs MP4)
- CORS restrictions on video source

**Detection:** `ProjectMediaGallery.tsx` shows `MediaErrorFallback` component. Video load timeouts (20s each) in `FeaturedMedia` sub-component (line 153).
**Logs:** Browser network tab shows failed video requests. No server-side logs.
**Recovery:** Replace video URLs in project data. Or fix the source (re-upload to Cloudinary).
**Prevention:** Use Cloudinary's `video_transformation` for format auto-conversion. Add monitoring for video URL availability.
**Monitoring:** None currently.

#### Failure: Cloudinary Asset Leak on Delete

**Symptoms:** Deleted projects still have images/videos accessible via Cloudinary URLs.
**Root causes:**
- `DELETE /api/projects/[id]/route.ts` calls `deleteCloudinaryResources()` (line 225)
- But `POST /api/projects/bulk/route.ts` does NOT clean Cloudinary assets
- If `deleteCloudinaryResources()` throws, project is still deleted (no transaction)
- Public ID extraction depends on URL format matching

**Detection:** Cloudinary Media Library shows orphaned assets. Or: check a deleted project's URL still returns 200.
**Logs:** `cloudinary.ts` does not add logging. Errors are caught in the route handler.
**Recovery:** Manually delete orphaned assets from Cloudinary Media Library. Or run a cleanup script.
**Prevention:** Add Cloudinary cleanup to bulk delete. Wrap delete in try/catch and log failures. Implement asset orphan detection.
**Monitoring:** Periodic audit: query Cloudinary for assets not referenced by any active project.

---

### 4.6 Network Failures

#### Failure: DNS SRV Resolution Fails in Development

**Symptoms:** `npm run dev` fails to connect to MongoDB. Error: `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`.
**Root causes:**
- Custom DNS resolution in `src/lib/db.ts` lines 28-50
- Uses hardcoded DNS servers (8.8.8.8, 1.1.1.1)
- Corporate firewalls or VPNs may block external DNS
- Node.js `dns` module version differences

**Detection:** Dev server shows MongoDB connection error on startup.
**Logs:** Mongoose connection error in terminal.
**Recovery:** Use a different DNS server. Or bypass SRV by using a direct `mongodb://` connection string.
**Prevention:** Document the DNS workaround in README. Consider using `mongodb+srv://` natively with updated Node.js DNS resolver.
**Monitoring:** None needed (dev-only issue).

---

### 4.7 Cache Failures

#### Failure: Stale ISR Cache Shows Deleted Projects

**Symptoms:** Deleted project page returns 200 with old content instead of 404.
**Root causes:**
- `revalidatePath()` only revalidates known paths
- If slug was not known at deletion time, its cache persists
- ISR cache TTL is 60 seconds but cached HTML can persist longer

**Detection:** Visit a known-deleted project slug, see 200 with old content.
**Logs:** None - ISR is transparent.
**Recovery:** Manual revalidation: `revalidatePath("/projects/[deleted-slug]")`. Or wait for cache expiry.
**Prevention:** On delete, explicitly revalidate the project's slug path (already done in `projects/[id]/route.ts` line 232-238). Also revalidate `/projects` listing.
**Monitoring:** None currently.

---

### 4.8 ISR Failures

#### Failure: ISR Revalidation Causes Cold Start Spike

**Symptoms:** After a deploy, many pages simultaneously revalidate, causing Lambda cold starts and slow responses.
**Root causes:**
- Vercel rebuilds invalidate all ISR caches
- Every page with `revalidate` triggers fresh render on next visit
- Homepage, project pages, and sitemap all revalidate simultaneously

**Detection:** First visitors after deploy see 3-5s load times. Subsequent visitors see <200ms.
**Logs:** Vercel function logs show increased execution time for revalidation handlers.
**Recovery:** Wait for cache to warm. Or trigger manual revalidation via `revalidatePath()`.
**Prevention:** Use `revalidateTag()` for selective cache invalidation instead of `revalidatePath()`. Implement cache warming on deploy.
**Monitoring:** Vercel Analytics function duration metrics.

---

### 4.9 Hydration Failures

#### Failure: React Hydration Mismatch on Marketing Pages

**Symptoms:** Console warning "Hydration failed because the initial UI does not match what was rendered on the server". Page flickers.
**Root causes:**
- Server-rendered content differs from client-rendered content
- `CreativeEngineLoader.tsx` uses `sessionStorage` and `prefers-reduced-motion` (client-only APIs)
- Date/time rendering differs between server and client timezones
- `CreativeEngineLoader.tsx` conditionally renders children based on `phase` state

**Detection:** Browser console shows hydration warnings. Visual flicker on page load.
**Logs:** React development mode warnings in console.
**Recovery:** Wrap client-only content in `useEffect` or dynamic import with `ssr: false`.
**Prevention:** Use `suppressHydrationWarning` on elements that legitimately differ. Use `next/dynamic` with `{ ssr: false }` for purely client components.
**Monitoring:** None currently.

---

### 4.10 Build Failures

#### Failure: TypeScript Strict Mode Errors

**Symptoms:** `npm run build` fails with type errors. Vercel deployment blocked.
**Root causes:**
- `tsconfig.json` has `strict: true`
- New code introduces type mismatches
- Zod 4 schema types diverge from Mongoose schema types (known mismatches in 3.5)

**Detection:** Build output shows `Type error: ...` messages.
**Logs:** Full type error trace in build output.
**Recovery:** Fix the type error. Add explicit type assertions if needed. Push new commit.
**Prevention:** Run `npx tsc --noEmit` before every commit. Use strict typing in new code.
**Monitoring:** CI/CD pipeline (if implemented).

---

### 4.11 Environment Failures

#### Failure: Missing `CLOUDINARY_API_KEY` or `CLOUDINARY_API_SECRET`

**Symptoms:** Upload widget works (client-side), but server-side Cloudinary operations fail (delete, transformation).
**Root causes:**
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are server-only env vars
- Missing from `.env.local` (currently absent - see analysis)
- `cloudinary.ts` imports them directly

**Detection:** Delete operation returns 500. `cloudinary.v2.config()` throws.
**Logs:** Cloudinary SDK error in function logs.
**Recovery:** Add missing env vars to `.env.local` and Vercel Dashboard.
**Prevention:** Validate all required env vars at startup using a schema (e.g., `@t3-oss/env-nextjs`).
**Monitoring:** None currently.

---

### 4.12 Dependency Failures

#### Failure: Package Version Conflict After Update

**Symptoms:** `npm install` fails. Or: build succeeds but runtime throws errors from updated package.
**Root causes:**
- Next.js 16 breaking changes (documented in AGENTS.md)
- Zod 4 breaking changes from Zod 3
- Mongoose 8 schema changes from Mongoose 7
- React 19 changes from React 18

**Detection:** `npm install` peer dependency warnings. Runtime errors referencing package internals.
**Logs:** npm install output. Runtime stack traces.
**Recovery:** Pin to known-working version. Check package changelog for breaking changes.
**Prevention:** Never auto-update major versions. Read migration guides before updating. Run full test suite after any dependency update.
**Monitoring:** `npm audit` for security vulnerabilities. Dependabot for update alerts.

---

## PART XVII — PERFORMANCE ATLAS

### 5.1 Rendering Performance

#### Server-Side Rendering (SSR)

| Page | Render Strategy | Cold Start | Warm Cache | Notes |
|------|----------------|------------|------------|-------|
| `/` (homepage) | ISR (60s revalidation) | 800-1200ms | <100ms | Fetches from MongoDB + static fallback |
| `/projects` | ISR (60s revalidation) | 600-900ms | <100ms | Lists published projects |
| `/projects/[slug]` | ISR (60s revalidation) | 700-1000ms | <100ms | Single project + media gallery |
| `/showreel` | Static | <200ms | <100ms | No DB query |
| `/admin/*` | SSR (per-request) | 500-800ms | N/A | Auth check + data fetch |

**Hot paths:** Homepage and project pages are ISR-cached. First visitor after deploy triggers cold render.
**Cold paths:** Admin pages are always SSR (no caching). Auth check adds latency.

#### Client-Side Rendering (CSR)

| Component | Render Trigger | Re-render Risk | Optimization Status |
|-----------|---------------|----------------|---------------------|
| `ProjectEditor.tsx` | Form interaction | **HIGH** - 7 `watch()` calls | Needs memoization |
| `MediaFields.tsx` | Media operations | **HIGH** - `useEffect` on every media change | Needs refactoring |
| `DataTable.tsx` | Sort/page/search | **MEDIUM** - TanStack Table re-sorts | Acceptable |
| `ProjectMediaGallery.tsx` | Thumbnail click | **LOW** - AnimatePresence handles transitions | Well optimized |
| `CreativeEngineLoader.tsx` | Initial page load | **LOW** - runs once, uses sessionStorage skip | Well optimized |

### 5.2 Query Performance

#### MongoDB Query Analysis

| Query | Location | Complexity | Index Used | Estimated Time |
|-------|----------|-----------|------------|----------------|
| `Project.find({status:"published"}).sort().skip().limit()` | `projects/route.ts:95-98` | Simple | `{status:1, updatedAt:-1}` | <10ms |
| `Project.findOne({slug})` | `projects/[id]/route.ts:41` | Simple | `{slug:1}` unique | <5ms |
| `Project.findById(id)` | `projects/[id]/route.ts:89` | Simple | `_id` | <5ms |
| `Analytics.aggregate([dailyViews])` | `analytics/route.ts:30-46` | Medium | `{type:1, createdAt:-1}` | 10-50ms |
| `Analytics.aggregate([topProjects + $lookup])` | `analytics/route.ts:48-72` | **Heavy** | `{projectId:1, createdAt:-1}` | 50-200ms |
| `Analytics.distinct("visitorHash")` | `analytics/summary/route.ts:48` | **O(n) memory** | None | 100-5000ms |
| `Analytics.aggregate([14 parallel queries])` | `analytics/summary/route.ts:46-163` | **Very Heavy** | Multiple | 200-5000ms |
| `Settings.findOne({}).lean()` | Multiple routes | Simple | `_id` | <5ms |
| `ActivityLog.find({}).sort().skip().limit()` | `activity/route.ts:52-59` | Simple | `{createdAt:-1}` | <10ms |

**Critical performance risk:** `analytics/summary/route.ts` executes 14 parallel DB queries. On large datasets, `distinct("visitorHash")` is O(n) in memory and can cause Lambda OOM or timeout.

### 5.3 React Query Performance

| Query Key | Stale Time | Cache Time | Refetch Strategy | Consumers |
|-----------|-----------|------------|------------------|-----------|
| `projects` | 30s | 5min | On window focus | `api-client.ts` ProjectService |
| `project/{id}` | 30s | 5min | On window focus | `api-client.ts` ProjectService.getById |
| `settings` | 60s | 10min | On window focus | `api-client.ts` SettingsService |
| `analytics/summary` | 30s | 5min | On window focus | Analytics dashboard |

**Optimization opportunity:** Query keys are not using `queryKey` factory pattern. Manual cache invalidation after mutations.

### 5.4 Form Performance

#### ProjectEditor.tsx (237 lines)

**Current state:**
- 7 `watch()` calls (lines 79-86) each trigger re-renders on every keystroke
- 3 `useFieldArray` instances for gallery, sections, caseStudyMedia
- `submitAttempted` state triggers error re-renders
- `readinessResult` state triggers readiness panel re-renders

**Impact:** Typing in any field causes 7+ re-renders. On slow devices, this creates input lag.
**Mitigation:** React 19 automatic batching helps. But individual `watch()` calls still trigger.
**Recommendation:** Replace individual `watch()` calls with a single `watch()` returning all needed fields.

#### MediaFields.tsx (420 lines)

**Current state:**
- `useEffect` on line 70 iterates ALL `caseStudyMedia` items and calls `setValue()` on each
- This runs on EVERY change to `watchedCaseStudyMedia`
- Gallery reorder uses `getValues()` + `setValue()` pattern instead of `useFieldArray` move

**Impact:** Adding/removing a media item triggers full re-iteration of all items. Gallery reorder is O(n) state updates.
**Mitigation:** None currently.
**Recommendation:** Replace `useEffect` + `setValue` with `useFieldArray` methods. Use `swap()` for reorder.

### 5.5 Table Performance

#### DataTable.tsx (285 lines)

**Current state:**
- Uses TanStack Table `getSortedRowModel()` which re-sorts on every render
- `useReactTable` return values are not memoized (line 152)
- Search input debounces at 300ms (default TanStack)
- Pagination is server-side (good)

**Impact:** Sort toggle causes full table re-render. Search causes API call + re-render.
**Mitigation:** Server-side pagination already limits row count. Search debounce is reasonable.
**Recommendation:** Memoize `columnDef` arrays. Use `getSortedRowModel(getSortedRowModel())` only when sorting is active.

### 5.6 Image Performance

| Image | Format | Optimization | Size | Notes |
|-------|--------|-------------|------|-------|
| Project thumbnails | WebP/AVIF via Next.js | `sizes` attribute | ~50-100KB | Well optimized |
| Hero poster image | WebP/AVIF via Next.js | Remote pattern (Unsplash/Cloudinary) | ~100-200KB | Acceptable |
| Character selector (about) | PNG with pixel art | `unoptimized: true` | ~50KB each | 5 images preloaded on mount |
| Contact icons | PNG with `imageRendering: "pixelated"` | `unoptimized: true` | ~5KB each | Small, decorative |
| Gallery thumbnails | WebP/AVIF via Next.js | Lazy loaded | ~30-80KB | In ProjectMediaGallery |

**Optimization opportunity:** `CharacterSelector.tsx` preloads ALL 5 images on mount (line 60). Could lazy-load only visible images.

### 5.7 Upload Performance

**Current state:**
- `MediaUploader.tsx` uses `CldUploadWidget` from `next-cloudinary`
- Upload goes directly from browser to Cloudinary (bypasses server)
- Server only receives the final URL
- Upload preset determines transformation

**Impact:** Large files (>10MB) may time out on slow connections. No progress indicator beyond Cloudinary widget default.
**Mitigation:** Cloudinary widget provides built-in progress.
**Recommendation:** Add file size validation client-side before upload. Max 10MB for images, 100MB for video.

### 5.8 Database Performance

**Current indices:**

| Collection | Indexes | Redundancy | Recommendation |
|------------|---------|------------|----------------|
| `projects` | 5 compound | `{status:1}` duplicated in all 5 | Add `{slug:1}` unique index |
| `analytics` | 9 compound | `{createdAt:-1}` in all 9 | Remove standalone `{createdAt:-1}`, reduce to 5 |
| `activitylogs` | 3 | `{createdAt:-1}` standalone + compound | Keep all 3 (low volume) |
| `settings` | 0 (singleton) | N/A | N/A |

**Impact:** 9 analytics indexes consume storage and slow writes. Each write updates 9 B-trees.
**Recommendation:** Remove standalone `{createdAt:-1}` (covered by all compound indexes). Audit actual query patterns with MongoDB `db.analytics.aggregate([{$indexStats: {}}])`.

### 5.9 Memory Performance

**Risk areas:**
- `analytics/summary/route.ts`: `distinct("visitorHash")` loads ALL unique visitor hashes into memory. At 100K visitors, this is ~3MB of strings.
- `CreativeEngineLoader.tsx`: 5 cascading `setTimeout` calls hold references in closure until complete.
- `FilmStripSection.tsx`: GSAP ScrollTrigger pins DOM elements, keeping them in memory.
- `ProjectMediaGallery.tsx`: `AnimatePresence` with `mode="wait"` keeps exiting component mounted during animation.

### 5.10 Bundle Size Analysis

| Package | Bundle Impact | Tree-Shakeable | Alternative |
|---------|--------------|----------------|-------------|
| `framer-motion` | **HIGH** (~40KB gzipped) | Partial | `motion` (smaller) or CSS animations |
| `gsap` | **HIGH** (~30KB gzipped) | No | CSS scroll-driven animations |
| `@tiptap/react` + extensions | **MEDIUM** (~25KB gzipped) | Partial | Markdown editor |
| `recharts` | **MEDIUM** (~20KB gzipped) | Yes | `victory` or custom SVG |
| `@tanstack/react-table` | **LOW** (~8KB gzipped) | Yes | N/A (already optimal) |
| `@tanstack/react-query` | **LOW** (~8KB gzipped) | Yes | N/A |
| `mongoose` | **Server-only** | N/A | N/A |
| `zod` | **Server-only** | N/A | N/A |

**Optimization opportunity:** GSAP is only used in `FilmStripSection.tsx` (which is UNUSED). If removed, save ~30KB. Framer-motion is used in 15+ components - harder to remove.

### 5.11 Re-Render Risk Map

| Component | Watch/State Dependencies | Re-render Frequency | Risk Level |
|-----------|-------------------------|---------------------|------------|
| `ProjectEditor.tsx` | 7 `watch()` + 3 `useFieldArray` | Every keystroke | **HIGH** |
| `MediaFields.tsx` | `watchedCaseStudyMedia` + `watchedGallery` + `watchedSections` | Every media change | **HIGH** |
| `DataTable.tsx` | `sorting` state + TanStack internal | Every sort/page | **MEDIUM** |
| `navbar.tsx` | `scrolled` state + `isOpen` | Scroll + menu toggle | **LOW** |
| `CharacterSelector.tsx` | `currentIndex` + `direction` | Arrow click | **LOW** |
| `ProjectMediaGallery.tsx` | `activeIndex` | Thumbnail click | **LOW** |
| `SectionNarrator.tsx` | `sectionProgress` + `currentChapter` | Scroll intersection | **MEDIUM** |

### 5.12 Optimization Opportunities (Prioritized)

| Priority | Target | Expected Improvement | Effort |
|----------|--------|---------------------|--------|
| **P0** | Remove unused GSAP `FilmStripSection.tsx` | -30KB bundle | 10 min |
| **P0** | Remove unused `dropdown-menu.tsx` + `pixel-button.tsx` | -5KB bundle | 10 min |
| **P1** | Add TTL index to Analytics collection | Prevents DB bloat | 15 min |
| **P1** | Reduce Analytics indexes from 9 to 5 | Faster writes, less storage | 30 min |
| **P2** | Replace `MediaFields.tsx` useEffect with `useFieldArray` | Eliminates O(n) setValue loop | 4h |
| **P2** | Consolidate 7 `watch()` calls in ProjectEditor | Reduces re-renders by ~60% | 2h |
| **P2** | Add `distinct` index on Analytics `visitorHash` | Speeds up summary query | 15 min |
| **P3** | Implement lazy image loading in CharacterSelector | Faster about section load | 1h |
| **P3** | Add query key factory pattern to React Query | Better cache management | 2h |
| **P3** | Memoize TanStack Table column definitions | Reduces DataTable re-renders | 1h |

---

# VOLUME III — SCALE, SECURITY, AND DECISIONS

## PART XVIII — SCALABILITY MANUAL

### 6.1 Scale Targets

| Target | Current State | Gap | Effort to Close |
|--------|--------------|-----|-----------------|
| 100K projects | ~3-5 projects | Massive | Redesign entire data layer |
| 10 concurrent editors | 1 editor | Small | Add optimistic locking |
| 1M visitors/month | ~1K visitors | Large | CDN + caching + edge functions |
| Global CDN | Vercel Edge Network | Partial | Already deployed, needs tuning |
| Multi-region deployment | Single region (Vercel) | Medium | Vercel Multi-Region or custom |

### 6.2 What Survives at Scale

| Component | Status at 100K Projects | Why |
|-----------|------------------------|-----|
| Validation schemas | **Survives** | Zod is schema-agnostic |
| Auth system | **Survives** | JWT strategy is stateless |
| Activity logging | **Survives** | Simple insert-only pattern |
| Client analytics tracker | **Survives** | Fire-and-forget, no dependency on data volume |
| Media pipeline | **Survives** | Cloudinary handles scale independently |
| UI components | **Survives** | Pure rendering, no data dependency |

### 6.3 What Breaks at Scale

| Component | Failure Point | Root Cause | Fix Required |
|-----------|--------------|------------|--------------|
| `public-projects.ts` | ~1K projects | Loads ALL projects into memory for normalization | Implement cursor-based pagination + streaming |
| `analytics/summary/route.ts` | ~100K analytics docs | 14 parallel queries + `distinct("visitorHash")` O(n) | Pre-aggregate into summary collections |
| `Analytics` collection | ~1M docs | No TTL, 9 indexes, unbounded growth | TTL index + pre-aggregation + index reduction |
| `projects/route.ts` search | ~10K projects | Regex `$or` across 5 fields | Full-text search index (MongoDB Atlas Search) |
| `Project.find().skip().limit()` | ~10K projects | Skip is O(n) - scans all skipped docs | Cursor-based pagination |
| Sitemap generation | ~1K projects | Generates all URLs on each request | Static sitemap with incremental updates |
| `ActivityLog` collection | ~100K docs | No TTL, no archiving | TTL index + archive old logs |
| Homepage ISR | High traffic spike | All visitors trigger cold render after deploy | Edge caching + cache warming |

### 6.4 What Must Be Redesigned

#### Data Access Layer (Critical)

**Current:** Direct Mongoose queries in API routes and server components.
**Required at scale:** Service layer with caching, pagination, and query optimization.

```
Current:
  API Route -> Mongoose Model -> MongoDB

Required:
  API Route -> Service Layer -> Cache Layer -> Query Builder -> MongoDB
                              |
                              +-> Cursor-based pagination
                              +-> Result streaming
                              +-> Query result caching
                              +-> Read replicas
```

#### Analytics Pipeline (Critical)

**Current:** Raw events stored, queried on-demand with 14 parallel queries.
**Required at scale:** Pre-aggregated time-series data.

```
Current:
  Event -> Analytics collection -> 14 queries at read time

Required:
  Event -> Analytics collection (TTL 90 days)
       -> Hourly aggregation job -> AnalyticsHourly collection
       -> Daily aggregation job -> AnalyticsDaily collection
       -> Dashboard reads from aggregated collections (2-3 queries max)
```

#### Search (Important)

**Current:** Regex `$or` across 5 fields.
**Required at scale:** Full-text search index.

```
Current:
  { $or: [
    { title: { $regex: query, $options: 'i' } },
    { slug: { $regex: query, $options: 'i' } },
    { tags: { $regex: query, $options: 'i' } },
    { category: { $regex: query, $options: 'i' } },
    { clientName: { $regex: query, $options: 'i' } }
  ]}

Required:
  MongoDB Atlas Text Search index on [title, slug, tags, category, clientName]
  OR external search service (Algolia, Meilisearch)
```

### 6.5 Migration Path

| Phase | Trigger | Changes | Timeline |
|-------|---------|---------|----------|
| **Phase 1: Optimize** | Current | TTL indexes, reduce analytics indexes, cursor pagination | 1 week |
| **Phase 2: Cache** | >10K visitors/month | React Query tuning, ISR optimization, edge caching | 2 weeks |
| **Phase 3: Pre-aggregate** | >100K analytics docs | Hourly/daily aggregation jobs, summary collections | 1 week |
| **Phase 4: Search** | >1K projects | MongoDB Atlas Search or external search | 1 week |
| **Phase 5: Service layer** | >10 editors | Optimistic locking, conflict resolution, audit trail | 2 weeks |
| **Phase 6: Multi-region** | >1M visitors/month | Vercel Multi-Region, read replicas, edge functions | 2 weeks |

### 6.6 Expected Bottlenecks

| Bottleneck | When | Impact | Mitigation |
|------------|------|--------|------------|
| MongoDB connection pool | >50 concurrent Lambda invocations | 503 errors | Increase `maxPoolSize`, use connection pooling middleware |
| Vercel function duration | >10s execution | Function timeout | Move to background jobs, add caching |
| Cloudinary bandwidth | >100GB/month | Overage charges | Use Cloudinary's bandwidth analytics, implement lazy loading |
| MongoDB Atlas free tier | >512MB storage | Cluster pause | Upgrade to M10 ($57/month) |
| Vercel bandwidth | >100GB/month | Overage charges | Enable Vercel's built-in CDN, compress responses |

---

## PART XIX — SECURITY MANUAL

### 7.1 Threat Model

```
                        INTERNET
                           |
                    [Vercel Edge Network]
                           |
                    [Next.js Middleware]  <-- proxy.ts (auth check)
                           |
              +------------+------------+
              |                         |
        [Public Routes]          [Admin Routes]
              |                         |
        [ISR Cache]              [getServerSession]
              |                         |
        [Server Components]       [API Routes]
              |                         |
        [MongoDB Atlas]           [MongoDB Atlas]
              |                         |
        [Cloudinary CDN]          [Cloudinary API]
```

**Attack surface:** Public API endpoints, admin login, file uploads, analytics events, form submissions.

### 7.2 Attack Surface Inventory

| Entry Point | Auth Required | Rate Limited | Validated | Risk Level |
|------------|---------------|-------------|-----------|------------|
| `POST /api/analytics` | **NO** | **NO** | **NO** | **CRITICAL** |
| `POST /api/analytics/events` | **NO** | Body size (8KB) | Allowlist | **HIGH** |
| `POST /api/auth/[...nextauth]` | N/A | Per-instance (5/15min) | N/A | **MEDIUM** |
| `GET /api/projects` | Conditional | No | Yes | **LOW** |
| `POST /api/projects` | Yes | No | Yes (Zod) | **LOW** |
| `PUT /api/projects/[id]` | Yes | No | Yes (Zod) | **LOW** |
| `DELETE /api/projects/[id]` | Yes | No | No | **LOW** |
| `POST /api/projects/bulk` | Yes | Max 50 items | Manual | **LOW** |
| `PUT /api/settings/hero` | Yes | No | Yes (Zod) | **LOW** |
| `PUT /api/settings/content` | Yes | No | Manual | **LOW** |
| `GET /api/settings/hero` | Conditional | No | N/A | **LOW** |
| `GET /api/settings/content` | Conditional | No | N/A | **LOW** |
| `GET /api/health` | No | No | N/A | **LOW** |

### 7.3 Authentication Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| Brute force login | In-memory rate limiter (5/15min per email+IP) | Per-Lambda only (not shared across instances) | Upstash Redis rate limiter |
| Credential stuffing | No CAPTCHA | Attacker can try many emails | Add CAPTCHA on login page |
| Session hijacking | JWT with `NEXTAUTH_SECRET` | No session rotation on privilege change | Rotate session on sensitive actions |
| Password strength | No enforcement | Admin password `1937468250Aa@` was weak | Enforce minimum 16 chars + complexity |
| Missing env vars | No validation | Could deploy with weak/missing secret | Startup env validation with `@t3-oss/env-nextjs` |

### 7.4 Authorization Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| IDOR on projects | `?admin=true` check is query param only | No server-side admin check on GET | Always verify session on GET with admin data |
| Settings access | `getServerSession` on PUT | GET returns data without auth if `?admin=true` omitted | Require auth for all settings reads |
| Bulk operations | Max 50 items | No ownership verification | Add ownership check before bulk delete |
| Activity log access | Requires auth | No role-based access (single admin) | Fine-grained if multiple admins added |

### 7.5 CSRF Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| Form submissions | NextAuth CSRF tokens | Only on auth routes | Verify CSRF on all POST/PUT/DELETE routes |
| State-changing operations | JWT session check | No additional CSRF protection | Add CSRF tokens to admin forms |

### 7.6 XSS Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| User input in admin | Zod validation (no HTML sanitization) | Rich text editor allows HTML | Sanitize rich text output with DOMPurify |
| `dangerouslySetInnerHTML` | Used in `JsonLd.tsx` (static data) | Safe for now but risky pattern | Replace with JSON script tags |
| URL fields | `safeUrlSchema` rejects `javascript:` and `data:` | Good | Maintain allowlist approach |
| Analytics metadata | `Schema.Types.Mixed` allows arbitrary data | Could store XSS payloads | Sanitize before display |

### 7.7 SSRF Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| URL fields | `safeUrlSchema` validates http/https only | Could be used to probe internal URLs | Add IP range validation for URLs |
| Cloudinary URLs | Only external CDN URLs expected | No validation against internal IPs | Validate URLs point to Cloudinary/known CDN |
| Link previews | Not implemented | N/A | If added, validate target URLs |

### 7.8 Secret Management

| Secret | Location | Current Security | Gap | Recommendation |
|--------|----------|-----------------|-----|----------------|
| `NEXTAUTH_SECRET` | Vercel Dashboard + `.env.local` | Gitignored | Rotated but old still works on Vercel | Force rotate on Vercel |
| `ADMIN_PASSWORD` | Vercel Dashboard + `.env.local` | Gitignored | Same as above | Force rotate + enforce complexity |
| `MONGODB_URI` | Vercel Dashboard + `.env.local` | Gitignored | Contains plaintext credentials | Use MongoDB Atlas secrets manager |
| `CLOUDINARY_API_SECRET` | Missing from `.env.local` | Not in repo | Missing env var | Add to Vercel Dashboard |
| Git history | 7 secrets in commits 314e3ee, 633841b, 2d1ec70 | **EXPOSED** | BFG cleanup needed | BFG Repo-Cleaner + force push |
| Admin credentials in tests | `projects-crud.test.ts:69`, `persistence.test.ts:51`, `global-setup.ts:12-13` | Gitignored test files | Hardcoded passwords in test files | Use env vars for test credentials |

### 7.9 Rate Limiting

| Endpoint | Current Rate Limit | Risk | Recommendation |
|----------|-------------------|------|----------------|
| Login (`/api/auth`) | 5 attempts / 15 min / per-Lambda | Medium | Upstash Redis |
| `POST /api/analytics` | **NONE** | **CRITICAL** | Implement immediately |
| `POST /api/analytics/events` | Body size only (8KB) | High | Add IP-based rate limiting |
| All other POST/PUT/DELETE | Session acts as implicit limit | Low | Sufficient for current scale |
| `GET /api/health` | None | Low | Add simple rate limit if needed |

### 7.10 Session Security

| Aspect | Current | Gap | Recommendation |
|--------|---------|-----|----------------|
| Session strategy | JWT (not database sessions) | No server-side revocation | Add session revocation on password change |
| Cookie flags | NextAuth defaults | No explicit `Secure`, `HttpOnly`, `SameSite` | Set explicitly in NextAuth config |
| Session expiry | NextAuth default (30 days) | Long-lived sessions | Reduce to 24 hours for admin |
| Session refresh | None | Session expires mid-workflow | Implement refresh callback |

### 7.11 Upload Security

| Aspect | Current | Gap | Recommendation |
|--------|---------|-----|----------------|
| File type validation | Client-side via `accept` prop | Server doesn't re-validate | Validate MIME type on server |
| File size validation | None | Large files could exhaust storage | Add max size check |
| Malicious file upload | Cloudinary scans files | No additional scan | Trust Cloudinary's scanning |
| Upload preset | Server-side preset | Preset configuration is public | Verify preset restricts transformations |

### 7.12 Dependency Risks

| Package | Risk | Mitigation |
|---------|------|------------|
| `next` 16.2.9 | Breaking changes from 15.x | Follow AGENTS.md upgrade guide |
| `mongoose` 8.24.0 | Schema validation changes | Test all queries after updates |
| `zod` 4.3.6 | Breaking changes from 3.x | Already migrated, regression tested |
| `next-auth` 4.24.14 | EOL (v5 is current) | Plan migration to Auth.js |
| `gsap` 3.15.0 | License requires paid plan for commercial use | Verify license compliance |
| `@tiptap/react` 3.22.4 | MIT license | Safe |

### 7.13 Supply Chain Risks

| Risk | Current Mitigation | Gap | Recommendation |
|------|-------------------|-----|----------------|
| npm package compromise | `package-lock.json` committed | No `npm audit` in CI | Add `npm audit --audit-level=high` to CI |
| Typosquatting | Manual dependency review | No automated scanning | Use Socket.dev or Snyk |
| Malicious postinstall scripts | No restriction | `npm install` runs arbitrary scripts | Use `--ignore-scripts` + audit |
| Lock file tampering | Git-tracked lock file | No integrity verification | Add hash verification to CI |

### 7.14 CSP Analysis

**Current CSP (from `next.config.ts:29-31`):**
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self';
connect-src 'self' https://api.cloudinary.com;
frame-src 'self' https://res.cloudinary.com https://*.google.com https://*.vimeo.com https://*.mux.com https://drive.google.com;
```

**Gaps:**
- `'unsafe-eval'` and `'unsafe-inline'` in script-src weaken XSS protection (required for Next.js dev but risky in production)
- `img-src` allows ALL https sources (should be restricted to known CDN domains)
- No `worker-src` or `manifest-src` directives
- No `base-uri` restriction

**Recommendation:** Remove `'unsafe-eval'` in production builds. Restrict `img-src` to specific CDN domains.

---

## PART XX — ENGINEERING DECISION ENGINE

### 8.1 Decision: Migrate from NextAuth v4 to Auth.js (v5)

**When should we do it?** Within 6 months. NextAuth v4 is in maintenance mode.
**Why?** Security patches, new features, better Next.js 16 integration.
**Tradeoffs:**
- Pro: Better App Router support, built-in CSRF protection, session management
- Con: Breaking API changes, requires rewriting auth configuration
**Alternatives:** Keep NextAuth v4 (risky long-term), switch to Lucia Auth (smaller ecosystem)
**Migration cost:** 2-3 days (auth.ts rewrite, proxy.ts update, session handling changes)
**Risk:** Medium - auth is critical path, but API is well-documented
**Expected ROI:** High - better security posture, community support, future-proofing
**Engineering complexity:** Medium - mostly mechanical changes
**Business impact:** Low - no user-facing changes, admin must re-login

### 8.2 Decision: Implement Soft Delete (TD-001)

**When should we do it?** Before any bulk operations feature is used in production.
**Why?** Currently, DELETE permanently removes data with no recovery option. Cloudinary cleanup can leak assets.
**Tradeoffs:**
- Pro: Data recovery, audit trail, safer bulk operations
- Con: Added query complexity, storage growth, UI changes needed
**Alternatives:** Manual MongoDB backup before delete (fragile)
**Migration cost:** 4-8 hours
**Risk:** Low - additive change, no existing behavior modified
**Expected ROI:** High - prevents irreversible data loss
**Engineering complexity:** Low - add `deletedAt` field + filter queries
**Business impact:** Medium - admin can recover accidentally deleted projects

### 8.3 Decision: Add Service Layer (TD-002)

**When should we do it?** When adding a second editor, or when test coverage reaches 80%.
**Why?** Current code has business logic scattered across API routes and components.
**Tradeoffs:**
- Pro: Testable business logic, reusable across routes, cleaner API routes
- Con: Additional abstraction layer, more files, learning curve
**Alternatives:** Keep current pattern (logic in routes), extract only the most repeated patterns
**Migration cost:** 16-24 hours
**Risk:** Medium - refactoring touches many files
**Expected ROI:** Medium - improves testability and maintainability
**Engineering complexity:** Medium - requires careful extraction to avoid breaking changes
**Business impact:** Low - internal improvement only

### 8.4 Decision: Add Bulk Action UI (TD-004)

**When should we do it?** When managing >10 projects.
**Why?** API supports bulk operations but no UI implements them.
**Tradeoffs:**
- Pro: Faster content management, batch publish/unpublish/delete
- Con: Complex UI (selection, confirmation, progress), more test surface
**Alternatives:** Keep single-item operations
**Migration cost:** 8-12 hours
**Risk:** Low - additive UI feature
**Expected ROI:** Medium - improves admin productivity
**Engineering complexity:** Medium - selection state, optimistic updates, error handling
**Business impact:** Medium - faster content workflow

### 8.5 Decision: Implement Unsaved Changes on Soft Navigation (TD-005)

**When should we do it?** Before any non-technical editor uses the admin panel.
**Why?** Currently only `beforeunload` is intercepted. Users can navigate away from unsaved forms via Next.js Link.
**Tradeoffs:**
- Pro: Prevents data loss, standard UX pattern
- Con: Requires intercepting Next.js navigation, more complex routing logic
**Alternatives:** Auto-save (more complex but better UX)
**Migration cost:** 4-8 hours
**Risk:** Low - only affects admin navigation
**Expected ROI:** High - prevents data loss
**Engineering complexity:** Low-Medium - use `beforeRouteLeave` pattern or Next.js `useRouter` events
**Business impact:** High - prevents frustrating data loss for editors

---

# VOLUME IV — REFACTORING, TIMELINE, AND GOVERNANCE

## PART XXI — REFACTORING HANDBOOK

### 9.1 `src/components/admin/MediaFields.tsx` (420 lines)

**Current architecture:** Single monolithic component with 14 props, mixing media upload, video preview, gallery management, and type auto-detection.

**Ideal architecture:** Compound component pattern with context.

```
<MediaSection>
  <MediaSection.Upload />      -- Cloudinary/URL input
  <MediaSection.Gallery />     -- Gallery reorder
  <MediaSection.Video />       -- Video + poster management
  <MediaSection.Readiness />   -- Readiness indicators
</MediaSection>
```

**Intermediate architecture:** Extract `useMediaFields` hook for state management.

**Migration path:**
1. Extract `useMediaFields` hook from component (move useEffect + state to hook)
2. Split into `MediaUploadSection`, `MediaGallerySection`, `MediaVideoSection`
3. Create `MediaSectionContext` to share state between sub-components
4. Update `ProjectEditor.tsx` to use new compound component

**Estimated effort:** 8-12 hours
**Breaking changes:** None if intermediate step is used as migration
**Safe rollout strategy:** Feature flag the new component, run side-by-side with old

### 9.2 `src/components/admin/ProjectEditor.tsx` (237 lines)

**Current architecture:** Hub component managing form state, validation, slug generation, readiness checks, and composing 7 sub-components.

**Ideal architecture:** Separated concerns.

```
useProjectForm()     -- RHF form setup, default values, validation
useProjectSlug()     -- Slug auto-generation logic
useProjectReadiness() -- Readiness checking
useProjectSave()     -- Save/publish logic with API calls
```

**Intermediate architecture:** Extract `useProjectForm` hook.

**Migration path:**
1. Extract `useProjectForm` hook (lines 37-130)
2. Extract `useProjectSlug` hook (lines 131-140)
3. Extract `useProjectReadiness` hook (lines 155-170)
4. Simplify ProjectEditor to compose hooks + sub-components

**Estimated effort:** 4-6 hours
**Breaking changes:** None if hooks are internal
**Safe rollout strategy:** Extract one hook at a time, verify tests pass

### 9.3 `src/app/api/analytics/summary/route.ts` (260 lines)

**Current architecture:** Single route file with 14 parallel DB queries, complex aggregation pipelines, and response formatting.

**Ideal architecture:** Service layer.

```
analytics/
  summary-service.ts    -- Business logic
  aggregation-pipelines.ts -- MongoDB pipeline definitions
  route.ts             -- Thin HTTP handler
```

**Intermediate architecture:** Extract aggregation pipelines into separate functions.

**Migration path:**
1. Extract pipeline definitions into `analytics/pipelines.ts`
2. Extract summary computation into `analytics/summary-service.ts`
3. Reduce from 14 queries to 3-5 by pre-aggregating
4. Add TTL index to Analytics collection

**Estimated effort:** 8-12 hours
**Breaking changes:** None - internal refactor only
**Safe rollout strategy:** Run old and new in parallel, compare results

### 9.4 `src/lib/db.ts` (Connection Singleton)

**Current architecture:** Module-level cache with custom DNS SRV resolution in dev.

**Ideal architecture:** Connection factory with health checks.

**Migration path:**
1. Add connection health check endpoint
2. Add retry logic with exponential backoff
3. Add connection pool monitoring
4. Remove custom DNS SRV resolution (use native Node.js DNS)

**Estimated effort:** 4-6 hours
**Breaking changes:** None
**Safe rollout strategy:** Add monitoring first, then refactor

### 9.5 `src/app/api/projects/[id]/route.ts` (Field-Guard Merge)

**Current architecture:** Complex field-by-field merge logic (lines 117-152) with guards for empty arrays, empty strings, and SEO deep merge.

**Ideal architecture:** Schema-aware merge utility.

```
function mergeProjectData(existing, incoming, schema) {
  // Use Zod schema to determine which fields to merge
  // Array fields: merge (deduplicate)
  // String fields: overwrite if non-empty
  // Object fields: deep merge
  // Boolean/number fields: always overwrite
}
```

**Migration path:**
1. Document the current merge behavior (it's implicit)
2. Create a `mergeProjectData` utility function
3. Replace inline merge logic with utility call
4. Add tests for merge edge cases

**Estimated effort:** 4-6 hours
**Breaking changes:** None if behavior is preserved
**Safe rollout strategy:** Write tests for current behavior first, then refactor to match

---

## PART XXII — ENGINEERING TIMELINE

### 10.1 Phase 1: Current MVP (Completed)

**Scope:** Portfolio website with admin CMS, project management, and basic analytics.

**What exists:**
- Next.js 16 + React 19 + TypeScript 5
- MongoDB Atlas (M0 free tier) with Mongoose 8
- Cloudinary media management
- NextAuth v4 with credentials provider
- Admin dashboard (projects, content, analytics)
- Public marketing pages (home, projects, showreel, contact)
- Basic analytics tracking
- ISR for public pages
- 190 tests (unit + integration + regression + E2E)

**What's missing:**
- Soft delete
- Service layer
- Bulk operations UI
- Soft navigation unsaved changes
- CI/CD pipeline
- Monitoring/alerting
- Rate limiting (beyond in-memory)
- Multi-editor support

### 10.2 Phase 2: Production Hardening (Current)

**Goal:** Make the MVP production-safe and maintainable.

**Changes needed:**
- Rotate all secrets on Vercel (manual step)
- BFG Repo-Cleaner to remove secrets from git history
- Add TTL indexes to Analytics and ActivityLog
- Reduce Analytics indexes from 9 to 5
- Implement rate limiting with Upstash Redis
- Add CSP hardening (remove `unsafe-eval` in production)
- Add env var validation at startup
- Add health check endpoint with DB connectivity

**Timeline:** 1-2 weeks
**Priority:** HIGH - security and data integrity

### 10.3 Phase 3: Team Collaboration (Next)

**Goal:** Support multiple editors working simultaneously.

**Changes needed:**
- Optimistic locking (version field on documents)
- Conflict resolution UI (show conflicts, let user choose)
- Role-based access control (admin vs editor vs viewer)
- Activity log enhancement (who did what, when)
- Soft delete implementation
- Undo/redo for content changes
- Auto-save for long forms

**Timeline:** 2-4 weeks
**Priority:** MEDIUM - needed before onboarding additional editors

### 10.4 Phase 4: Enterprise CMS (Future)

**Goal:** Full-featured content management system.

**Changes needed:**
- Service layer extraction
- Content scheduling (publish at specific time)
- Content versioning (full history, not just status changes)
- Content approval workflow (draft -> review -> approved -> published)
- Multi-language support (bilingual is partially implemented)
- Content templates
- Content import/export
- API rate limiting per user
- Webhook support (content changed -> notify external service)

**Timeline:** 4-8 weeks
**Priority:** LOW - not needed until enterprise clients

### 10.5 Phase 5: Headless Platform (Far Future)

**Goal:** Expose portfolio as a headless CMS API.

**Changes needed:**
- Public API documentation (OpenAPI/Swagger)
- API key management
- API rate limiting per key
- Content delivery API (separate from admin API)
- Webhook system
- Plugin architecture
- Custom field types
- Content relationships

**Timeline:** 8-12 weeks
**Priority:** LOW - only if monetizing the platform

### 10.6 Phase 6: Distributed Platform (Vision)

**Goal:** Multi-tenant portfolio platform.

**Changes needed:**
- Tenant isolation (separate databases or shared with tenant ID)
- Tenant management UI
- Custom domain per tenant
- Billing integration
- Usage analytics per tenant
- Content migration tools
- Multi-region deployment
- Edge functions for tenant-specific logic

**Timeline:** 12-24 weeks
**Priority:** VISION - long-term goal

---

## PART XXIII — ENGINEERING PLAYBOOKS

### 11.1 Onboarding a New Engineer

**Prerequisites:** Node.js 20+, npm, Git, MongoDB Atlas access, Vercel access.

**Step 1: Clone and Setup**
```bash
git clone https://github.com/Amryousryy/amr-yousry-portfolio.git
cd amr-yousry-portfolio
cp .env.example .env.local
# Fill in env vars (ask team lead for values)
npm install
npm run dev
```

**Step 2: Verify Setup**
```bash
# Open http://localhost:3000 (public site)
# Open http://localhost:3001/admin (admin dashboard)
# Login with credentials from .env.local
# Create a test project, verify CRUD works
npm run test  # Run all 190 tests
npm run lint  # Check code style
```

**Step 3: Read These Files (in order)**
1. `AGENTS.md` - Next.js 16 rules and breaking changes
2. `docs/ENGINEERING-INTELLIGENCE-SYSTEM.md` - This document
3. `src/lib/db.ts` - Database connection
4. `src/lib/auth.ts` - Authentication
5. `src/models/Project.ts` - Core data model
6. `src/app/api/projects/route.ts` - Example API route
7. `src/components/admin/ProjectEditor.tsx` - Complex form example

**Step 4: First Contribution**
- Pick a task from the technical debt list (TD-001 through TD-005)
- Follow the refactoring handbook (Part XXI)
- Run full test suite before submitting PR
- Request review from team lead

### 11.2 First Production Deployment

**Prerequisites:** Vercel account, MongoDB Atlas cluster, Cloudinary account.

**Step 1: Environment Setup**
1. Create Vercel project linked to GitHub repo
2. Add all env vars from `.env.example` to Vercel Dashboard
3. Configure MongoDB Atlas network access (allow Vercel IPs)
4. Configure Cloudinary upload preset

**Step 2: Deploy**
```bash
git push origin main  # Vercel auto-deploys from main
```

**Step 3: Verify**
1. Check Vercel build logs for errors
2. Visit production URL, verify public pages load
3. Login to admin, verify CRUD works
4. Check `/api/health` returns `{"status":"ok"}`
5. Verify analytics tracking (visit a page, check admin dashboard)

**Step 4: Post-Deploy**
1. Update `metadataBase` in `next.config.ts` if custom domain
2. Submit sitemap to Google Search Console
3. Test all social sharing preview cards
4. Monitor Vercel Analytics for errors

### 11.3 Incident Response

**Severity Levels:**
- **P0 (Critical):** Site completely down, data loss, security breach
- **P1 (High):** Major feature broken, significant performance degradation
- **P2 (Medium):** Minor feature broken, workaround available
- **P3 (Low):** Cosmetic issue, non-urgent

**Response Steps:**
1. **Acknowledge** - Post in team channel: "Investigating [issue]"
2. **Assess** - Check Vercel status, MongoDB Atlas status, Cloudinary status
3. **Diagnose** - Check Vercel function logs, MongoDB Atlas logs
4. **Mitigate** - Rollback if code change, fix env var if config issue
5. **Communicate** - Update team on status
6. **Resolve** - Confirm fix, monitor for recurrence
7. **Document** - Post-mortem for P0/P1 incidents

### 11.4 Hotfix Release

**When:** P0/P1 production issue that cannot wait for normal release.

**Steps:**
1. Create hotfix branch: `git checkout -b hotfix/issue-description`
2. Make minimal fix (smallest possible change)
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Commit: `git commit -m "fix: [description]"`
6. Push: `git push origin hotfix/issue-description`
7. Create PR, get review, merge to main
8. Vercel auto-deploys from main
9. Verify fix on production
10. Delete hotfix branch

### 11.5 Feature Release

**When:** New feature that's ready for production.

**Steps:**
1. Ensure feature branch is up to date with main
2. Run full test suite: `npm run test`
3. Run E2E tests: `npm run test:e2e`
4. Run lint: `npm run lint`
5. Manual QA on localhost:3001
6. Create PR with description
7. Get review (at least 1 approval)
8. Squash merge to main
9. Vercel auto-deploys
10. Monitor Vercel Analytics for errors
11. Update CHANGELOG.md

### 11.6 Rollback

**When:** New deployment causes P0/P1 issue.

**Steps:**
1. Go to Vercel Dashboard -> Deployments
2. Find the last working deployment
3. Click "..." -> "Promote to Production"
4. Verify site works with old deployment
5. Investigate what broke
6. Fix on a new branch
7. Deploy fix, verify, promote

**Alternative (git revert):**
```bash
git revert HEAD  # Revert last commit
git push origin main  # Vercel auto-deploys
```

### 11.7 Database Restore

**When:** Data corruption or accidental deletion.

**Prerequisites:** MongoDB Atlas backup enabled (continuous backups recommended).

**Steps:**
1. Go to MongoDB Atlas -> Cluster -> Backups
2. Find the point-in-time restore point (before the incident)
3. Click "Restore" -> Choose "Point-in-Time Restore"
4. Wait for restore to complete (5-30 minutes)
5. Update `MONGODB_URI` to point to restored cluster (if new cluster)
6. Verify data integrity
7. Redeploy Vercel to clear ISR cache

**Prevention:** Enable continuous backups on MongoDB Atlas. Cost: ~$2/day for M10.

### 11.8 Secret Compromise

**When:** Any secret (password, API key, connection string) is exposed.

**Immediate steps:**
1. Rotate the compromised secret immediately (Vercel Dashboard)
2. If `NEXTAUTH_SECRET` compromised: all sessions invalidated, users must re-login
3. If `ADMIN_PASSWORD` compromised: change password, check activity logs
4. If `MONGODB_URI` compromised: change password on MongoDB Atlas, update Vercel
5. If `CLOUDINARY_API_SECRET` compromised: regenerate on Cloudinary dashboard

**Post-incident:**
1. Check activity logs for unauthorized access
2. Check MongoDB Atlas for unauthorized queries
3. Check Cloudinary for unauthorized uploads
4. Run `git log --all --oneline` to check for unauthorized commits
5. Review `.gitignore` to ensure secrets are not tracked
6. Consider BFG Repo-Cleaner if secrets were in git history

### 11.9 Production Outage

**When:** Site is completely unreachable.

**Diagnostic steps:**
1. Check `https://amr-yousry-portfolio.vercel.app/api/health`
2. Check Vercel status page: `https://www.vercel-status.com`
3. Check MongoDB Atlas status: `https://status.mongodb.com`
4. Check Cloudinary status: `https://status.cloudinary.com`
5. Check Vercel function logs for errors
6. Check DNS resolution: `nslookup amr-yousry-portfolio.vercel.app`

**Common causes and fixes:**
| Cause | Symptom | Fix |
|-------|---------|-----|
| Vercel outage | 502/503 errors | Wait for Vercel to resolve |
| MongoDB Atlas paused | Empty data, fallback content | Resume cluster on Atlas dashboard |
| Env var missing | 500 errors on specific features | Add missing env var to Vercel |
| DNS failure | Cannot resolve hostname | Wait for DNS propagation |
| Build failure | Last deployment shows error | Fix build error, push new commit |

### 11.10 Cloudinary Outage

**When:** Media uploads fail, images/videos don't load.

**Impact:** Admin cannot upload new media. Existing media still serves from CDN cache.
**Mitigation:** Existing content remains functional (Cloudinary CDN has its own cache).
**Recovery:** Wait for Cloudinary to resolve. No action needed on our side.
**Prevention:** Use Cloudinary's redundancy features. Consider backup storage (S3).

### 11.11 MongoDB Outage

**When:** Database queries fail, admin dashboard shows empty data.

**Impact:** Public pages show static fallback content. Admin pages show errors.
**Mitigation:** `public-homepage-content.ts` and `public-contact-content.ts` fall back to static data.
**Recovery:** Resume MongoDB Atlas cluster. If cluster is deleted, restore from backup.
**Prevention:** Enable continuous backups. Upgrade to M10 for better SLA.

### 11.12 Authentication Outage

**When:** Login fails for all users, admin is locked out.

**Impact:** Admin cannot access dashboard. Public site unaffected.
**Mitigation:** None - single auth provider, no fallback.
**Recovery:** Check `NEXTAUTH_SECRET` is set. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Restart Vercel deployment.
**Prevention:** Monitor auth endpoint with synthetic tests. Consider backup auth method.

---

## PART XXIV — ENGINEERING GOVERNANCE

### 12.1 Coding Laws

#### Law 1: No Production Secrets in Code

**Purpose:** Prevent credential leakage.
**Example violation:** `const password = "123456"` in source code.
**Consequences:** Security breach, immediate credential rotation, potential data loss.
**Enforcement:** `.gitignore` excludes `.env.local`. Code review checklist.

#### Law 2: All User Input Must Be Validated

**Purpose:** Prevent injection attacks and data corruption.
**Example violation:** Passing `req.body` directly to Mongoose without Zod validation.
**Consequences:** Invalid data in database, potential NoSQL injection.
**Enforcement:** All API routes must validate with Zod or manual checks. Code review.

#### Law 3: No `any` Types in New Code

**Purpose:** Maintain type safety.
**Example violation:** `const data: any = await fetch(...)`.
**Consequences:** Runtime errors that TypeScript could catch at compile time.
**Enforcement:** ESLint rule `@typescript-eslint/no-explicit-any`. Code review.

#### Law 4: Every API Route Must Have Error Handling

**Purpose:** Prevent unhandled exceptions from crashing the server.
**Example violation:** No try/catch around `req.json()`.
**Consequences:** 500 error on malformed JSON, poor user experience.
**Enforcement:** Code review checklist. ESLint rule for unhandled promises.

#### Law 5: Every Public Page Must Have a Fallback

**Purpose:** Graceful degradation when database is unavailable.
**Example violation:** No fallback in `public-homepage-content.ts`.
**Consequences:** Blank page or error when MongoDB is down.
**Enforcement:** Code review. Test with MongoDB connection disabled.

### 12.2 Architecture Laws

#### Law 6: Server and Client Components Must Be Clearly Separated

**Purpose:** Prevent hydration mismatches and performance issues.
**Example violation:** `"use client"` on a component that only uses server data.
**Consequences:** Unnecessary JavaScript sent to client, slower page loads.
**Enforcement:** Code review. Next.js lint rules.

#### Law 7: Database Queries Must Use Existing Indexes

**Purpose:** Prevent slow queries and database overload.
**Example violation:** `Project.find({ clientName: "test" })` without an index on `clientName`.
**Consequences:** Full collection scan, slow response times, Lambda timeouts.
**Enforcement:** Code review. MongoDB Atlas slow query alerts.

#### Law 8: No Orphaned Database Assets

**Purpose:** Prevent storage waste and cost overruns.
**Example violation:** Deleting a project without cleaning up Cloudinary assets.
**Consequences:** Cloudinary storage costs increase, orphaned assets accumulate.
**Enforcement:** Code review. Periodic cleanup script.

#### Law 9: All Schema Changes Must Be Backward-Compatible

**Purpose:** Prevent breaking existing data.
**Example violation:** Adding `required: true` to an existing field.
**Consequences:** Existing documents fail validation, data becomes inaccessible.
**Enforcement:** Code review. Migration checklist.

#### Law 10: Client-Side Code Must Handle Loading and Error States

**Purpose:** Good user experience during async operations.
**Example violation:** No loading spinner while data is fetching.
**Consequences:** Users see blank pages or stale data, confusion.
**Enforcement:** Code review. React Query provides loading/error states by default.

### 12.3 Review Laws

#### Law 11: Every PR Must Pass CI Before Merge

**Purpose:** Prevent broken code from reaching production.
**Example violation:** Merging without running tests.
**Consequences:** Production outage, emergency rollback.
**Enforcement:** GitHub branch protection rules (when CI is set up).

#### Law 12: Security-Sensitive Changes Require Two Approvals

**Purpose:** Extra scrutiny for auth, validation, and data handling changes.
**Example violation:** Merging auth.ts change with single approval.
**Consequences:** Potential security vulnerability introduced.
**Enforcement:** GitHub CODEOWNERS for sensitive files.

#### Law 13: Every PR Must Include Tests for New Features

**Purpose:** Maintain test coverage and prevent regressions.
**Example violation:** Merging new API route without tests.
**Consequences:** Untested code breaks in production, no safety net.
**Enforcement:** Code review checklist.

### 12.4 Testing Laws

#### Law 14: Test the Contract, Not the Implementation

**Purpose:** Tests should survive refactoring.
**Example violation:** Testing internal function names or implementation details.
**Consequences:** Tests break on every refactor, developers stop trusting tests.
**Enforcement:** Testing guidelines in README.

#### Law 15: Integration Tests Must Cover All CRUD Operations

**Purpose:** Verify data round-trip integrity.
**Example violation:** Only testing create, not update or delete.
**Consequences:** Silent data corruption or loss on untested operations.
**Enforcement:** Code review. Test coverage reports.

#### Law 16: Regression Tests Must Be Permanent

**Purpose:** Once a bug is found and fixed, the test stays forever.
**Example violation:** Removing a regression test after "fixing" the bug.
**Consequences:** Bug regresses, user trust is lost.
**Enforcement:** Code review. Test names must reference the bug/ticket.

### 12.5 Deployment Laws

#### Law 17: Never Deploy on Friday Afternoon

**Purpose:** Prevent weekend incidents with no on-call support.
**Example violation:** Merging a risky change at 4pm Friday.
**Consequences:** Weekend outage, no one available to fix.
**Enforcement:** Team policy.

#### Law 18: Every Deploy Must Be Monitored for 15 Minutes

**Purpose:** Catch issues early before they affect many users.
**Example violation:** Deploying and immediately going to lunch.
**Consequences:** Silent outage affects all users.
**Enforcement:** Team policy. Post-deploy checklist.

#### Law 19: Rollback Must Be Possible Within 5 Minutes

**Purpose:** Minimize incident duration.
**Example violation:** Deploying a database migration that cannot be rolled back.
**Consequences:** Extended outage while manual fix is applied.
**Enforcement:** Architecture review for all deploy-related changes.

### 12.6 Documentation Laws

#### Law 20: Every Breaking Change Must Be Documented

**Purpose:** Help other developers understand what changed and why.
**Example violation:** Renaming an API endpoint without updating documentation.
**Consequences:** Other developers waste time debugging broken integrations.
**Enforcement:** CHANGELOG.md update required for every PR.

#### Law 21: This Engineering Intelligence System Must Be Updated When Code Changes

**Purpose:** Keep the knowledge base accurate.
**Example violation:** Moving a file without updating its dependency graph entry.
**Consequences:** New developers follow outdated information, make wrong decisions.
**Enforcement:** PR checklist: "Does this change affect the Engineering Intelligence System?"

### 12.7 Security Laws

#### Law 22: All Authentication Changes Must Be Tested Against Attack Vectors

**Purpose:** Ensure security is not weakened by changes.
**Example violation:** Removing rate limiting "for performance."
**Consequences:** Brute force attacks become possible.
**Enforcement:** Security review for auth changes.

#### Law 23: Secrets Must Never Appear in Logs, Error Messages, or URLs

**Purpose:** Prevent credential leakage through side channels.
**Example violation:** `console.log(process.env.ADMIN_PASSWORD)`.
**Consequences:** Credentials visible in Vercel function logs, browser console.
**Enforcement:** ESLint rule for `process.env` in console.log. Code review.

#### Law 24: CORS, CSP, and Security Headers Must Not Be Weakened

**Purpose:** Maintain defense-in-depth security posture.
**Example violation:** Adding `'unsafe-eval'` to CSP without justification.
**Consequences:** XSS attacks become easier.
**Enforcement:** Code review. Automated header check in tests.

### 12.8 Performance Laws

#### Law 25: New API Routes Must Have Pagination or Limits

**Purpose:** Prevent unbounded data transfer and memory usage.
**Example violation:** `Project.find({})` without `.limit()`.
**Consequences:** Lambda OOM, slow response, high memory usage.
**Enforcement:** Code review. Test with large datasets.

#### Law 26: Client-Side Bundle Size Must Not Increase Without Justification

**Purpose:** Maintain fast page loads.
**Example violation:** Adding a 100KB library for a minor feature.
**Consequences:** Slower page loads, worse Core Web Vitals.
**Enforcement:** Bundle size check in CI (when set up).

#### Law 27: Database Queries Must Complete Within 100ms

**Purpose:** Maintain responsive user experience.
**Example violation:** Complex aggregation without proper indexes.
**Consequences:** Slow page loads, Lambda timeouts.
**Enforcement:** MongoDB Atlas slow query alerts. Code review.

---

## PART XXV — CTO REFERENCE

### 13.1 Current Technical Maturity

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Code Quality** | 7/10 | TypeScript strict mode, ESLint, consistent patterns. But: 3 unused components, interface/schema mismatches. |
| **Test Coverage** | 6/10 | 190 tests across 4 frameworks. But: no component tests, no analytics tests, no settings tests. |
| **Security** | 5/10 | Auth with timing-safe comparison, CSP headers. But: unauthenticated analytics POST, in-memory rate limiting, secrets in git history. |
| **Performance** | 7/10 | ISR for public pages, optimized images, lazy loading. But: 14 parallel analytics queries, 7 watch() re-renders, unused GSAP. |
| **Documentation** | 8/10 | This Engineering Intelligence System. But: no API docs, no README for non-engineers. |
| **DevOps** | 3/10 | No CI/CD, no monitoring, no alerting, no staging environment. |
| **Scalability** | 4/10 | Works for current scale (~5 projects, ~1K visitors). But: regex search, unbounded analytics, skip-based pagination. |

**Overall: 5.7/10** - Solid MVP, significant gaps in operations and security.

### 13.2 Technical Strengths

1. **Modern Stack:** Next.js 16 + React 19 + TypeScript 5 + Zod 4 - latest versions of all major dependencies
2. **Type Safety:** `strict: true` in tsconfig, Zod schemas for all API inputs, Mongoose schema validation
3. **Security Headers:** Full set of security headers including HSTS, CSP, X-Frame-Options
4. **ISR Strategy:** Public pages are statically generated with 60s revalidation - excellent performance
5. **Test Foundation:** 190 tests across 4 frameworks, regression tests for known bugs, E2E tests for critical flows
6. **Data Validation:** Dual validation (Zod in API routes + readiness checks before publish)
7. **Audit Trail:** Activity logging for all CRUD operations
8. **Bilingual Support:** Content supports English/Arabic with normalization
9. **Media Pipeline:** Cloudinary integration with dual-mode upload (widget + URL)
10. **Clean Architecture:** Clear separation of models, validation, API routes, and components

### 13.3 Technical Weaknesses

1. **No CI/CD:** No automated testing, linting, or deployment pipeline
2. **No Monitoring:** No error tracking, no performance monitoring, no uptime checks
3. **No Rate Limiting:** Critical gap on unauthenticated analytics endpoints
4. **No Soft Delete:** Permanent deletion with no recovery option
5. **No Service Layer:** Business logic scattered across API routes and components
6. **Secrets in Git History:** 7 real secrets in old commits, BFG cleanup needed
7. **Interface/Schema Mismatches:** TypeScript interfaces diverge from Mongoose schemas
8. **No Staging Environment:** All changes go directly to production
9. **Unused Code:** 3 components imported nowhere, dead code accumulating
10. **Single Point of Failure:** Single admin user, no backup auth method

### 13.4 Strategic Priorities

| Priority | Item | Impact | Effort | Timeline |
|----------|------|--------|--------|----------|
| **1** | Rotate Vercel secrets + BFG git history | Security | 2h | This week |
| **2** | Add CI/CD pipeline | Quality | 4h | This week |
| **3** | Add analytics rate limiting | Security | 2h | This week |
| **4** | Add TTL indexes to Analytics | Data integrity | 1h | This week |
| **5** | Remove unused code | Maintainability | 1h | This week |
| **6** | Fix interface/schema mismatches | Type safety | 2h | Next week |
| **7** | Add monitoring (Sentry + uptime) | Observability | 4h | Next week |
| **8** | Implement soft delete | Data safety | 8h | Next sprint |
| **9** | Add service layer | Architecture | 24h | Next sprint |
| **10** | Upgrade MongoDB to M10 | Reliability | $57/mo | When exceeding 512MB |

### 13.5 Architecture Roadmap

```
Current (MVP)
    |
    v
Production Hardening (Week 1-2)
    - Secrets rotation, CI/CD, rate limiting, monitoring
    |
    v
Team Collaboration (Week 3-6)
    - Soft delete, service layer, optimistic locking, RBAC
    |
    v
Enterprise CMS (Month 2-3)
    - Content scheduling, versioning, approval workflow, webhooks
    |
    v
Headless Platform (Month 4-6)
    - Public API, API keys, content delivery, plugin system
    |
    v
Distributed Platform (Month 6-12)
    - Multi-tenant, billing, custom domains, edge functions
```

### 13.6 Hiring Priorities

| Role | When | Why | Cost Estimate |
|------|------|-----|---------------|
| **DevOps Engineer** | Now | CI/CD, monitoring, infrastructure | $80-120K/year |
| **Senior Frontend Engineer** | Month 2 | React architecture, performance optimization | $100-150K/year |
| **Backend Engineer** | Month 3 | Service layer, API design, database optimization | $100-150K/year |
| **Security Engineer** | Month 6 | Penetration testing, security audit, compliance | $120-180K/year |

**For solo developer (current):** Focus on priorities 1-5, then tackle 6-10 incrementally.

### 13.7 Engineering KPIs

| KPI | Current | Target (3 months) | Target (6 months) |
|-----|---------|-------------------|-------------------|
| **Test Coverage** | 60% (estimated) | 80% | 90% |
| **Build Time** | ~60s | <45s | <30s |
| **API Response Time** | 500ms avg | <200ms | <100ms |
| **Page Load Time** | ~1s | <500ms | <300ms |
| **Uptime** | Unknown | 99.9% | 99.99% |
| **Mean Time to Recovery** | Unknown | <30min | <15min |
| **Deployment Frequency** | Manual | Daily | On-demand |
| **Bug Escape Rate** | Unknown | <1/month | <1/quarter |

### 13.8 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| MongoDB Atlas free tier pause | **High** | High | Upgrade to M10 ($57/month) |
| NextAuth v4 EOL vulnerability | **Medium** | High | Migrate to Auth.js within 6 months |
| Git history secret exposure | **High** | Critical | BFG Repo-Cleaner immediately |
| Cloudinary service outage | **Low** | Medium | CDN cache provides resilience |
| Vercel platform outage | **Low** | High | Multi-region deployment (future) |
| Single developer bus factor | **Medium** | Critical | Documentation + knowledge transfer |
| No CI/CD allows broken deploys | **High** | Medium | Set up GitHub Actions this week |

### 13.9 Recommended Investments

| Investment | Cost | ROI | Priority |
|------------|------|-----|----------|
| MongoDB Atlas M10 | $57/month | Prevents auto-pause, better SLA, backups | **Immediate** |
| Vercel Pro | $20/month | Better analytics, team features, support | **Immediate** |
| Sentry (error tracking) | Free tier | Catch errors in production | **This week** |
| Upstash Redis | Free tier | Rate limiting, session storage | **This week** |
| GitHub Actions | Free | CI/CD pipeline | **This week** |
| Custom domain | ~$15/year | Professional branding | **When ready** |

### 13.10 Recommended Next Milestones

**Week 1-2:** Production Hardening
- [ ] Rotate all Vercel secrets
- [ ] BFG Repo-Cleaner for git history
- [ ] Set up GitHub Actions CI/CD
- [ ] Add analytics rate limiting
- [ ] Add TTL indexes
- [ ] Remove unused code
- [ ] Add Sentry error tracking

**Week 3-4:** Quality Foundation
- [ ] Fix interface/schema mismatches
- [ ] Add settings API tests
- [ ] Add analytics API tests
- [ ] Add component tests for ProjectEditor
- [ ] Add staging environment on Vercel

**Month 2:** Architecture Improvement
- [ ] Implement soft delete
- [ ] Extract service layer for projects
- [ ] Add optimistic locking
- [ ] Implement soft navigation unsaved changes

**Month 3:** Feature Expansion
- [ ] Add bulk action UI
- [ ] Add content scheduling
- [ ] Implement content versioning
- [ ] Add multi-editor support with RBAC

**Month 6:** Platform Evolution
- [ ] Migrate to Auth.js
- [ ] Add public API documentation
- [ ] Implement API key management
- [ ] Add webhook support

---

## APPENDIX: Cross-Reference Index

### Files Referenced in This Document

| File | Parts Referenced | Line Numbers |
|------|-----------------|--------------|
| `src/lib/db.ts` | XIII, XIV, XV, XVI, XVII, XVIII, XXI | L28-50 (DNS SRV), L15 (dependents) |
| `src/lib/auth.ts` | XIII, XIV, XV, XVI, XIX | L63 (timing-safe), L111 (secret), L49 (password) |
| `src/lib/validation/index.ts` | XIII, XV, XVII | L12 (dependents) |
| `src/lib/validation/shared.ts` | XV, XIX | L66-78 (safeUrlSchema) |
| `src/lib/validation/project.ts` | XV | L29-66 (projectCreateSchema) |
| `src/lib/validation/project-readiness.ts` | XIII, XV | L42-195 (checkReadiness) |
| `src/lib/api-client.ts` | XIII, XIV, XVII | L7 (dependents) |
| `src/lib/tracker.ts` | XIII, XIV, XVII | L6 (dependents) |
| `src/lib/media/config.ts` | XIII, XVII | L6 (dependents) |
| `src/lib/activity.ts` | XIII, XV, XIX | L4 (dependents) |
| `src/lib/auth-rate-limit.ts` | XIII, XIX | L8-11 (in-memory Map) |
| `src/lib/cloudinary.ts` | XIII | L1 (dependent) |
| `src/lib/pagination.ts` | XIII | L2 (dependents) |
| `src/lib/text.ts` | XIII | L3 (dependents) |
| `src/lib/projects/public-projects.ts` | XIII, XIV, XV | L4 (dependents) |
| `src/lib/projects/categories.ts` | XIII | L4 (dependents) |
| `src/lib/about-content-normalizer.ts` | XIII | L3 (dependents) |
| `src/lib/contact-content-normalizer.ts` | XIII | L5 (dependents) |
| `src/lib/hero-content-normalizer.ts` | XIII | L1 (dependent) |
| `src/lib/hooks/index.ts` | XIII | L3 (dependents) |
| `src/lib/hooks/useUnsavedChanges.ts` | XIII, XIV, XX | L1 (via barrel) |
| `src/lib/public-homepage-content.ts` | XIII, XV | L1 (dependent) |
| `src/lib/public-contact-content.ts` | XIII | L2 (dependents) |
| `src/lib/insight-engine.ts` | XIII | L1 (dependent) |
| `src/lib/safe-project-title.ts` | XIII | L1 (dependent) |
| `src/lib/logo-data-uri.ts` | XIII | L2 (dependents) |
| `src/models/Project.ts` | XIII, XIV, XV | L63-67 (indexes), L44-45 (client fields) |
| `src/models/Settings.ts` | XIII, XV | L7-9 (interface mismatch), L106-110 (schema), L118-123 (social links), L141 (contactAvailability) |
| `src/models/Analytics.ts` | XIII, XV, XVI, XVII | L41-49 (9 indexes), L23-39 (schema) |
| `src/models/ActivityLog.ts` | XIII, XVI | L23-25 (indexes) |
| `src/components/admin/ProjectEditor.tsx` | XIII, XIV, XV, XVII, XXI | L79-86 (watch calls), L142 (onSubmit) |
| `src/components/admin/MediaFields.tsx` | XIII, XIV, XV, XVII, XXI | L37-52 (14 props), L70 (useEffect) |
| `src/components/admin/MediaUploader.tsx` | XIV | L300 (lines) |
| `src/components/admin/DataTable.tsx` | XIV, XVII | L148 (state), L285 (lines) |
| `src/components/admin/ErrorSummary.tsx` | XIV | L59 (scrollToFirstError) |
| `src/components/admin/BilingualInput.tsx` | XIV | L46 (lines) |
| `src/components/admin/AdminSidebar.tsx` | XIV | L113 (lines) |
| `src/components/admin/AdminProviders.tsx` | XIV | L8 (QueryClient lazy init) |
| `src/components/admin/AdminLoadingSkeleton.tsx` | XIV | L38 (lines) |
| `src/components/admin/ProjectReadinessPanel.tsx` | XIV | L75 (lines) |
| `src/components/admin/ProjectFormActions.tsx` | XIV | L36 (lines) |
| `src/components/admin/PreviewBanner.tsx` | XIV | L24 (lines) |
| `src/components/admin/VideoPreview.tsx` | XIV | L54 (lines) |
| `src/components/admin/VideoPosterCard.tsx` | XIV | L43 (lines) |
| `src/components/admin/SummaryFields.tsx` | XIV | L64 (lines) |
| `src/components/admin/ProjectStatusFields.tsx` | XIV | L105 (lines) |
| `src/components/admin/CategoriesFields.tsx` | XIV | L76 (lines) |
| `src/components/admin/CaseStudyFields.tsx` | XIV | L173 (lines) |
| `src/components/admin/BasicInfoFields.tsx` | XIV | L98 (lines) |
| `src/components/projects/ProjectMediaGallery.tsx` | XIII, XIV, XVII | L426 (lines), L153 (timeout) |
| `src/components/projects/project-card.tsx` | XIV | L105 (lines) |
| `src/components/ui/container.tsx` | XIII | L10 (dependents) |
| `src/components/ui/section.tsx` | XIII | L9 (dependents) |
| `src/components/ui/CreativeEngineLoader.tsx` | XIV, XVII | L247 (lines), L63 (sessionStorage) |
| `src/components/ui/SectionNarrator.tsx` | XVII | L26 (IntersectionObserver) |
| `src/components/ui/FilmStripSection.tsx` | XIII | L0 (UNUSED) |
| `src/components/ui/pixel-button.tsx` | XIII | L0 (UNUSED) |
| `src/components/ui/dropdown-menu.tsx` | XIII | L0 (UNUSED) |
| `src/components/ui/BrandMarquee.tsx` | XIV | L104 (lines) |
| `src/components/ui/button.tsx` | XIV | L33 (lines) |
| `src/components/ui/contact-icon-image.tsx` | XIV | L41 (lines) |
| `src/components/ui/Marquee.tsx` | XIV | L76 (lines) |
| `src/components/ui/RichTextEditor.tsx` | XIV | L137 (lines) |
| `src/components/seo/JsonLd.tsx` | XIV | L45 (lines), L7/24 (hardcoded URLs) |
| `src/components/analytics/ShowreelTracker.tsx` | XIV | L13 (querySelectorAll video) |
| `src/components/analytics/PageViewTracker.tsx` | XIV | L16 (lines) |
| `src/components/layout/navbar.tsx` | XIV | L123 (lines) |
| `src/components/layout/footer.tsx` | XIV | L92 (lines) |
| `src/components/sections/hero/index.tsx` | XIV | L84 (lines) |
| `src/components/sections/about/index.tsx` | XIV, XV | L177 (lines) |
| `src/components/sections/about/CharacterSelector.tsx` | XVII | L59 (preload) |
| `src/components/sections/contact/index.tsx` | XIV | L158 (lines) |
| `src/components/sections/contact/ContactForm.tsx` | XIV | L163 (lines) |
| `src/components/sections/contact/CommunicationChannels.tsx` | XIV | L105 (lines) |
| `src/components/sections/contact/SuccessState.tsx` | XIV | L49 (lines) |
| `src/components/sections/projects/index.tsx` | XIV | L100 (lines) |
| `src/components/sections/Services.tsx` | XIV | L88 (lines) |
| `src/app/api/projects/route.ts` | XV, XVI, XIX | L95-98 (query), L109 (POST) |
| `src/app/api/projects/[id]/route.ts` | XIV, XV, XVI | L117-152 (merge), L225 (Cloudinary) |
| `src/app/api/projects/bulk/route.ts` | XV, XVI | L34 (validation), L55 (deleteMany) |
| `src/app/api/analytics/route.ts` | XVI | L104 (Analytics.create) |
| `src/app/api/analytics/events/route.ts` | XVI, XIX | L78 (allowlist), L6 (body limit) |
| `src/app/api/analytics/summary/route.ts` | XIV, XVI, XVII | L46-163 (14 queries) |
| `src/app/api/analytics/insights/route.ts` | XVI | L6-11 (auth) |
| `src/app/api/analytics/editorial/route.ts` | XVI | L18-39 (6 queries) |
| `src/app/api/settings/hero/route.ts` | XVI | L110 (req.json no try/catch) |
| `src/app/api/settings/content/route.ts` | XVI, XIX | L170 (manual validation) |
| `src/app/api/activity/route.ts` | XVI | L52-59 (query) |
| `src/app/api/auth/[...nextauth]/route.ts` | XVI | L6 (NextAuth handler) |
| `src/app/admin/layout.tsx` | XIV, XV | L13 (getServerSession) |
| `src/app/admin/projects/page.tsx` | XIV | L368 (lines) |
| `src/app/admin/content/page.tsx` | XIV, XV | L694 (lines) |
| `src/app/admin/content/hero/page.tsx` | XV | L1 (hero editor) |
| `src/app/admin/analytics/page.tsx` | XIV | L471 (lines) |
| `src/app/(marketing)/page.tsx` | XIII, XV | L1 (homepage) |
| `src/app/(marketing)/projects/page.tsx` | XIII | L1 (project listing) |
| `src/app/(marketing)/projects/[slug]/page.tsx` | XIII, XIV | L1 (project detail) |
| `src/app/(marketing)/showreel/page.tsx` | XVII | L1 (showreel) |
| `src/app/sitemap.ts` | XV | L1 (sitemap generation) |
| `src/proxy.ts` | XIII, XV, XIX | L17-21 (matcher) |
| `next.config.ts` | XVI, XIX | L29-31 (CSP), L3-31 (headers) |
| `package.json` | XVIII | Dependencies, scripts |
| `tsconfig.json` | XVI | strict: true |
| `vitest.config.ts` | XV | L1 (test config) |
| `playwright.config.ts` | XV | L1 (E2E config) |
| `.env.example` | XIX | L1-25 (env vars) |
| `.env.local` | XIX | Security concerns |
| `tests/unit/validation/project-schema.test.ts` | XV | 23 test cases |
| `tests/regression/save-bug.test.ts` | XV, XVI | Zod 4 regression |
| `tests/integration/api/projects-crud.test.ts` | XIV, XV | Full CRUD tests |
| `tests/integration/api/pagination.test.ts` | XV | Pagination tests |
| `tests/integration/db/persistence.test.ts` | XV | DB round-trip tests |
| `tests/e2e/pagination.spec.ts` | XV | 10 Playwright tests |

---

*End of Engineering Intelligence System*
*This document is the permanent software system bible for the amr-yousry-portfolio repository.*
*Last updated: July 2026*
