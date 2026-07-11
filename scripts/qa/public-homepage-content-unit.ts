/**
 * Unit tests for public homepage content helpers.
 *
 * Tests normalizer functions without DB or network.
 */
import { normalizeHeroContent, FALLBACK_HERO } from "../../src/lib/hero-content-normalizer";
import { normalizeAboutContent } from "../../src/lib/about-content-normalizer";
import { aboutContent } from "../../src/content/about";

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

// ────────────────────────────────────────────────────────────────────
console.log("\n## About Content — normalizeAboutContent\n");

// 1. null/undefined CMS returns fallback
const nullResult = normalizeAboutContent(null, aboutContent);
assert(nullResult === aboutContent, "null CMS — returns fallback identity");

const undefResult = normalizeAboutContent(undefined, aboutContent);
assert(undefResult === aboutContent, "undefined CMS — returns fallback identity");

// 2. CMS story overrides fallback
const storyOverride = normalizeAboutContent({
  story: ["CMS paragraph 1", "CMS paragraph 2"],
  stats: [],
}, aboutContent);
assert(storyOverride.story.length === 2, "CMS story array — overrides fallback");
assert(storyOverride.story[0] === "CMS paragraph 1", "CMS story array — first paragraph correct");
assert(storyOverride.story[1] === "CMS paragraph 2", "CMS story array — second paragraph correct");
assert(storyOverride.badge === aboutContent.badge, "CMS story array — badge preserved from fallback");
assert(storyOverride.skillClusters === aboutContent.skillClusters, "CMS story array — skillClusters preserved from fallback");
assert(storyOverride.industries === aboutContent.industries, "CMS story array — industries preserved from fallback");

// 3. CMS story as string (multiline) overrides and splits
const multilineStory = normalizeAboutContent({
  story: "Line one\n\nLine two\nLine three",
  stats: [],
}, aboutContent);
assert(multilineStory.story.length === 3, "CMS story multiline — splits into 3 paragraphs");
assert(multilineStory.story[0] === "Line one", "CMS story multiline — first line correct");
assert(multilineStory.story[2] === "Line three", "CMS story multiline — third line correct");

// 4. CMS stats override fallback when valid
const statsOverride = normalizeAboutContent({
  story: [],
  stats: [
    { label: "CMS LABEL 1", value: "100+" },
    { label: "CMS LABEL 2", value: "50+" },
  ],
}, aboutContent);
assert(statsOverride.stats.length === 2, "CMS stats — overrides fallback");
assert(statsOverride.stats[0].label === "CMS LABEL 1", "CMS stats — first label correct");
assert(statsOverride.stats[0].value === "100+", "CMS stats — first value correct");

// 5. CMS stats with invalid entries (missing label or value) filtered out
const partialStats = normalizeAboutContent({
  story: [],
  stats: [
    { label: "VALID", value: "YES" },
    { label: "", value: "NO" },
    { label: "NO", value: "" },
  ],
}, aboutContent);
assert(partialStats.stats.length >= 1, "partial stats — at least one valid stat");
assert(partialStats.stats[0].label === "VALID", "partial stats — valid entry kept");
assert(partialStats.stats[0].value === "YES", "partial stats — valid entry value correct");

// 6. Empty CMS stats fall back safely
const emptyStats = normalizeAboutContent({
  story: [],
  stats: [],
}, aboutContent);
assert(emptyStats.stats === aboutContent.stats, "empty CMS stats — falls back to static stats");

// 7. Empty CMS story falls back safely
const emptyStory = normalizeAboutContent({
  story: [],
  stats: [],
}, aboutContent);
assert(emptyStory.story === aboutContent.story, "empty CMS story — falls back to static story");

// 8. CMS content field (from settings.about.content) treated as story fallback
const contentField = normalizeAboutContent({
  content: "Single paragraph from content field",
  stats: [],
}, aboutContent);
assert(contentField.story.length === 1, "content field — single paragraph");
assert(contentField.story[0] === "Single paragraph from content field", "content field — text matches");

