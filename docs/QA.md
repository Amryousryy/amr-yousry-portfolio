# QA Strategy

## Test Layers

| Layer | Location | CI-safe? | Description |
|-------|----------|----------|-------------|
| A. Unit Tests | `scripts/qa/project-readiness-unit.ts` (runs via jiti) | ✅ Yes | Pure function tests for `detectExpectedMediaType()` and `checkReadiness()`. Imports production logic directly. Uses `jiti` (transitive dependency via tailwindcss/eslint, locked in package-lock.json). No MongoDB, no network, no credentials. |
| A1. Auth Rate Limit | `scripts/qa/auth-rate-limit-unit.ts` (runs via jiti) | ✅ Yes | Pure function tests for the in-memory login rate limiter. No MongoDB, no network, no credentials. |
| A2. Insight Engine | `scripts/qa/insight-engine-unit.ts` (runs via jiti) | ✅ Yes | Pure function tests for `safeProjectTitle()`. No MongoDB, no network, no credentials. |
| B. Static Quality | `npm run build`, `npm run lint`, `git diff --check` | ✅ Yes | TypeScript compilation, ESLint (errors are blocking, warnings are visible but non-blocking), whitespace checks. |
| C. API Contract | `scripts/qa/public-contract-smoke.mjs` | ✅ Yes | Public endpoint status codes, redirects, security headers. Requires ephemeral server. |
| D. Local Auth Integration | `scripts/qa/phase18-admin-guardrails.mjs` | ❌ No | Requires `.env.local`, local MongoDB, auth session. Creates and cleans up temp records. |
| E. Browser E2E | Not implemented | ❌ No | Future layer — would require Playwright. |
| F. Production Smoke | Manual, same as C with `QA_ALLOW_PRODUCTION_READONLY=true` | ⚠️ Manual | Read-only production health checks. |

## CI-Safe Commands

These run in GitHub Actions automatically:

```bash
# Pure function unit tests (no server needed)
npm run qa:readiness-unit
npm run qa:auth-rate-limit-unit
npm run qa:insight-engine-unit

# Public contract smoke tests (starts ephemeral server)
npm run qa:public-contract
```

## Local Authenticated Test

```bash
# Start local dev server on port 3001
npm run dev -- -p 3001

# Run authenticated integration tests (requires .env.local)
npm run qa:admin-guardrails
```

## Required Local Setup

- Node.js 20.x
- `.env.local` with valid `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `MONGODB_URI`
- Local MongoDB instance or reachable MongoDB URI
- Local dev server running on port 3001

## What Runs in GitHub Actions

1. `npm ci` — clean dependency install
2. `npm run build` — production build (blocking)
3. `git diff --check` — whitespace violation check (blocking)
4. `npm run qa:readiness-unit` — pure function unit tests (blocking)
5. `npm run qa:auth-rate-limit-unit` — rate limiter pure function tests (blocking)
6. `npm run qa:insight-engine-unit` — insight engine pure function tests (blocking)
7. `npm run qa:public-contract` — public endpoint + header smoke tests (blocking)
8. `npm run lint` — lint (blocking — ESLint errors fail CI)

## What Remains Manual

- Authenticated integration tests (`npm run qa:admin-guardrails`)
- Browser E2E tests (if implemented later)
- Production smoke tests (read-only, explicit opt-in)

## Production Smoke Procedure

1. Set `QA_ALLOW_PRODUCTION_READONLY=true`
2. Set `QA_BASE_URL` to the production URL
3. Run the public contract test:
   ```bash
   QA_ALLOW_PRODUCTION_READONLY=true \
   QA_BASE_URL=https://amr-yousry-portfolio.vercel.app \
   node scripts/qa/public-contract-smoke.mjs
   ```

## Safety Rules

- Never run mutation tests against production
- Never print secrets or credentials
- Never commit `.env.local`
- Use timestamped temporary records only
- Verify cleanup in `finally` blocks

## Command Reference

| Command | Purpose | Needs Server? | Needs Env? | Mutates Local DB? | Safe for CI? |
|---------|---------|---------------|------------|-------------------|--------------|
| `npm run build` | Production build | No | No | No | ✅ Yes |
| `npm run lint` | ESLint checks | No | No | No | ✅ Yes (errors blocking, warnings visible) |
| `git diff --check` | Whitespace check | No | No | No | ✅ Yes |
| `npm run qa:readiness-unit` | Pure function unit tests (imports production logic) | No | No | No | ✅ Yes |
| `npm run qa:auth-rate-limit-unit` | Rate limiter pure function tests | No | No | No | ✅ Yes |
| `npm run qa:insight-engine-unit` | Insight engine pure function tests | No | No | No | ✅ Yes |
| `npm run qa:public-contract` | Public endpoint contract tests | Yes (auto) | No | No | ✅ Yes |
| `npm run qa:admin-guardrails` | Authenticated integration tests | Yes (manual) | Yes | Yes (temp, cleaned) | ❌ No |
