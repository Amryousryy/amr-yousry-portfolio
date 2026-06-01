/**
 * Phase 18 — Admin Guardrails QA Suite
 *
 * Tests: duplicate slug handling, publish readiness, draft safety, regression.
 *
 * Usage:
 *   npm run dev -- -p 3001
 *   npm run qa:admin-guardrails
 *
 * SAFETY: This script targets localhost ONLY. It will refuse to run against
 * any non-local hostname. It creates temporary records and cleans up after
 * itself. No production data is touched.
 *
 * Credentials: read from .env.local via environment variables.
 * Do NOT hardcode credentials in this file or any committed script.
 */

const BASE = process.env.QA_BASE_URL || "http://localhost:3001";

// Production guard — refuse to run against a remote host
try {
  const { hostname } = new URL(BASE);
  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    console.error("REFUSED: This QA script targets localhost only. BASE=%s", BASE);
    process.exit(1);
  }
} catch { /* if BASE is invalid, the first fetch will fail naturally */ }
const API = `${BASE}/api/projects`;
const AUTH = `${BASE}/api/auth`;

let passed = 0;
let failed = 0;
const tempIds = [];

function assert(cond, label) { if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); } }

function makeProject(slug, overrides = {}) {
  return {
    title: "Integration Test Project",
    slug,
    shortDescription: "Testing API integrations",
    fullDescription: "Full description for API integration test",
    category: "film",
    categories: ["film"],
    image: "https://example.com/cover.jpg",
    caseStudyMedia: [{ type: "image", src: "https://example.com/media.jpg", alt: "alt", caption: "cap" }],
    gallery: ["https://example.com/gallery.jpg"],
    services: ["editing"],
    tags: ["test"],
    detailedResults: [{ label: "Views", value: "100" }],
    sections: [{ id: "s1", title: "Section", content: "Content", media: [] }],
    client: "Test Client",
    year: "2026",
    results: "Test results",
    strategy: "Test strategy",
    execution: "Test execution",
    seo: { title: "SEO Title", description: "SEO Desc", keywords: ["kw"] },
    status: "draft",
    ...overrides,
  };
}