// 9. Both content and story provided — story takes precedence
const contentVsStory = normalizeAboutContent({
  content: "Content field text",
  story: "Story field text",
  stats: [],
}, aboutContent);
assert(contentVsStory.story.length === 1, "content+story — story wins");
assert(contentVsStory.story[0] === "Story field text", "content+story — story text correct");

// 10. CMS with only story preserves all complex fallback fields
const complexPreserved = normalizeAboutContent({
  story: ["New story"],
  stats: [],
}, aboutContent);
assert(complexPreserved.badge === aboutContent.badge, "complex fields — badge preserved");
assert(complexPreserved.heading === aboutContent.heading, "complex fields — heading preserved");
assert(complexPreserved.skillClusters === aboutContent.skillClusters, "complex fields — skillClusters preserved");
assert(complexPreserved.industries === aboutContent.industries, "complex fields — industries preserved");

// 11. CMS heading overrides fallback
const headingOverride = normalizeAboutContent({
  story: ["New story"],
  heading: "SENIOR\nMULTIMEDIA\nDESIGNER.",
  stats: [],
}, aboutContent);
assert(headingOverride.heading === "SENIOR\nMULTIMEDIA\nDESIGNER.", "heading override — CMS heading used");
assert(headingOverride.badge === aboutContent.badge, "heading override — badge preserved");

// 12. CMS empty heading falls back
const emptyHeading = normalizeAboutContent({
  story: ["New story"],
  heading: "",
  stats: [],
}, aboutContent);
assert(emptyHeading.heading === aboutContent.heading, "empty CMS heading — falls back to static");

// 13. CMS whitespace-only heading falls back
const whitespaceHeading = normalizeAboutContent({
  story: ["New story"],
  heading: "   ",
  stats: [],
}, aboutContent);
assert(whitespaceHeading.heading === aboutContent.heading, "whitespace CMS heading — falls back to static");

// 14. CMS badge overrides fallback
const badgeOverride = normalizeAboutContent({
  story: [],
  badge: "CMS BADGE TEXT",
  stats: [],
}, aboutContent);
assert(badgeOverride.badge === "CMS BADGE TEXT", "badge override — CMS badge used");
assert(badgeOverride.heading === aboutContent.heading, "badge override — heading preserved from fallback");

// 15. CMS empty badge falls back
const emptyBadge = normalizeAboutContent({
  story: [],
  badge: "",
  stats: [],
}, aboutContent);
assert(emptyBadge.badge === aboutContent.badge, "empty CMS badge — falls back to static");

// 16. CMS whitespace-only badge falls back
const whitespaceBadge = normalizeAboutContent({
  story: [],
  badge: "   ",
  stats: [],
}, aboutContent);
assert(whitespaceBadge.badge === aboutContent.badge, "whitespace CMS badge — falls back to static");

// 17. CMS CTA label/link override fallback
const ctaOverride = normalizeAboutContent({
  story: [],
  ctaLabel: "Custom CTA",
  ctaLink: "/custom-path",
  stats: [],
}, aboutContent);
assert(ctaOverride.ctaLabel === "Custom CTA", "CTA label override — CMS label used");
assert(ctaOverride.ctaLink === "/custom-path", "CTA link override — CMS link used");

// 18. unsafe CTA link falls back safely
const unsafeCta = normalizeAboutContent({
  story: [],
  ctaLabel: "Bad CTA",
  ctaLink: "javascript:alert(1)",
  stats: [],
}, aboutContent);
assert(unsafeCta.ctaLink === aboutContent.ctaLink, "unsafe CTA link — falls back to static");
assert(unsafeCta.ctaLabel === "Bad CTA", "unsafe CTA link — label still overrides");

// 19. valid #contact CTA link is preserved
const hashCta = normalizeAboutContent({
  story: [],
  ctaLink: "#contact",
  stats: [],
}, aboutContent);
assert(hashCta.ctaLink === "#contact", "hash CTA link — preserved");

// 20. valid https:// CTA link is preserved
const httpsCta = normalizeAboutContent({
  story: [],
  ctaLink: "https://example.com/contact",
  stats: [],
}, aboutContent);
assert(httpsCta.ctaLink === "https://example.com/contact", "https CTA link — preserved");

