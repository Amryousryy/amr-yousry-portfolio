/// <reference types="node" />
/**
 * scripts/repair-al-ghazal.ts
 *
 * SAFE ONE-TIME REPAIR — al-ghazal-exhibition only
 * ==================================================
 *
 * Repairs known data corruption on al-ghazal-exhibition caused by admin UI
 * save that cleared nested fields (services, detailedResults, caseStudyMedia),
 * changed category, cleared SEO, and introduced stray fields.
 *
 * TARGET:   slug = "al-ghazal-exhibition"
 * DEFAULT:  dry-run (no database writes)
 * WRITE:    --write flag required
 *
 * Safety:
 *   - Only ever touches the document with slug === "al-ghazal-exhibition"
 *   - Fail if MONGODB_URI is missing
 *   - Fail if target project not found
 *   - Fail if more than one document matches the slug
 *   - No delete operations ever
 *   - No create operations ever
 *   - No schema changes
 */

import fs from "fs";
import path from "path";

// ── Load .env.local before any imports that depend on env vars ──────────────
const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isWriteMode = args.includes("--write");

// ── Target ──────────────────────────────────────────────────────────────────
const TARGET_SLUG = "al-ghazal-exhibition";

// ── Intended repair values (sourced from src/data/projects.ts + seed mapping) ─
const INTENDED = {
  status: "published",
  featured: true,
  category: "CREATIVE DIRECTION",
  categories: ["filmmaking", "video-editing"],
  services: ["Event Coverage", "Cinematography", "Post-Production"],
  detailedResults: [
    { label: "DELIVERY", value: "READY" },
    { label: "SCOPE", value: "FULL CAMPAIGN" },
  ],
  caseStudyMedia: [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=800",
      alt: "Al Ghazal Exhibition Main Shot",
    },
    {
      type: "process",
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      alt: "On-set filming process",
    },
    {
      type: "result",
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      alt: "Final cinematic result",
    },
  ],
  seo: {
    title: "Al Ghazal Exhibition",
    description:
      "A premium cinematic showcase for Al Ghazal Exhibition, presenting event coverage, creative direction, and post-production in a polished portfolio case study.",
    keywords: [
      "Al Ghazal",
      "Exhibition",
      "Filmmaking",
      "Video Editing",
      "Event Coverage",
    ],
  },
};

// ── Stray values to clean (only if they match the corrupted values exactly) ──
const STRAY_CLEANUP: Record<string, { oldValue: string; newValue: string }> = {
  solution: { oldValue: "dfgbdfbdfb", newValue: "" },
  results: { oldValue: "rdytnhrtyn", newValue: "" },
};

// ── Fields to exclude from update ───────────────────────────────────────────
const NEVER_TOUCH = new Set([
  "_id",
  "slug",
  "title",
  "client",
  "clientName",
  "createdAt",
  "updatedAt",
  "__v",
]);

