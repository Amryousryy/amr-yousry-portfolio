# Testing Guide

## Overview

This project uses **vitest** for automated testing. Tests are split into three tiers:

| Tier | Location | Requires Server? | Requires MongoDB? |
|------|----------|-----------------|-------------------|
| Unit | `tests/unit/` | No | No |
| Regression | `tests/regression/` | No | No |
| Integration | `tests/integration/` | Yes (`localhost:3000`) | Yes |

Current counts: **97** unit, **45** regression, **30** integration = **172 total**.

## Quick Start

```bash
# Run all tests (requires dev server running for integration)
npm test

# Unit tests only (no server needed)
npm run test:unit

# Integration tests only (dev server + MongoDB required)
npm run test:integration

# Regression tests only
npm run test:regression

# Watch mode (re-runs on file change)
npm run test:watch
```

## Prerequisites

### Unit & Regression Tests
- Node.js 18+
- `npm install` (vitest is a devDependency)

### Integration Tests
1. Dev server running: `npm run dev`
2. MongoDB accessible (connection string in environment)
3. Valid admin credentials (configured in test setup)

Integration tests authenticate via NextAuth credentials flow and create/delete
temporary projects. All test projects are cleaned up in `afterAll` hooks.

## Test Structure

```
tests/
  unit/
    validation/
      project-schema.test.ts    # 97 tests — Zod schema validation
  regression/
    save-bug.test.ts            # 45 tests — save-button regression suite
  integration/
    api/
      projects-crud.test.ts     # 26 tests — full CRUD via HTTP
    db/
      persistence.test.ts       # 4 tests — MongoDB round-trip verification
```

### Unit Tests (`tests/unit/`)

Pure schema validation. No network, no database. Covers:
- Required fields (title, slug, image)
- Optional fields (idea, mainResult, problem, etc.)
- Slug regex validation
- Status enum values
- URL safety (rejects `javascript:` schemes)
- SEO nested object
- Default values
- Edge cases (empty strings, whitespace, very long strings)

### Regression Tests (`tests/regression/`)

Targeted tests for the save-button bug (fixed):
- `standardSchemaResolver` compatibility with Zod 4
- Empty-string-to-undefined coercion for optional fields
- `isZodError` behavior in `@hookform/resolvers`
- Form submission flow (handleSubmit → resolver → API)

### Integration Tests (`tests/integration/`)

End-to-end against a running Next.js dev server:
- **API CRUD** (`projects-crud.test.ts`): Create, read, update, delete via `fetch`.
  Tests double/triple saves, optional field handling, SEO updates, validation errors.
- **DB Persistence** (`persistence.test.ts`): Verifies data round-trips through MongoDB.
  Confirms fields survive create→read and update→read cycles.

## CI Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR:

1. **`quality` job** — unit tests, lint, typecheck, build
2. **`integration` job** — starts MongoDB service container, dev server, runs integration tests

## Configuration

`vitest.config.ts`:
- Path alias: `@/` → `src/`
- `testTimeout`: 60s per test
- `hookTimeout`: 120s for `beforeAll`/`afterAll`
- Tests run sequentially (`sequence.concurrent: false`) to avoid MongoDB connection races

## Writing New Tests

1. Place unit tests under `tests/unit/`, integration under `tests/integration/`
2. Import from `vitest`: `describe`, `it`, `expect`, `beforeAll`, `afterAll`
3. Integration tests share a cookie jar via module-level variables
4. Clean up created resources in `afterAll` hooks
5. Use `uniqueSlug()` or `slug()` helpers to avoid collisions

## Troubleshooting

**"Hook timed out"** — Dev server not running or Turbopack still compiling. Wait 30s after `npm run dev` starts.

**"Authentication failed"** — Credentials may have changed. Update email/password in test files.

**"500 on first POST"** — MongoDB connection cold start. Tests run sequentially to mitigate; retry if persists.

**"ECONNREFUSED"** — Dev server not running on `localhost:3000`. Start with `npm run dev`.