// 21. empty CTA label falls back
const emptyCtaLabel = normalizeAboutContent({
  story: [],
  ctaLabel: "",
  ctaLink: "",
  stats: [],
}, aboutContent);
assert(emptyCtaLabel.ctaLabel === aboutContent.ctaLabel, "empty CTA label — falls back to static");
assert(emptyCtaLabel.ctaLink === aboutContent.ctaLink, "empty CTA link — falls back to static");

// 22. CMS skills override Creative Loadout items
const skillsOverride = normalizeAboutContent({
  story: [],
  skills: ["Skill A", "Skill B", "Skill C"],
  stats: [],
}, aboutContent);
assert(skillsOverride.skillClusters.length === 1, "skills override — one cluster");
assert(skillsOverride.skillClusters[0].title === aboutContent.skillClusters[0].title, "skills override — cluster title preserved");
assert(skillsOverride.skillClusters[0].skills.length === 3, "skills override — 3 skills");
assert(skillsOverride.skillClusters[0].skills[0] === "Skill A", "skills override — first skill correct");

// 23. empty skills fallback safely
const emptySkills = normalizeAboutContent({
  story: [],
  skills: [],
  stats: [],
}, aboutContent);
assert(emptySkills.skillClusters === aboutContent.skillClusters, "empty skills — falls back to static clusters");

// 24. CMS industries override Mission Sectors
const industriesOverride = normalizeAboutContent({
  story: [],
  industries: ["Industry X", "Industry Y"],
  stats: [],
}, aboutContent);
assert(industriesOverride.industries.length === 2, "industries override — 2 industries");
assert(industriesOverride.industries[0] === "Industry X", "industries override — first correct");
assert(industriesOverride.industries[1] === "Industry Y", "industries override — second correct");

// 25. empty industries fallback safely
const emptyIndustries = normalizeAboutContent({
  story: [],
  industries: [],
  stats: [],
}, aboutContent);
assert(emptyIndustries.industries === aboutContent.industries, "empty industries — falls back to static");

// 26. data: CTA link falls back safely
const dataCta = normalizeAboutContent({
  story: [],
  ctaLink: "data:text/html,test",
  stats: [],
}, aboutContent);
assert(dataCta.ctaLink === aboutContent.ctaLink, "data: CTA link — falls back to static");

// 27. ftp: CTA link falls back safely
const ftpCta = normalizeAboutContent({
  story: [],
  ctaLink: "ftp://files.example.com/file",
  stats: [],
}, aboutContent);
assert(ftpCta.ctaLink === aboutContent.ctaLink, "ftp: CTA link — falls back to static");

// 28. mailto: CTA link falls back safely
const mailtoCta = normalizeAboutContent({
  story: [],
  ctaLink: "mailto:test@example.com",
  stats: [],
}, aboutContent);
assert(mailtoCta.ctaLink === aboutContent.ctaLink, "mailto: CTA link — falls back to static");

// 29. CMS skills with whitespace-only entries filtered
const whitespaceSkills = normalizeAboutContent({
  story: [],
  skills: ["Valid", "", "  ", "Also Valid"],
  stats: [],
}, aboutContent);
assert(whitespaceSkills.skillClusters[0].skills.length === 2, "whitespace skills — filtered to 2 valid entries");
assert(whitespaceSkills.skillClusters[0].skills[0] === "Valid", "whitespace skills — first entry correct");
assert(whitespaceSkills.skillClusters[0].skills[1] === "Also Valid", "whitespace skills — second entry correct");

// 30. CMS industries with whitespace-only entries filtered
const whitespaceIndustries = normalizeAboutContent({
  story: [],
  industries: ["Valid", "", "  "],
  stats: [],
}, aboutContent);
assert(whitespaceIndustries.industries.length === 1, "whitespace industries — filtered to 1 valid entry");
assert(whitespaceIndustries.industries[0] === "Valid", "whitespace industries — entry correct");

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
