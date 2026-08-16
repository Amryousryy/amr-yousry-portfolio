/**
 * CI-safe unit tests for insight engine pure helpers.
 * No MongoDB. No network. No credentials.
 */
import { safeProjectTitle } from "../../src/lib/safe-project-title";
import { getPopularProjectSlugs } from "../../src/lib/popular-projects";

let passed = 0;
let failed = 0;

function assertEq<T>(actual: T, expected: T, label: string): void {
  if (actual === expected) { passed++; } else { failed++; console.log(`  FAIL: ${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`); }
}

function assertDeepEq<T>(actual: T, expected: T, label: string): void {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a === b) { passed++; } else { failed++; console.log(`  FAIL: ${label} (expected ${b}, got ${a})`); }
}

console.log("## Insight Engine — safeProjectTitle\n");

// Flat string title
assertEq(safeProjectTitle({ title: "My Project" }), "My Project", "flat string title");

// Empty string → fallback
assertEq(safeProjectTitle({ title: "" }), "Untitled project", "empty title → fallback");

// Whitespace-only → fallback
assertEq(safeProjectTitle({ title: "   " }), "Untitled project", "whitespace title → fallback");

// null/undefined project → fallback
assertEq(safeProjectTitle(null), "Untitled project", "null project → fallback");
assertEq(safeProjectTitle(undefined), "Untitled project", "undefined project → fallback");

// Missing title field → fallback
assertEq(safeProjectTitle({} as { title?: string }), "Untitled project", "missing title → fallback");

// Title with special characters
assertEq(safeProjectTitle({ title: "Project Alpha v2.0" }), "Project Alpha v2.0", "title with special chars");

// Title with trailing space returned as-is (trim only guards empty/whitespace)
assertEq(safeProjectTitle({ title: "  Hello World  " }), "  Hello World  ", "title with leading/trailing spaces");

// Numeric string title
assertEq(safeProjectTitle({ title: "123" }), "123", "numeric string title");

console.log("\n## Insight Engine — getPopularProjectSlugs\n");

// No rows → no slugs
assertDeepEq(getPopularProjectSlugs([]), [], "no rows → no slugs");

// Below threshold → no slugs
assertDeepEq(getPopularProjectSlugs([{ _id: "a", views: 10 }]), [], "below threshold → no slugs");

// Exactly at threshold → not popular
assertDeepEq(getPopularProjectSlugs([{ _id: "x", views: 50 }]), [], "exactly at threshold → no slugs");

// Above threshold → slug kept
assertDeepEq(getPopularProjectSlugs([{ _id: "hot", views: 60 }]), ["hot"], "above threshold → slug kept");

// Mixed rows → only above-threshold slugs
assertDeepEq(
  getPopularProjectSlugs([
    { _id: "low", views: 5 },
    { _id: "high", views: 100 },
  ]),
  ["high"],
  "only above-threshold slugs kept"
);

// Duplicate slugs deduped
assertDeepEq(
  getPopularProjectSlugs([
    { _id: "dup", views: 80 },
    { _id: "dup", views: 90 },
  ]),
  ["dup"],
  "duplicate slugs deduped"
);

// Non-string or blank slugs ignored
assertDeepEq(
  getPopularProjectSlugs([
    { _id: 12345, views: 80 },
    { _id: null, views: 80 },
    { _id: undefined, views: 80 },
    { _id: "   ", views: 80 },
  ]),
  [],
  "non-string or blank slugs ignored"
);

// Empty string row ignored
assertDeepEq(getPopularProjectSlugs([{ _id: "", views: 80 }]), [], "empty string slug ignored");

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
