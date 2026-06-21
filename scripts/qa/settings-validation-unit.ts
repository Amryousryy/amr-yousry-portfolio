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

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
