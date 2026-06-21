/**
 * Unit tests for public homepage content helpers.
 *
 * Tests the pure normalizeHeroContent() function without DB or network.
 */
import { normalizeHeroContent, FALLBACK_HERO } from "../../src/lib/hero-content-normalizer";

let passed = 0;
let failed = 0;

function assert(cond: boolean, label: string): void {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

// ────────────────────────────────────────────────────────────────────
console.log("## Public Homepage Content — normalizeHeroContent\n");

// 1. Published hero overrides fallback
const published = normalizeHeroContent({
  headline: "CMS HEADLINE",
  subheadline: "CMS subheadline",
  primaryCTA: "CMS CTA",
  primaryCTALink: "/cms-link",
  secondaryCTA: "CMS Secondary",
  secondaryCTALink: "/cms-secondary",
  status: "published",
  posterImage: "",
  showreelVideo: "",
}, FALLBACK_HERO);
assert(published.headline === "CMS HEADLINE", "published hero — headline overrides fallback");
assert(published.subheadline === "CMS subheadline", "published hero — subheadline overrides fallback");
assert(published.primaryCTA === "CMS CTA", "published hero — primaryCTA overrides fallback");
assert(published.primaryCTALink === "/cms-link", "published hero — primaryCTALink overrides fallback");
assert(published.secondaryCTA === "CMS Secondary", "published hero — secondaryCTA overrides fallback");
assert(published.secondaryCTALink === "/cms-secondary", "published hero — secondaryCTALink overrides fallback");

// 2. Draft hero uses fallback
const draft = normalizeHeroContent({
  headline: "DRAFT HEADLINE",
  subheadline: "Draft subheadline",
  primaryCTA: "Draft CTA",
  primaryCTALink: "/draft",
  secondaryCTA: "Draft Sec",
  secondaryCTALink: "/draft-sec",
  status: "draft",
}, FALLBACK_HERO);
assert(draft === FALLBACK_HERO, "draft hero — uses fallback");
assert(draft.headline === FALLBACK_HERO.headline, "draft hero — headline is fallback");

// 3. Missing hero (null) uses fallback
const missing = normalizeHeroContent(null, FALLBACK_HERO);
assert(missing === FALLBACK_HERO, "null hero — uses fallback");

const undefinedHero = normalizeHeroContent(undefined, FALLBACK_HERO);
assert(undefinedHero === FALLBACK_HERO, "undefined hero — uses fallback");

// 4. Whitespace-only hero headline uses fallback
const whitespaceHeadline = normalizeHeroContent({
  headline: "   ",
  subheadline: "valid subheadline",
  primaryCTA: "valid CTA",
  primaryCTALink: "/valid",
  secondaryCTA: "valid Sec",
  secondaryCTALink: "/valid-sec",
  status: "published",
}, FALLBACK_HERO);
assert(whitespaceHeadline === FALLBACK_HERO, "whitespace headline — uses fallback");

// 5. Missing CTA label/link uses fallback CTA
const missingCta = normalizeHeroContent({
  headline: "VALID HEADLINE",
  subheadline: "valid subheadline",
  primaryCTA: "",
  primaryCTALink: "/valid",
  secondaryCTA: "valid Sec",
  secondaryCTALink: "/valid-sec",
  status: "published",
}, FALLBACK_HERO);
assert(missingCta === FALLBACK_HERO, "empty primaryCTA — uses fallback");

const missingLink = normalizeHeroContent({
  headline: "VALID HEADLINE",
  subheadline: "valid subheadline",
  primaryCTA: "valid CTA",
  primaryCTALink: "",
  secondaryCTA: "valid Sec",
  secondaryCTALink: "/valid-sec",
  status: "published",
}, FALLBACK_HERO);
assert(missingLink.primaryCTALink === "/projects", "empty primaryCTALink — uses fallback link");
assert(missingLink.headline === "VALID HEADLINE", "empty primaryCTALink — preserves other fields");

// 6. Partial CMS data safely merges with fallback
const partial = normalizeHeroContent({
  headline: "PARTIAL HEADLINE",
  subheadline: "partial subheadline",
  primaryCTA: "partial CTA",
  primaryCTALink: "/partial",
  secondaryCTA: "partial Sec",
  secondaryCTALink: "/partial-sec",
  status: "published",
}, FALLBACK_HERO);
assert(partial.headline === "PARTIAL HEADLINE", "partial hero — headline overrides");
assert(partial.primaryCTA === "partial CTA", "partial hero — CTA overrides");

// 7. Draft content is never exposed publicly
const draftNever = normalizeHeroContent({
  headline: "DRAFT LEAK",
  subheadline: "draft leak",
  primaryCTA: "draft CTA",
  primaryCTALink: "/draft",
  secondaryCTA: "draft Sec",
  secondaryCTALink: "/draft",
  status: "draft",
}, FALLBACK_HERO);
assert(draftNever.headline !== "DRAFT LEAK", "draft content — never exposed");
assert(draftNever.headline === FALLBACK_HERO.headline, "draft content — fallback used");

// 8. Bilingual object in headline is handled
const bilingual = normalizeHeroContent({
  headline: { en: "EN HEADLINE", ar: "AR HEADLINE" },
  subheadline: { en: "EN sub" },
  primaryCTA: "CTA",
  primaryCTALink: "/link",
  secondaryCTA: "Sec",
  secondaryCTALink: "/sec",
  status: "published",
}, FALLBACK_HERO);
assert(bilingual.headline === "EN HEADLINE", "bilingual headline — uses en");

// 9. Empty object in hero fields falls back
const emptyBilingual = normalizeHeroContent({
  headline: { en: "" },
  subheadline: "valid sub",
  primaryCTA: "valid CTA",
  primaryCTALink: "/link",
  secondaryCTA: "valid Sec",
  secondaryCTALink: "/sec",
  status: "published",
}, FALLBACK_HERO);
assert(emptyBilingual === FALLBACK_HERO, "empty en in bilingual headline — uses fallback");

// 10. Unknown status value uses fallback
const unknownStatus = normalizeHeroContent({
  headline: "VALID",
  subheadline: "valid",
  primaryCTA: "valid",
  primaryCTALink: "/valid",
  secondaryCTA: "valid",
  secondaryCTALink: "/valid",
  status: "archived",
}, FALLBACK_HERO);
assert(unknownStatus === FALLBACK_HERO, "unknown status — uses fallback");

// 11. CTA Link Normalization
const ctaTests = [
  { pLink: "/projects", sLink: "#contact", expectedP: "/projects", expectedS: "#contact", label: "preserved valid" },
  { pLink: "projects", sLink: "contact", expectedP: "/projects", expectedS: "#contact", label: "normalized alias" },
  { pLink: "show projects", sLink: "contact me", expectedP: "/projects", expectedS: "#contact", label: "normalized alias phrase" },
  { pLink: "", sLink: "", expectedP: "/projects", expectedS: "#contact", label: "empty links fallback" },
  { pLink: "javascript:alert(1)", sLink: "javascript:alert(1)", expectedP: "/projects", expectedS: "#contact", label: "unsafe links fallback" },
  { pLink: "/contact", sLink: "/contact", expectedP: "/projects", expectedS: "#contact", label: "normalized slash contact" },
  { pLink: "https://example.com", sLink: "https://example.com", expectedP: "https://example.com", expectedS: "https://example.com", label: "external links preserved" },
];

ctaTests.forEach(({ pLink, sLink, expectedP, expectedS, label }) => {
  const result = normalizeHeroContent({
    headline: "H",
    subheadline: "S",
    primaryCTA: "P",
    primaryCTALink: pLink,
    secondaryCTA: "S",
    secondaryCTALink: sLink,
    status: "published",
  }, FALLBACK_HERO);
  assert(result.primaryCTALink === expectedP, `CTA normalization: ${label} (primary)`);
  assert(result.secondaryCTALink === expectedS, `CTA normalization: ${label} (secondary)`);
});

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
