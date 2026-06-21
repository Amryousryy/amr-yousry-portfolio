/**
 * Unit tests for public contact/social content helpers.
 *
 * Tests the pure normalizeContactContent(), normalizeSocialLinks(),
 * isValidEmail(), isValidUrl(), isPublished(), and toStr() functions
 * without DB or network.
 */
import {
  normalizeContactContent,
  normalizeSocialLinks,
  isValidEmail,
  isValidUrl,
  isPublished,
  toStr,
  FALLBACK_CONTACT,
  FALLBACK_SOCIALS,
} from "../../src/lib/contact-content-normalizer";

let passed = 0;
let failed = 0;

function assert(cond: boolean, label: string): void {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

// ────────────────────────────────────────────────────────────────────
console.log("## Public Contact Content — Normalizer\n");

// 1. isValidEmail
console.log("## isValidEmail\n");
assert(isValidEmail("test@example.com") === true, "accepts valid email");
assert(isValidEmail("") === false, "rejects empty string");
assert(isValidEmail("   ") === false, "rejects whitespace-only");
assert(isValidEmail("javascript:alert(1)") === false, "rejects javascript: protocol");
assert(isValidEmail("data:text/html,test") === false, "rejects data: protocol");
assert(isValidEmail("notanemail") === false, "rejects missing @");
const longEmail = "a".repeat(250) + "@b.com";
assert(isValidEmail(longEmail) === false, "rejects too-long email");

// 2. isValidUrl
console.log("\n## isValidUrl\n");
assert(isValidUrl("https://example.com/page") === true, "accepts https url");
assert(isValidUrl("http://example.com") === true, "accepts http url");
assert(isValidUrl("") === false, "rejects empty string");
assert(isValidUrl("javascript:void(0)") === false, "rejects javascript: protocol");
assert(isValidUrl("data:text/html,test") === false, "rejects data: protocol");
assert(isValidUrl("ftp://example.com") === false, "rejects ftp protocol");
assert(isValidUrl("not-a-url") === false, "rejects malformed url");

// 3. normalizeSocialLinks
console.log("\n## normalizeSocialLinks\n");
assert(normalizeSocialLinks(null) === FALLBACK_SOCIALS, "null returns fallback");
assert(normalizeSocialLinks(undefined) === FALLBACK_SOCIALS, "undefined returns fallback");
const knownResult = normalizeSocialLinks({
  instagram: "https://instagram.com/test",
  linkedin: "https://linkedin.com/in/test",
  facebook: "https://facebook.com/test",
  behance: "https://behance.net/test",
});
assert(knownResult.length === 4, "maps 4 known socials in priority order");
assert(knownResult[0].label === "INSTAGRAM", "instagram first");
assert(knownResult[1].label === "FACEBOOK", "facebook second");
assert(knownResult[2].label === "BEHANCE", "behance third");
assert(knownResult[3].label === "LINKEDIN", "linkedin fourth");

const jsResult = normalizeSocialLinks({
  instagram: "javascript:alert(1)",
  linkedin: "https://linkedin.com/in/test",
});
assert(jsResult.length === 1, "rejects javascript: URLs");
assert(jsResult[0].label === "LINKEDIN", "keeps valid after filtering invalid");

const emptyResult = normalizeSocialLinks({
  instagram: "",
  linkedin: "",
});
assert(emptyResult === FALLBACK_SOCIALS, "all empty returns fallback");

const allInvalid = normalizeSocialLinks({
  instagram: "javascript:alert(1)",
  linkedin: "data:text/html,test",
});
assert(allInvalid === FALLBACK_SOCIALS, "all invalid returns fallback");

const extrasResult = normalizeSocialLinks({
  instagram: "https://instagram.com/test",
  youtube: "https://youtube.com/@test",
  twitter: "https://twitter.com/test",
});
const extrasLabels = extrasResult.map((s) => s.label);
assert(extrasLabels.includes("TWITTER"), "maps twitter if present");
assert(extrasLabels.includes("YOUTUBE"), "maps youtube if present");

// 4. normalizeContactContent
console.log("\n## normalizeContactContent\n");
assert(normalizeContactContent(null) === FALLBACK_CONTACT, "null returns fallback");
assert(normalizeContactContent(undefined) === FALLBACK_CONTACT, "undefined returns fallback");

const draftResult = normalizeContactContent({
  status: "draft",
  contactEmail: "draft@example.com",
  whatsappNumber: "201000000000",
});
assert(draftResult === FALLBACK_CONTACT, "draft returns fallback");

const publishedResult = normalizeContactContent({
  status: "published",
  contactEmail: "admin@example.com",
  whatsappNumber: "201234567890",
  socialLinks: { instagram: "https://instagram.com/test" },
});
assert(publishedResult.email === "admin@example.com", "uses published email");
assert(publishedResult.whatsappNumber === "201234567890", "uses published whatsapp");
assert(publishedResult.socials.length >= 1, "includes social links");

const emptyEmailResult = normalizeContactContent({
  status: "published",
  contactEmail: "",
  whatsappNumber: "201234567890",
});
assert(emptyEmailResult.email === FALLBACK_CONTACT.email, "empty email falls back");

const invalidEmailResult = normalizeContactContent({
  status: "published",
  contactEmail: "not-an-email",
  whatsappNumber: "201234567890",
});
assert(invalidEmailResult.email === FALLBACK_CONTACT.email, "invalid email falls back");

const emptyWhatsappResult = normalizeContactContent({
  status: "published",
  contactEmail: "admin@example.com",
  whatsappNumber: "",
});
assert(emptyWhatsappResult.whatsappNumber === FALLBACK_CONTACT.whatsappNumber, "empty whatsapp falls back");

const partialSocialResult = normalizeContactContent({
  status: "published",
  contactEmail: "admin@example.com",
  whatsappNumber: "201234567890",
  socialLinks: { instagram: "https://instagram.com/test" },
});
assert(partialSocialResult.email === "admin@example.com", "partial CMS keeps valid email");
assert(partialSocialResult.socials.length >= 1, "partial CMS socials have at least 1");

// 5. isPublished
console.log("\n## isPublished\n");
assert(isPublished({ status: "published" }) === true, "published returns true");
assert(isPublished({ status: "draft" }) === false, "draft returns false");
assert(isPublished(null) === false, "null returns false");
assert(isPublished(undefined) === false, "undefined returns false");
assert(isPublished({}) === false, "missing status returns false");

// 6. toStr
console.log("\n## toStr\n");
assert(toStr("hello") === "hello", "string returns as-is");
assert(toStr({ en: "hello", ar: "مرحبا" }) === "hello", "bilingual extracts en");
assert(toStr(42) === "", "number returns empty");
assert(toStr(null) === "", "null returns empty");
assert(toStr(undefined) === "", "undefined returns empty");

// ────────────────────────────────────────────────────────────────────
console.log(`\n## Results: ${passed} passed, ${failed} failed${failed > 0 ? ' — FAIL' : ' — PASS'}\n`);
process.exit(failed > 0 ? 1 : 0);
