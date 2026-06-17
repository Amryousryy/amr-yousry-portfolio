/**
 * CI-safe unit tests for settings validation schemas.
 * No MongoDB. No network. No credentials.
 */
import { heroCreateSchema } from "../../src/lib/validation/hero-settings";

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

console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
