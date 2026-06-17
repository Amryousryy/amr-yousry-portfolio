/**
 * CI-safe unit tests for insight engine pure helpers.
 * No MongoDB. No network. No credentials.
 */
import { safeProjectTitle } from "../../src/lib/safe-project-title";

let passed = 0;
let failed = 0;

function assertEq<T>(actual: T, expected: T, label: string): void {
  if (actual === expected) { passed++; } else { failed++; console.log(`  FAIL: ${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`); }
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

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
