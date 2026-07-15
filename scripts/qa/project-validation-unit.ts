import { projectCreateSchema } from "../../src/lib/validation/project";

let passed = 0;
let failed = 0;

function assert(cond: boolean, label: string): void {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

console.log("## Project Validation Unit Tests\n");

// 1. Slug validation
const validSlug = projectCreateSchema.safeParse({ slug: "my-project", title: "T", status: "draft" });
assert(validSlug.success, "valid slug accepted");

const spacedSlug = projectCreateSchema.safeParse({ slug: "my project", title: "T", status: "draft" });
assert(!spacedSlug.success, "slug with spaces rejected");

const arabicSlug = projectCreateSchema.safeParse({ slug: "مشروع", title: "T", status: "draft" });
assert(!arabicSlug.success, "arabic slug rejected");

const leadingHyphenSlug = projectCreateSchema.safeParse({ slug: "-my-project", title: "T", status: "draft" });
assert(!leadingHyphenSlug.success, "leading hyphen slug rejected");

// 2. Status validation
const invalidStatus = projectCreateSchema.safeParse({ slug: "p", title: "T", status: "invalid" });
assert(!invalidStatus.success, "invalid status rejected");

// 3. Required Title
const missingTitle = projectCreateSchema.safeParse({ slug: "p", title: "", status: "draft" });
assert(!missingTitle.success, "missing title rejected");

// 4. Media URL validation
const validImage = projectCreateSchema.safeParse({ slug: "p", title: "T", status: "draft", image: "https://example.com/img.jpg" });
assert(validImage.success, "valid image URL accepted");

const invalidImage = projectCreateSchema.safeParse({ slug: "p", title: "T", status: "draft", image: "javascript:alert(1)" });
assert(!invalidImage.success, "unsafe image URL rejected");

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);
if (failed > 0) process.exit(1);