// ── Helper: pretty-print a value for console ────────────────────────────────
function describe(value: unknown, maxLen = 120): string {
  if (Array.isArray(value)) {
    return `${value.length} item(s) — ${JSON.stringify(value).slice(0, maxLen)}`;
  }
  if (value !== null && value !== undefined && typeof value === "object") {
    const str = JSON.stringify(value);
    return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
  }
  const str = String(value);
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function repairAlGhazal() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  PHASE 4D — REPAIR: al-ghazal-exhibition");
  console.log(`  Mode:       ${isWriteMode ? "WRITE" : "DRY-RUN (no writes)"}`);
  console.log("  Target:     slug = \"" + TARGET_SLUG + "\"");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // ── Safety: MONGODB_URI must exist ───────────────────────────────────────
  if (!process.env.MONGODB_URI) {
    console.error("FATAL: MONGODB_URI environment variable is not set.");
    console.error("       Check .env.local or GitHub repository secrets.");
    process.exit(1);
  }

  // ── Dynamic imports (env vars must be set first) ─────────────────────────
  const mongoose = await import("mongoose");
  const dbConnect = (await import("../src/lib/db")).default;
  const ProjectModel = (await import("../src/models/Project")).default;

  // ── Connect ──────────────────────────────────────────────────────────────
  try {
    await dbConnect();
    console.log("Connected to MongoDB\n");
  } catch (error) {
    console.error("FATAL: Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  // ── Safety: find target document ─────────────────────────────────────────
  const docs = await ProjectModel.find({ slug: TARGET_SLUG }).lean();
  const matchCount = docs.length;

  if (matchCount === 0) {
    console.error(
      `FATAL: No document found with slug "${TARGET_SLUG}". Cannot proceed.`
    );
    await mongoose.default.disconnect();
    process.exit(1);
  }

  if (matchCount > 1) {
    console.error(
      `FATAL: Found ${matchCount} documents with slug "${TARGET_SLUG}". Expected exactly 1. Aborting for safety.`
    );
    await mongoose.default.disconnect();
    process.exit(1);
  }

  const doc = docs[0] as Record<string, unknown>;
  const docId = doc._id;
  console.log(`Found target document:`);
  console.log(`  _id:    ${docId}`);
  console.log(`  slug:   ${doc.slug}`);
  console.log(`  title:  ${doc.title}`);
  console.log(`  status: ${doc.status}`);
  console.log();

  // ── Print current state ──────────────────────────────────────────────────
  console.log("── Current field values ──────────────────────────────────────");
  console.log(`  featured:           ${doc.featured}`);
  console.log(`  category:           "${doc.category}"`);
  console.log(`  categories:         ${describe(doc.categories)}`);
  console.log(`  services:           ${describe(doc.services)}`);
  console.log(`  detailedResults:    ${describe(doc.detailedResults)}`);
  console.log(`  caseStudyMedia:     ${describe(doc.caseStudyMedia)}`);
  console.log(`  mainResult:         ${doc.mainResult ? "present" : "MISSING"}`);
  console.log(`  problem:            ${doc.problem ? "present" : "MISSING"}`);
  console.log(`  idea:               ${doc.idea ? "present" : "MISSING"}`);
  console.log(`  execution:          ${doc.execution ? "present" : "MISSING"}`);
  console.log(`  image:              ${doc.image ? "present" : "MISSING"}`);
  console.log(`  seo:                ${describe(doc.seo)}`);

  // ── Print stray fields ───────────────────────────────────────────────────
  for (const [field, config] of Object.entries(STRAY_CLEANUP)) {
    const currentValue = doc[field];
    const valStr =
      currentValue === undefined
        ? "undefined"
        : typeof currentValue === "string"
          ? `"${currentValue}"`
          : String(currentValue);
    console.log(`  ${field}:             ${valStr}`);
  }
  console.log();

  // ── Print intended repair values ─────────────────────────────────────────
  console.log("── Intended repair values ────────────────────────────────────");
  console.log(`  featured:           ${INTENDED.featured}`);
  console.log(`  category:           "${INTENDED.category}"`);
  console.log(`  categories:         ${describe(INTENDED.categories)}`);
  console.log(`  services:           ${describe(INTENDED.services)}`);
  console.log(`  detailedResults:    ${describe(INTENDED.detailedResults)}`);
  console.log(`  caseStudyMedia:     ${describe(INTENDED.caseStudyMedia)}`);
  console.log(`  seo:                ${describe(INTENDED.seo)}`);

  for (const [field, config] of Object.entries(STRAY_CLEANUP)) {
    console.log(`  ${field}:             "${config.newValue}" (if current == "${config.oldValue}")`);
  }
  console.log();

  // ── Build the update operations ──────────────────────────────────────────
  const setFields: Record<string, unknown> = {};

  // Non-array, non-object scalar fields
  for (const key of ["status", "featured", "category"] as const) {
    if (doc[key] !== INTENDED[key]) {
      setFields[key] = INTENDED[key];
    }
  }

  // Array fields
  for (const key of ["categories", "services", "detailedResults", "caseStudyMedia"] as const) {
    const currentArr = JSON.stringify(doc[key]);
    const intendedArr = JSON.stringify(INTENDED[key]);
    if (currentArr !== intendedArr) {
      setFields[key] = INTENDED[key];
    }
  }

  // SEO
  const currentSeoStr = JSON.stringify(doc.seo);
  const intendedSeoStr = JSON.stringify(INTENDED.seo);
  if (currentSeoStr !== intendedSeoStr) {
    setFields["seo"] = INTENDED.seo;
  }

  // Stray field cleanup (only if values match the corrupted state)
  for (const [field, config] of Object.entries(STRAY_CLEANUP)) {
    if (doc[field] === config.oldValue) {
      setFields[field] = config.newValue;
    }
  }

  // ── Report ───────────────────────────────────────────────────────────────
  const fieldKeys = Object.keys(setFields);
  if (fieldKeys.length === 0) {
    console.log("✓ No changes needed. All fields already match intended values.");
    await mongoose.default.disconnect();
    process.exit(0);
  }

  console.log(`── Fields to modify: ${fieldKeys.length} ─────────────────────────`);
  for (const key of fieldKeys) {
    console.log(`  ${key}:`);
    console.log(`    was:  ${describe(doc[key])}`);
    console.log(`    now:  ${describe(setFields[key])}`);
  }
  console.log();

  // ── Safety summary ───────────────────────────────────────────────────────
  console.log("── Safety summary ────────────────────────────────────────────");
  console.log("  Created:  0 records");
  console.log("  Deleted:  0 records");
  console.log(`  Modified: ${isWriteMode ? "1 record (if write succeeds)" : "0 (dry-run)"}`);
  console.log("  Targeted: slug = \"" + TARGET_SLUG + "\" only");
  console.log("  Excluded: slug, title, client, clientName, _id, createdAt, updatedAt, __v");
  console.log();

  if (!isWriteMode) {
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("  DRY RUN — no writes performed.");
    console.log("  Re-run with --write to apply the repair.");
    console.log("═══════════════════════════════════════════════════════════════\n");
    await mongoose.default.disconnect();
    process.exit(0);
  }

  // ── EXECUTE: $set on targeted slug only (no multi, no delete) ────────────
  console.log("── Applying repair ───────────────────────────────────────────");

  const result = await ProjectModel.updateOne(
    { slug: TARGET_SLUG },
    { $set: setFields },
  );

  console.log(`  Matched:  ${result.matchedCount}`);
  console.log(`  Modified: ${result.modifiedCount}`);
  console.log(`  Ack:      ${result.acknowledged}`);

  if (result.matchedCount === 0) {
    console.error("FATAL: updateOne matched 0 documents. Slug may have changed.");
    await mongoose.default.disconnect();
    process.exit(1);
  }

  // ── Verify ───────────────────────────────────────────────────────────────
  console.log("\n── Verification ─────────────────────────────────────────────");
  const verified = await ProjectModel.findOne({ slug: TARGET_SLUG }).lean();
  if (!verified) {
    console.error("FATAL: Document not found after write. Rollback may be needed.");
    await mongoose.default.disconnect();
    process.exit(1);
  }

  const v = verified as Record<string, unknown>;
  let allMatch = true;

  for (const key of fieldKeys) {
    const intended = JSON.stringify(setFields[key]);
    const actual = JSON.stringify(v[key]);
    const match = intended === actual;
    if (!match) {
      console.log(`  ✗ ${key}: expected ${describe(setFields[key])}, got ${describe(v[key])}`);
      allMatch = false;
    } else {
      console.log(`  ✓ ${key}: ${describe(v[key])}`);
    }
  }

  console.log();

  if (allMatch) {
    console.log("✓ All repairs verified successfully.");
  } else {
    console.log("⚠ Some fields did not match after write. Manual review recommended.");
  }

  // ── Final safety report ──────────────────────────────────────────────────
  const totalOther = await ProjectModel.countDocuments({
    slug: { $ne: TARGET_SLUG },
  });
  console.log(`\nOther projects in DB (not ${TARGET_SLUG}): ${totalOther} — untouched.`);

  await mongoose.default.disconnect();
  console.log("\nDisconnected from MongoDB.");
  console.log("═══════════════════════════════════════════════════════════════");
}

repairAlGhazal().catch((error) => {
  console.error("Repair script failed with unhandled error:", error);
  process.exit(1);
});
