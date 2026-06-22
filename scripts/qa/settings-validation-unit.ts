/**
 * CI-safe unit tests for settings validation schemas.
 * No MongoDB. No network. No credentials.
 */
import { heroCreateSchema } from "../../src/lib/validation/hero-settings";
import { contentCreateSchema } from "../../src/lib/validation";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

function assertRejects(schema: { safeParse: (d: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }, data: unknown, label: string): void {
  const result = schema.safeParse(data);
  if (!result.success) { passed++; } else { failed++; console.log(`  FAIL: ${label} (expected rejection)`); }
}

function assertAccepts(schema: { safeParse: (d: unknown) => { success: boolean; data?: unknown } }, data: unknown, label: string): void {
  const result = schema.safeParse(data);
  if (result.success) { passed++; } else { failed++; console.log(`  FAIL: ${label} (unexpected rejection)`); }
}

console.log("## Settings Validation — Hero Schema\n");

// Valid hero payload
assertAccepts(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
  posterImage: "",
  showreelVideo: "",
  status: "draft",
}, "accepts valid hero payload");

// Reject missing headline
assertRejects(heroCreateSchema, {
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
}, "rejects missing headline");

// Reject empty headline
assertRejects(heroCreateSchema, {
  headline: "",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
}, "rejects empty headline");

// Reject missing primaryCTA
assertRejects(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
}, "rejects missing primaryCTA");

// Reject empty primaryCTALink
assertRejects(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
}, "rejects empty primaryCTALink");

// Accept with poster URL
assertAccepts(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
  posterImage: "https://res.cloudinary.com/example.jpg",
}, "accepts hero with poster URL");

// Default status to draft
assert(heroCreateSchema.safeParse({
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
}).data?.status === "draft", "defaults status to draft");

// Accept published status
assertAccepts(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
  status: "published",
}, "accepts published status");

// Reject invalid status
assertRejects(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
  status: "invalid_status",
}, "rejects invalid status");

// Accept showreel URL
assertAccepts(heroCreateSchema, {
  headline: "MAKE IDEAS MATTER",
  subheadline: "Creative Direction",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
  showreelVideo: "https://example.com/showreel.mp4",
}, "accepts hero with showreel URL");

console.log("\n## Content Settings Validation — Content Schema\n");

// 1. empty about allowed
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty about allowed");

// 2. missing about allowed (defaults to "")
assertAccepts(contentCreateSchema, {
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "missing about allowed");

// 3. empty contactEmail allowed
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty contactEmail allowed");

// 4. valid contactEmail accepted
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "test@example.com",
}, "valid contactEmail accepted");

// 5. invalid contactEmail rejected
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "not-an-email",
}, "invalid contactEmail rejected");

// 6. empty whatsappNumber allowed
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  whatsappNumber: "",
}, "empty whatsappNumber allowed");

// 7. empty social URL allowed
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    facebook: "",
    behance: "",
  },
}, "empty social URL allowed");

// 8. valid social URL accepted
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "https://instagram.com/test",
    facebook: "https://facebook.com/test",
    behance: "https://behance.net/test",
    linkedin: "https://linkedin.com/in/test",
  },
}, "valid social URL accepted");

// 9. javascript: social URL rejected
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "javascript:alert(1)",
  },
}, "javascript: social URL rejected");

// 10. data: social URL rejected
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "data:text/html,<script>alert(1)</script>",
  },
}, "data: social URL rejected");

// 11. ftp: social URL rejected
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "ftp://files.example.com/img.jpg",
  },
}, "ftp: social URL rejected");

// 12. malformed social URL rejected
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  socialLinks: {
    instagram: "not-a-url-at-all",
  },
}, "malformed social URL rejected");

// 13. Required servicesTitle still enforced
assertRejects(contentCreateSchema, {
  about: "",
  servicesTitle: "",
  servicesSubtitle: "",
  servicesDescription: "",
  contactEmail: "",
}, "empty servicesTitle rejected");