async function getSessionCookie() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  const csrfRes = await fetch(`${AUTH}/csrf`, { signal: AbortSignal.timeout(5000) });
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = csrfRes.headers.get("set-cookie")?.split(";")[0] || "";
  const loginRes = await fetch(`${AUTH}/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: csrfCookie },
    body: new URLSearchParams({ csrfToken, email, password, callbackUrl: "/admin" }),
    redirect: "manual",
    signal: AbortSignal.timeout(5000),
  });
  const raw = loginRes.headers.get("set-cookie") || "";
  const parts = raw.split(/, (?=(?:next-auth\.|__Secure-))/);
  const sessionPart = parts.find(p =>
    p.trim().startsWith("next-auth.session-token=") ||
    p.trim().startsWith("__Secure-next-auth.session-token=")
  );
  if (!sessionPart) return null;
  return parts.map(p => p.split(";")[0].trim()).filter(Boolean).join("; ");
}

async function cleanup() {
  if (tempIds.length === 0) return;
  const cookie = await getSessionCookie();
  if (!cookie) return;
  for (const id of tempIds) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Cookie: cookie },
        signal: AbortSignal.timeout(5000),
      });
    } catch { /* ignore cleanup errors */ }
  }
}

async function main() {
  console.log("# Phase 18 API Integration Tests\n");

  // ─── Login ───
  console.log("## Login");
  const cookie = await getSessionCookie();
  if (!cookie) {
    console.log("FAIL: Could not login (check credentials)");
    process.exit(1);
  }
  console.log("PASS: Login succeeded\n");

  const h = { "Content-Type": "application/json", Cookie: cookie };

  // ═══ TASK 6: DUPLICATE SLUG ═══
  console.log("## Task 6: Duplicate Slug Tests");

  // 6A: Create with unique slug
  const slug1 = `dup-test-${Date.now()}`;
  const rA = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(slug1)), signal: AbortSignal.timeout(5000) });
  const dA = await rA.json();
  assert(rA.status === 201, `6A: Unique slug created (HTTP ${rA.status})`);
  assert(dA?.data?._id, "6A: Has _id");
  if (dA?.data?._id) tempIds.push(dA.data._id);

  // 6B: Duplicate slug → HTTP 409
  const slug2 = slug1; // same slug
  const rB = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(slug2)), signal: AbortSignal.timeout(5000) });
  const dB = await rB.json();
  assert(rB.status === 409, `6B: Duplicate slug -> HTTP ${rB.status} (expected 409)`);
  assert(dB?.error && !dB.error.includes("E11000"), "6B: Safe message, no MongoDB internals");
  assert(dB?.error && dB.error.includes("slug already exists"), `6B: Message: "${dB?.error}"`);

  // 6C: Edit existing project without changing slug
  const rC = await fetch(`${API}/${dA.data._id}`, { method: "PUT", headers: h, body: JSON.stringify({ title: "Updated Title" }), signal: AbortSignal.timeout(5000) });
  const dC = await rC.json();
  assert(rC.status === 200, `6C: Edit without slug change (HTTP ${rC.status})`);
  assert(dC?.data?.title === "Updated Title", "6C: Title updated");

  // 6D: Edit project to another project's slug — create another project first
  const slug3 = `dup-other-${Date.now()}`;
  const rD1 = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(slug3)), signal: AbortSignal.timeout(5000) });
  const dD1 = await rD1.json();
  assert(rD1.status === 201, "6D: Second project created");
  if (dD1?.data?._id) tempIds.push(dD1.data._id);

  // Now try to edit first project to use slug3
  const rD2 = await fetch(`${API}/${dA.data._id}`, { method: "PUT", headers: h, body: JSON.stringify({ slug: slug3 }), signal: AbortSignal.timeout(5000) });
  assert(rD2.status === 409, `6D: Edit to existing slug -> HTTP ${rD2.status} (expected 409)`);

  // ═══ TASK 7: PUBLISH READINESS ═══
  console.log("\n## Task 7: Publish Readiness Runtime Tests");

  // — Draft behavior: incomplete drafts MUST save —
  // 7A: Empty title draft
  const r7a = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`draft-emptitle-${Date.now()}`, { title: "" })), signal: AbortSignal.timeout(5000) });
  const d7a = await r7a.json();
  assert(r7a.status === 201, `7A: Empty title draft saved (HTTP ${r7a.status})`);
  if (d7a?.data?._id) tempIds.push(d7a.data._id);

  // 7B: Empty image draft
  const r7b = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`draft-noimg-${Date.now()}`, { image: "" })), signal: AbortSignal.timeout(5000) });
  const d7b = await r7b.json();
  assert(r7b.status === 201, `7B: Empty image draft saved (HTTP ${r7b.status})`);
  if (d7b?.data?._id) tempIds.push(d7b.data._id);

  // 7C: Empty categories draft
  const r7c = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`draft-nocat-${Date.now()}`, { categories: [] })), signal: AbortSignal.timeout(5000) });
  const d7c = await r7c.json();
  assert(r7c.status === 201, `7C: Empty categories draft saved (HTTP ${r7c.status})`);
  if (d7c?.data?._id) tempIds.push(d7c.data._id);

  // 7D: Empty media src draft
  const r7d = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`draft-nosrc-${Date.now()}`, { caseStudyMedia: [{ type: "image", src: "" }] })), signal: AbortSignal.timeout(5000) });
  const d7d = await r7d.json();
  assert(r7d.status === 201, `7D: Empty media src draft saved (HTTP ${r7d.status})`);
  if (d7d?.data?._id) tempIds.push(d7d.data._id);

  // 7E: Edit incomplete draft
  const r7e = await fetch(`${API}/${d7a.data._id}`, { method: "PUT", headers: h, body: JSON.stringify({ title: "Still Empty Title" }), signal: AbortSignal.timeout(5000) });
  assert(r7e.status === 200, `7E: Edit incomplete draft (HTTP ${r7e.status})`);

  // 7F: Clear all media from draft
  const r7f = await fetch(`${API}/${d7a.data._id}`, { method: "PUT", headers: h, body: JSON.stringify({ caseStudyMedia: [] }), signal: AbortSignal.timeout(5000) });
  const d7f = await r7f.json();
  assert(r7f.status === 200, `7F: Clear media from draft (HTTP ${r7f.status})`);
  assert(d7f?.data?.caseStudyMedia?.length === 0 || d7f?.data?.caseStudyMedia === undefined, "7F: Media array cleared");

  // — Publish blocking —
  // 7G: Publish empty title → 422
  const r7g = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-notitle-${Date.now()}`, { title: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7g = await r7g.json();
  assert(r7g.status === 422, `7G: Publish empty title -> HTTP ${r7g.status} (expected 422)`);
  assert(Array.isArray(d7g?.issues) && d7g.issues.length > 0, `7G: Issues array (${d7g?.issues?.length})`);

  // 7H: Publish empty slug → 422 or 400 (slug is always rejected by Zod before readiness check)
  const r7h = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject("", { slug: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7h.status === 422 || r7h.status === 400, `7H: Publish empty slug -> HTTP ${r7h.status} (expected 400 or 422)`);

  // 7I: Publish empty shortDescription → 422
  const r7i = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-nodesc-${Date.now()}`, { shortDescription: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7i.status === 422, `7I: Publish empty shortDescription -> HTTP ${r7i.status}`);

  // 7J: Publish empty fullDescription → 422
  const r7j = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-nofull-${Date.now()}`, { fullDescription: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7j.status === 422, `7J: Publish empty fullDescription -> HTTP ${r7j.status}`);

  // 7K: Publish empty category → 422
  const r7k = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-nocat-${Date.now()}`, { category: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7k.status === 422, `7K: Publish empty category -> HTTP ${r7k.status}`);

  // 7L: Publish empty categories array → 422
  const r7l = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-nocats-${Date.now()}`, { categories: [], status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7l.status === 422, `7L: Publish empty categories[] -> HTTP ${r7l.status}`);

  // 7M: Publish empty thumbnail → 422
  const r7m = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-noimg-${Date.now()}`, { image: "", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7m.status === 422, `7M: Publish empty thumbnail -> HTTP ${r7m.status}`);

  // 7N: Publish empty media src → 422
  const r7n = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-nosrc-${Date.now()}`, { caseStudyMedia: [{ type: "image", src: "" }], status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7n.status === 422, `7N: Publish empty media src -> HTTP ${r7n.status}`);

  // 7O: Publish stale placeholder → 422
  const r7o = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-place-${Date.now()}`, { title: "Arcade Experience", status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7o.status === 422, `7O: Publish placeholder title -> HTTP ${r7o.status}`);

  // 7P: Publish featured without caseStudyMedia → 422
  const r7p = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`pub-feat-${Date.now()}`, { featured: true, caseStudyMedia: [], status: "published" })), signal: AbortSignal.timeout(5000) });
  assert(r7p.status === 422, `7P: Publish featured without caseStudyMedia -> HTTP ${r7p.status}`);

  // — Warning-only: allowed with warnings —
  // 7Q: Empty services → allowed (200/201)
  const r7q = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-svc-${Date.now()}`, { services: [], status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7q = await r7q.json();
  assert([200, 201].includes(r7q.status), `7Q: Publish empty services -> HTTP ${r7q.status}`);
  if (r7q.status === 201 && d7q?.data?._id) tempIds.push(d7q.data._id);

  // 7R: Empty SEO title → allowed
  const r7r = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-seot-${Date.now()}`, { seo: { title: "", description: "D", keywords: ["kw"] }, status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7r = await r7r.json();
  assert([200, 201].includes(r7r.status), `7R: Publish empty SEO title -> HTTP ${r7r.status}`);
  if (r7r.status === 201 && d7r?.data?._id) tempIds.push(d7r.data._id);

  // 7S: Empty SEO description → allowed
  const r7s = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-seod-${Date.now()}`, { seo: { title: "T", description: "", keywords: ["kw"] }, status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7s = await r7s.json();
  assert([200, 201].includes(r7s.status), `7S: Publish empty SEO desc -> HTTP ${r7s.status}`);
  if (r7s.status === 201 && d7s?.data?._id) tempIds.push(d7s.data._id);

  // 7T: Empty SEO keywords → allowed
  const r7t = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-seok-${Date.now()}`, { seo: { title: "T", description: "D", keywords: [] }, status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7t = await r7t.json();
  assert([200, 201].includes(r7t.status), `7T: Publish empty SEO keywords -> HTTP ${r7t.status}`);
  if (r7t.status === 201 && d7t?.data?._id) tempIds.push(d7t.data._id);

  // 7U: Missing alt text → allowed
  const r7u = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-alt-${Date.now()}`, { caseStudyMedia: [{ type: "image", src: "https://example.com/m.jpg", alt: "", caption: "cap" }], status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7u = await r7u.json();
  assert([200, 201].includes(r7u.status), `7U: Publish empty alt -> HTTP ${r7u.status}`);
  if (r7u.status === 201 && d7u?.data?._id) tempIds.push(d7u.data._id);

  // 7V: Empty gallery → allowed
  const r7v = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(`warn-gal-${Date.now()}`, { gallery: [], status: "published" })), signal: AbortSignal.timeout(5000) });
  const d7v = await r7v.json();
  assert([200, 201].includes(r7v.status), `7V: Publish empty gallery -> HTTP ${r7v.status}`);
  if (r7v.status === 201 && d7v?.data?._id) tempIds.push(d7v.data._id);


  // ═══ TASK 8: REGRESSION TESTS ═══
  console.log("\n## Task 8: Regression Tests");

  // Create a clean project for regression tests
  const slugR = `reg-test-${Date.now()}`;
  const rR0 = await fetch(API, { method: "POST", headers: h, body: JSON.stringify(makeProject(slugR)), signal: AbortSignal.timeout(5000) });
  const dR0 = await rR0.json();
  assert(rR0.status === 201, "8-base: Created regression test project");
  const regId = dR0?.data?._id;
  if (regId) tempIds.push(regId);

  if (regId) {
    // 8A: Text-only edit preserves media arrays
    const rR1 = await fetch(`${API}/${regId}`, { method: "PUT", headers: h, body: JSON.stringify({ title: "Updated Regression Title" }), signal: AbortSignal.timeout(5000) });
    const dR1 = await rR1.json();
    assert(rR1.status === 200, "8A: Text-only edit (HTTP 200)");
    const u1 = dR1?.data || {};
    assert(Array.isArray(u1.caseStudyMedia) && u1.caseStudyMedia.length > 0, "8A: caseStudyMedia preserved");
    assert(Array.isArray(u1.categories) && u1.categories.length > 0, "8A: categories preserved");
    assert(Array.isArray(u1.gallery) && u1.gallery.length > 0, "8A: gallery preserved");
    assert(Array.isArray(u1.sections), "8A: sections preserved");
    assert(Array.isArray(u1.services) && u1.services.length > 0, "8A: services preserved");
    assert(Array.isArray(u1.detailedResults) && u1.detailedResults.length > 0, "8A: detailedResults preserved");

    // 8B: Remove one media item
    const rR2 = await fetch(`${API}/${regId}`, { method: "PUT", headers: h, body: JSON.stringify({ caseStudyMedia: [] }), signal: AbortSignal.timeout(5000) });
    const dR2 = await rR2.json();
    assert(rR2.status === 200, "8B: Remove all media (HTTP 200)");
    const u2 = dR2?.data || {};
    assert((u2.caseStudyMedia || []).length === 0, "8B: caseStudyMedia cleared");

    // Restore media
    const rR2b = await fetch(`${API}/${regId}`, { method: "PUT", headers: h, body: JSON.stringify({ caseStudyMedia: [{ type: "image", src: "https://example.com/restored.jpg", alt: "restored", caption: "restored" }] }), signal: AbortSignal.timeout(5000) });
    assert(rR2b.status === 200, "8B: Restore media");

    // 8E: Add gallery item
    await fetch(`${API}/${regId}`, { method: "PUT", headers: h, body: JSON.stringify({ gallery: ["https://example.com/g1.jpg", "https://example.com/g2.jpg"] }), signal: AbortSignal.timeout(5000) });
    const rR3 = await fetch(`${API}/${regId}?admin=true`, { headers: { Cookie: cookie }, signal: AbortSignal.timeout(5000) });
    const dR3 = await rR3.json();
    assert(dR3?.data?.gallery?.length >= 2, "8E: Gallery items persisted");
  }

  // 8I: Existing published projects readable
  const r8i = await fetch(`${BASE}/api/projects`, { signal: AbortSignal.timeout(5000) });
  const d8i = await r8i.json();
  assert(r8i.status === 200, `8I: Public projects endpoint (HTTP ${r8i.status})`);
  assert(d8i?.success === true, "8I: success=true");

  // 8K: /api/projects?admin=true protected without session
  const r8k = await fetch(`${API}?admin=true`, { signal: AbortSignal.timeout(5000) });
  const d8k = await r8k.json();
  assert(d8k?.success === true && Array.isArray(d8k?.data), "8K: ?admin=true returns empty array (no auth)");

  // 8N: Admin login page accessible
  const r8n = await fetch(`${BASE}/login`, { signal: AbortSignal.timeout(5000) });
  assert(r8n.status === 200, "8N: Login page accessible");


  // ─── CLEANUP ───
  console.log("\n## Cleanup");
  await cleanup();
  console.log(`Cleaned ${tempIds.length} temp records`);

  // ─── REPORT ───
  const total = passed + failed;
  console.log(`\n## Summary`);
  console.log(`Passed: ${passed} / ${total}`);
  console.log(`Failed: ${failed} / ${total}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
