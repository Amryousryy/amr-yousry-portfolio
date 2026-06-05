/**
 * Phase 19 — Project Readiness Unit Tests
 *
 * CI-safe pure-function tests for detectExpectedMediaType() and checkReadiness().
 * Imports the actual production implementation directly.
 * No MongoDB. No network. No credentials. No .env.local required.
 */
import {
  checkReadiness,
  detectExpectedMediaType,
} from "../../src/lib/validation/project-readiness";

let passed = 0;
let failed = 0;

function assert(cond: boolean, label: string): void {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

function assertEq<T>(actual: T, expected: T, label: string): void {
  if (actual === expected) { passed++; } else { failed++; console.log(`  FAIL: ${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`); }
}

// ═══════════════════════════════════════════
// detectExpectedMediaType Tests
// ═══════════════════════════════════════════
console.log("## detectExpectedMediaType\n");

// Video extensions
assertEq(detectExpectedMediaType("https://example.com/video.mp4"), "video", ".mp4 → video");
assertEq(detectExpectedMediaType("https://example.com/video.webm"), "video", ".webm → video");
assertEq(detectExpectedMediaType("https://example.com/video.mov"), "video", ".mov → video");

// Image extensions
assertEq(detectExpectedMediaType("https://example.com/photo.jpg"), "image", ".jpg → image");
assertEq(detectExpectedMediaType("https://example.com/photo.jpeg"), "image", ".jpeg → image");
assertEq(detectExpectedMediaType("https://example.com/photo.png"), "image", ".png → image");
assertEq(detectExpectedMediaType("https://example.com/photo.webp"), "image", ".webp → image");

// Uppercase extension
assertEq(detectExpectedMediaType("https://example.com/photo.JPG"), "image", ".JPG uppercase → image");
assertEq(detectExpectedMediaType("https://example.com/video.MP4"), "video", ".MP4 uppercase → video");

// Query params and fragments
assertEq(detectExpectedMediaType("https://example.com/photo.jpg?w=800&h=600"), "image", ".jpg with query params → image");
assertEq(detectExpectedMediaType("https://example.com/photo.jpg#fragment"), "image", ".jpg with fragment → image");
assertEq(detectExpectedMediaType("https://example.com/video.mp4?t=30"), "video", ".mp4 with query params → video");

// Cloudinary URL with extension
assertEq(detectExpectedMediaType("https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature.jpg"), "image", "Cloudinary .jpg → image");
assertEq(detectExpectedMediaType("https://res.cloudinary.com/demo/video/upload/v1/samples/sample.mp4"), "video", "Cloudinary .mp4 → video");

// Unknown extension
assertEq(detectExpectedMediaType("https://example.com/file.unknown"), null, "unknown extension → null");
assertEq(detectExpectedMediaType("https://example.com/file"), null, "no extension → null");

// Empty URL
assertEq(detectExpectedMediaType(""), null, "empty string → null");
assertEq(detectExpectedMediaType(null as unknown as string), null, "null → null");
assertEq(detectExpectedMediaType(undefined as unknown as string), null, "undefined → null");

console.log(`\n  detectExpectedMediaType: ${passed}/${passed + failed} passed\n`);

// ═══════════════════════════════════════════
// checkReadiness Tests
// ═══════════════════════════════════════════

const completeProject: Record<string, unknown> = {
  title: "My Real Project",
  slug: "test-project",
  shortDescription: "A short description",
  fullDescription: "A full description",
  category: "film",
  categories: ["film"],
  image: "https://example.com/cover.jpg",
  caseStudyMedia: [{ type: "image", src: "https://example.com/media.jpg", alt: "alt text", caption: "caption text" }],
  gallery: ["https://example.com/gallery.jpg"],
  services: ["editing"],
  tags: ["test"],
  detailedResults: [{ label: "Views", value: "100" }],
  sections: [{ id: "s1", title: "Section", content: "Content", media: [] }],
  client: "Test Client",
  clientName: "",
  year: "2026",
  results: "Test results",
  strategy: "Test strategy",
  idea: "",
  execution: "Test execution",
  seo: { title: "SEO Title", description: "SEO Desc", keywords: ["kw"] },
  status: "published",
};

console.log("## checkReadiness\n");

// Complete published baseline
{
  const r = checkReadiness({ ...completeProject });
  if (r.issues.length > 0) {
    console.log("  DEBUG: Complete project issues:", JSON.stringify(r.issues));
  }
  assert(r.isPublishReady === true, "Complete published: isPublishReady === true");
  assert(r.issues.length === 0, `Complete published: 0 issues (got ${r.issues.length})`);
}

// Empty title
{
  const r = checkReadiness({ ...completeProject, title: "" });
  const found = r.issues.find(i => i.field === "title" && i.severity === "blocking");
  assert(!!found, "Empty title → blocking issue");
}

// Empty slug
{
  const r = checkReadiness({ ...completeProject, slug: "" });
  const found = r.issues.find(i => i.field === "slug" && i.severity === "blocking");
  assert(!!found, "Empty slug → blocking issue");
}

// Empty shortDescription
{
  const r = checkReadiness({ ...completeProject, shortDescription: "" });
  const found = r.issues.find(i => i.field === "shortDescription" && i.severity === "blocking");
  assert(!!found, "Empty shortDescription → blocking issue");
}

// Empty fullDescription
{
  const r = checkReadiness({ ...completeProject, fullDescription: "" });
  const found = r.issues.find(i => i.field === "fullDescription" && i.severity === "blocking");
  assert(!!found, "Empty fullDescription → blocking issue");
}

// Empty category
{
  const r = checkReadiness({ ...completeProject, category: "" });
  const found = r.issues.find(i => i.field === "category" && i.severity === "blocking");
  assert(!!found, "Empty category → blocking issue");
}

// Empty categories array
{
  const r = checkReadiness({ ...completeProject, categories: [] });
  const found = r.issues.find(i => i.field === "categories" && i.severity === "blocking");
  assert(!!found, "Empty categories array → blocking issue");
}

// Empty image / thumbnail
{
  const r = checkReadiness({ ...completeProject, image: "" });
  const found = r.issues.find(i => i.field === "image" && i.severity === "blocking");
  assert(!!found, "Empty image → blocking issue");
}

// Empty media src
{
  const r = checkReadiness({ ...completeProject, caseStudyMedia: [{ type: "image", src: "", alt: "a", caption: "c" }] });
  const found = r.issues.find(i => i.field === "caseStudyMedia[0].src" && i.severity === "blocking");
  assert(!!found, "Empty media src → blocking issue");
}

// Featured with no thumbnail
{
  const r = checkReadiness({ ...completeProject, featured: true, image: "" });
  const found = r.issues.find(i => i.field === "image" && i.severity === "blocking" && (i.message as string).includes("Featured"));
  assert(!!found, "Featured without thumbnail → featured blocking issue");
}

// Featured with no caseStudyMedia
{
  const r = checkReadiness({ ...completeProject, featured: true, caseStudyMedia: [] });
  const found = r.issues.find(i => i.field === "caseStudyMedia" && i.severity === "blocking" && (i.message as string).includes("Featured"));
  assert(!!found, "Featured without caseStudyMedia → blocking issue");
}

// ═══════════════════════════════════════════
// Placeholder detection — regression tests
// ═══════════════════════════════════════════
console.log("\n## Placeholder Detection\n");

// Exact placeholder → blocked
{
  const r = checkReadiness({ ...completeProject, title: "Test Project" });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Exact placeholder 'Test Project' → blocked");
}

// "New Project" exact match → blocked
{
  const r = checkReadiness({ ...completeProject, title: "New Project" });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Exact placeholder 'New Project' → blocked");
}

// "Untitled Project" exact match → blocked
{
  const r = checkReadiness({ ...completeProject, title: "Untitled Project" });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Exact placeholder 'Untitled Project' → blocked");
}

// Case-insensitive placeholder → blocked
{
  const r = checkReadiness({ ...completeProject, title: "new project" });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Case-insensitive 'new project' → blocked");
}

// Trimmed placeholder → blocked
{
  const r = checkReadiness({ ...completeProject, title: "  Test Project  " });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Trimmed '  Test Project  ' → blocked");
}

// Extended title → allowed (false-positive regression)
{
  const r = checkReadiness({ ...completeProject, title: "New Project Management Platform" });
  const placeholderIssues = r.issues.filter(i => (i.message as string).includes("placeholder"));
  assert(placeholderIssues.length === 0, `Extended title 'New Project Management Platform' → NOT flagged (got ${placeholderIssues.length} placeholder issues)`);
}

// "New Project Launch Campaign" → allowed
{
  const r = checkReadiness({ ...completeProject, title: "New Project Launch Campaign" });
  const placeholderIssues = r.issues.filter(i => (i.message as string).includes("placeholder"));
  assert(placeholderIssues.length === 0, "Extended title 'New Project Launch Campaign' → NOT flagged");
}

// "Test Projector Hardware" → allowed (false-positive regression)
{
  const r = checkReadiness({ ...completeProject, title: "Test Projector Hardware" });
  const placeholderIssues = r.issues.filter(i => (i.message as string).includes("placeholder"));
  assert(placeholderIssues.length === 0, "'Test Projector Hardware' → NOT flagged");
}

// "Creative Personal Project Management" → allowed
{
  const r = checkReadiness({ ...completeProject, title: "Creative Personal Project Management" });
  const placeholderIssues = r.issues.filter(i => (i.message as string).includes("placeholder"));
  assert(placeholderIssues.length === 0, "'Creative Personal Project Management' → NOT flagged");
}

// "Arcade Experience" exact → blocked
{
  const r = checkReadiness({ ...completeProject, title: "Arcade Experience" });
  const found = r.issues.find(i => i.field === "title" && (i.message as string).includes("placeholder"));
  assert(!!found, "Exact placeholder 'Arcade Experience' → blocked");
}

// "arcade experience premium" → allowed (not exact)
{
  const r = checkReadiness({ ...completeProject, title: "Arcade Experience Premium" });
  const placeholderIssues = r.issues.filter(i => (i.message as string).includes("placeholder"));
  assert(placeholderIssues.length === 0, "'Arcade Experience Premium' → NOT flagged");
}

// SEO placeholder → blocked
{
  const r = checkReadiness({ ...completeProject, seo: { title: "Sample Project", description: "SEO Desc", keywords: ["kw"] } });
  const found = r.issues.find(i => i.field === "seo.title" && (i.message as string).includes("placeholder"));
  assert(!!found, "SEO title 'Sample Project' → blocked");
}

// Warning: SEO title empty
{
  const r = checkReadiness({ ...completeProject, seo: { title: "", description: "desc", keywords: ["kw"] } });
  const found = r.issues.find(i => i.field === "seo.title" && i.severity === "warning");
  assert(!!found, "Empty SEO title → warning");
}

// Warning: SEO description empty
{
  const r = checkReadiness({ ...completeProject, seo: { title: "title", description: "", keywords: ["kw"] } });
  const found = r.issues.find(i => i.field === "seo.description" && i.severity === "warning");
  assert(!!found, "Empty SEO description → warning");
}

// Warning: SEO keywords empty
{
  const r = checkReadiness({ ...completeProject, seo: { title: "title", description: "desc", keywords: [] } });
  const found = r.issues.find(i => i.field === "seo.keywords" && i.severity === "warning");
  assert(!!found, "Empty SEO keywords → warning");
}

// Warning: services empty
{
  const r = checkReadiness({ ...completeProject, services: [] });
  const found = r.issues.find(i => i.field === "services" && i.severity === "warning");
  assert(!!found, "Empty services → warning");
}

// Warning: tags empty
{
  const r = checkReadiness({ ...completeProject, tags: [] });
  const found = r.issues.find(i => i.field === "tags" && i.severity === "warning");
  assert(!!found, "Empty tags → warning");
}

// Warning: gallery empty
{
  const r = checkReadiness({ ...completeProject, gallery: [] });
  const found = r.issues.find(i => i.field === "gallery" && i.severity === "warning");
  assert(!!found, "Empty gallery → warning");
}

// Warning: alt text empty
{
  const r = checkReadiness({ ...completeProject, caseStudyMedia: [{ type: "image", src: "https://example.com/m.jpg", alt: "", caption: "cap" }] });
  const found = r.issues.find(i => i.field === "caseStudyMedia[0].alt" && i.severity === "warning");
  assert(!!found, "Missing alt text → warning");
}

// Warning: caption empty
{
  const r = checkReadiness({ ...completeProject, caseStudyMedia: [{ type: "image", src: "https://example.com/m.jpg", alt: "alt", caption: "" }] });
  const found = r.issues.find(i => i.field === "caseStudyMedia[0].caption" && i.severity === "warning");
  assert(!!found, "Missing caption → warning");
}

// Warning: narrative fields (client, year, results, strategy, execution)
{
  const r = checkReadiness({ ...completeProject, client: "", clientName: "", year: "", results: "", strategy: "", idea: "", execution: "" });
  const narrativeWarnings = ["client", "year", "results", "strategy", "execution"]
    .map(f => r.issues.find(i => i.field === f && i.severity === "warning"))
    .filter(Boolean);
  assert(narrativeWarnings.length >= 4, `Narrative fields produce warnings (got ${narrativeWarnings.length})`);
}

// ─── Summary ───
const total = passed + failed;
console.log(`\n## Summary`);
console.log(`Passed: ${passed} / ${total}`);
console.log(`Failed: ${failed} / ${total}`);
process.exit(failed > 0 ? 1 : 0);