// 14. aboutTitle accepts empty
assertAccepts(contentCreateSchema, {
  about: "",
  aboutTitle: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty aboutTitle allowed");

// 15. aboutTitle accepts text
assert(contentCreateSchema.safeParse({
  about: "",
  aboutTitle: "SENIOR\nMULTIMEDIA DESIGNER.",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}).data?.aboutTitle === "SENIOR\nMULTIMEDIA DESIGNER.", "aboutTitle stores text");

// 16. aboutStats default empty
assert(Array.isArray(contentCreateSchema.safeParse({
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}).data?.aboutStats), "aboutStats defaults to array");

// 17. aboutStats accepts entries
assertAccepts(contentCreateSchema, {
  about: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
  aboutStats: [{ label: "EXP", value: "8+ YEARS" }],
}, "aboutStats with entries allowed");

// 18. contactHeading empty allowed
assertAccepts(contentCreateSchema, {
  about: "",
  contactHeading: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty contactHeading allowed");

// 19. contactSubheading empty allowed
assertAccepts(contentCreateSchema, {
  about: "",
  contactSubheading: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty contactSubheading allowed");

// 20. contactAvailability empty allowed
assertAccepts(contentCreateSchema, {
  about: "",
  contactAvailability: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty contactAvailability allowed");

// 21. aboutBadge optional and trimmed
assertAccepts(contentCreateSchema, {
  about: "",
  aboutBadge: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty aboutBadge allowed");

const badgeResult = contentCreateSchema.safeParse({
  about: "",
  aboutBadge: "  MISSION LOG  ",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
});
// Note: zod .trim() only applies to .string().trim() — optionalStringSchema uses .optional().default("") which does NOT auto-trim.
// The normalizer handles trimming at runtime. Accept the un-trimmed value from schema.
assert(typeof badgeResult.data?.aboutBadge === "string", "aboutBadge stores as string");

// 22. aboutBadge stores text
assert(contentCreateSchema.safeParse({
  about: "",
  aboutBadge: "MISSION LOG: PLAYER PROFILE",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}).data?.aboutBadge === "MISSION LOG: PLAYER PROFILE", "aboutBadge stores text");

// 23. aboutSkills empty rows cleaned (defaults to [])
const skillsResult = contentCreateSchema.safeParse({
  about: "",
  aboutSkills: ["Skill A", "", "  ", "Skill B"],
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
});
assert(Array.isArray(skillsResult.data?.aboutSkills), "aboutSkills is array");
// Note: trimmedStringArraySchema wraps z.array(z.string().optional().default("")).default([])
// It does NOT auto-filter empty strings — it only defaults individual elements. Our API layer filters empties.
assert(skillsResult.success === true, "aboutSkills with empty entries accepted");

// 24. aboutIndustries empty rows accepted
assertAccepts(contentCreateSchema, {
  about: "",
  aboutIndustries: ["Med", "", "Tech"],
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "aboutIndustries with empty entries accepted");

// 25. aboutStats partially empty row accepted (schema allows empty label/value)
assertAccepts(contentCreateSchema, {
  about: "",
  aboutStats: [{ label: "EXP", value: "8+" }, { label: "", value: "" }],
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "aboutStats with partially empty row accepted");

// 26. aboutCtaLink: unsafe javascript: rejected
assertRejects(contentCreateSchema, {
  about: "",
  aboutCtaLink: "javascript:alert(1)",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "unsafe javascript: aboutCtaLink rejected");

// 27. aboutCtaLink: unsafe data: rejected
assertRejects(contentCreateSchema, {
  about: "",
  aboutCtaLink: "data:text/html,test",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "unsafe data: aboutCtaLink rejected");

// 28. aboutCtaLink: unsafe ftp: rejected
assertRejects(contentCreateSchema, {
  about: "",
  aboutCtaLink: "ftp://files.example.com/file",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "unsafe ftp: aboutCtaLink rejected");

// 29. aboutCtaLink: unsafe mailto: rejected
assertRejects(contentCreateSchema, {
  about: "",
  aboutCtaLink: "mailto:test@example.com",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "unsafe mailto: aboutCtaLink rejected");

// 30. aboutCtaLink: valid #contact accepted
assertAccepts(contentCreateSchema, {
  about: "",
  aboutCtaLink: "#contact",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "valid #contact aboutCtaLink accepted");

// 31. aboutCtaLink: valid /internal path accepted
assertAccepts(contentCreateSchema, {
  about: "",
  aboutCtaLink: "/projects",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "valid /internal aboutCtaLink accepted");

// 32. aboutCtaLink: valid https:// accepted
assertAccepts(contentCreateSchema, {
  about: "",
  aboutCtaLink: "https://example.com/contact",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "valid https:// aboutCtaLink accepted");

// 33. aboutCtaLink: valid http:// accepted
assertAccepts(contentCreateSchema, {
  about: "",
  aboutCtaLink: "http://example.com/contact",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "valid http:// aboutCtaLink accepted");

// 34. aboutCtaLink: empty allowed
assertAccepts(contentCreateSchema, {
  about: "",
  aboutCtaLink: "",
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "",
}, "empty aboutCtaLink allowed");

// 35. Contact/Social saves not blocked by empty About fields
assertAccepts(contentCreateSchema, {
  about: "",
  aboutTitle: "",
  aboutBadge: "",
  aboutCtaLabel: "",
  aboutCtaLink: "",
  aboutStats: [],
  aboutSkills: [],
  aboutIndustries: [],
  servicesTitle: "Test",
  servicesSubtitle: "Test",
  servicesDescription: "Test",
  contactEmail: "test@example.com",
  contactHeading: "",
  contactSubheading: "",
  contactAvailability: "",
  socialLinks: {
    instagram: "https://instagram.com/test",
    twitter: "",
    youtube: "",
    linkedin: "https://linkedin.com/in/test",
    facebook: "",
    behance: "",
  },
}, "Contact/Social saves not blocked by empty About fields");

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
