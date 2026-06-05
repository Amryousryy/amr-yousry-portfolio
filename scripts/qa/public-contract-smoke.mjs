/**
 * Phase 19 — Public Contract Smoke Tests
 *
 * CI-safe public endpoint contract checks. No credentials. No mutation.
 * Runs against local ephemeral server by default. Production only with
 * explicit QA_ALLOW_PRODUCTION_READONLY=true.
 *
 * Usage:
 *   node scripts/qa/public-contract-smoke.mjs
 *   QA_BASE_URL=http://localhost:3001 node scripts/qa/public-contract-smoke.mjs
 *   QA_ALLOW_PRODUCTION_READONLY=true QA_BASE_URL=https://example.com node scripts/qa/public-contract-smoke.mjs
 */
const BASE = process.env.QA_BASE_URL || "http://localhost:3001";
const ALLOW_PROD = process.env.QA_ALLOW_PRODUCTION_READONLY === "true";

// Production guard
try {
  const { hostname } = new URL(BASE);
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  if (!isLocal && !ALLOW_PROD) {
    console.error("REFUSED: Production target requires QA_ALLOW_PRODUCTION_READONLY=true. BASE=%s", BASE);
    process.exit(1);
  }
} catch {
  // if BASE is invalid, fetch will fail naturally
}

let passed = 0;
let failed = 0;

function assert(cond, label) {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

async function fetchJSON(url, label) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    let body = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("json")) {
      try { body = await res.json(); } catch {}
    }
    const text = ct.includes("text") ? await res.text() : null;
    return { status: res.status, headers: res.headers, body, text };
  } catch (err) {
    console.log(`  FAIL: ${label} — ${err.message}`);
    failed++;
    return { status: 0, headers: new Headers(), body: null, text: null };
  }
}

function hasHeader(headers, name) {
  return headers.has(name) && headers.get(name).length > 0;
}

const EXPECTED_CSP_DIRECTIVES = ["base-uri", "object-src", "form-action", "frame-ancestors"];

async function main() {
  console.log(`# Public Contract Smoke Tests\n`);
  console.log(`Base URL: ${BASE}\n`);

  // ═══ PUBLIC ROUTES ═══
  console.log("## Public Routes\n");

  const routes = ["/", "/projects", "/showreel", "/login", "/robots.txt", "/sitemap.xml", "/api/health"];
  for (const route of routes) {
    const r = await fetchJSON(`${BASE}${route}`, route);
    assert(r.status === 200, `${route} → HTTP 200 (got ${r.status})`);
  }

  // Nonexistent route → 404
  const r404 = await fetchJSON(`${BASE}/nonexistent`, "/nonexistent");
  assert(r404.status === 404 || r404.status === 308, "/nonexistent → HTTP 404 or 308 (got ${r404.status})");

  // ═══ REDIRECTS ═══
  console.log("\n## Redirects\n");

  {
    const url = `${BASE}/projects/al-ghazal-exhibition`;
    try {
      const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10000) });
      assert(res.status === 308, `/projects/al-ghazal-exhibition → HTTP 308 (got ${res.status})`);
      const loc = res.headers.get("location") || "";
      assert(loc.includes("/projects/al-ghazal-egc"), `/projects/al-ghazal-exhibition → Location includes /projects/al-ghazal-egc (got ${loc})`);
    } catch (err) {
      console.log(`  FAIL: /projects/al-ghazal-exhibition — ${err.message}`);
      failed++;
    }
  }

  // ═══ SECURITY: Admin endpoints without auth ═══
  console.log("\n## Security: Unauthenticated Admin Endpoints\n");

  // /api/projects?admin=true → 200, empty array (not 401)
  {
    const r = await fetchJSON(`${BASE}/api/projects?admin=true`, "/api/projects?admin=true");
    assert(r.status === 200, "/api/projects?admin=true → HTTP 200 (got ${r.status})");
    if (r.body && r.body.success !== undefined) {
      assert(r.body.success === true, "/api/projects?admin=true → success === true");
      assert(Array.isArray(r.body.data), "/api/projects?admin=true → data is array");
    }
  }

  // /api/activity → 401
  {
    const r = await fetchJSON(`${BASE}/api/activity`, "/api/activity");
    assert(r.status === 401, "/api/activity → HTTP 401 (got ${r.status})");
  }

  // /api/settings/content?admin=true → _preview false (inside data wrapper)
  {
    const r = await fetchJSON(`${BASE}/api/settings/content?admin=true`, "/api/settings/content?admin=true");
    if (r.status === 200 && r.body && r.body.data) {
      assert(r.body.data._preview === false, "/api/settings/content?admin=true → data._preview false");
    } else {
      assert(false, "/api/settings/content?admin=true → HTTP 200 (got ${r.status})");
    }
  }

  // /api/settings/hero?preview=true → _preview false (inside data wrapper)
  {
    const r = await fetchJSON(`${BASE}/api/settings/hero?preview=true`, "/api/settings/hero?preview=true");
    if (r.status === 200 && r.body && r.body.data) {
      assert(r.body.data._preview === false, "/api/settings/hero?preview=true → data._preview false");
    } else {
      assert(false, "/api/settings/hero?preview=true → HTTP 200 (got ${r.status})");
    }
  }

  // ═══ SECURITY HEADERS ═══
  console.log("\n## Security Headers\n");

  // Fetch any public page to check headers
  const home = await fetchJSON(`${BASE}/`, "/ (for headers)");
  const h = home.headers;

  assert(hasHeader(h, "content-security-policy"), "Content-Security-Policy header exists");

  if (hasHeader(h, "content-security-policy")) {
    const csp = h.get("content-security-policy");
    // Check for expected CSP directives
    for (const directive of EXPECTED_CSP_DIRECTIVES) {
      const re = new RegExp(`\\b${directive}\\b`);
      assert(re.test(csp), `CSP contains ${directive}`);
    }
    assert(/base-uri\s+'self'/.test(csp), "CSP: base-uri 'self'");
    assert(/object-src\s+'none'/.test(csp), "CSP: object-src 'none'");
    assert(/form-action\s+'self'/.test(csp), "CSP: form-action 'self'");
    assert(/frame-ancestors\s+'none'/.test(csp), "CSP: frame-ancestors 'none'");
  }

  assert(hasHeader(h, "x-content-type-options"), "X-Content-Type-Options exists");
  if (hasHeader(h, "x-content-type-options")) {
    assert(h.get("x-content-type-options").toLowerCase() === "nosniff", "X-Content-Type-Options: nosniff");
  }

  assert(hasHeader(h, "x-frame-options"), "X-Frame-Options exists");
  if (hasHeader(h, "x-frame-options")) {
    assert(h.get("x-frame-options") === "DENY", "X-Frame-Options: DENY");
  }

  assert(hasHeader(h, "strict-transport-security"), "Strict-Transport-Security exists");

  // ═══ SUMMARY ═══
  const total = passed + failed;
  console.log(`\n## Summary`);
  console.log(`Passed: ${passed} / ${total}`);
  console.log(`Failed: ${failed} / ${total}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
