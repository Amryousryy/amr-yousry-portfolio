import fs from "fs";
import path from "path";

// Load .env.local BEFORE any imports that depend on env vars
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

const args = process.argv.slice(2);
const isWriteMode = args.includes("--write");

interface StaticProject {
  slug: string;
  title: string;
  client: string;
  category: string;
  categories: string[];
  services: string[];
  summary: string;
  thumbnail: string;
  mainResult: string;
  featured?: boolean;
  problem?: string;
  idea?: string;
  execution?: string;
  detailedResults?: { label: string; value: string }[];
  caseStudyMedia?: { type: string; src: string; alt?: string; caption?: string }[];
  heroVideo?: string;
}

interface SeedReport {
  created: number;
  wouldCreate: number;
  skipped: number;
  errors: number;
}

function buildDocument(p: StaticProject, index: number): Record<string, unknown> {
  return {
    title: p.title,
    slug: p.slug,
    shortDescription: p.summary,
    fullDescription: p.summary,
    category: p.category,
    categories: p.categories || [],
    services: p.services || [],
    image: p.thumbnail,
    video: p.heroVideo || undefined,
    client: p.client,
    clientName: p.client,
    problem: p.problem || undefined,
    idea: p.idea || undefined,
    strategy: p.idea || undefined,
    execution: p.execution || undefined,
    mainResult: p.mainResult || undefined,
    detailedResults: p.detailedResults || [],
    caseStudyMedia: p.caseStudyMedia || [],
    gallery: [],
    tags: [],
    sections: [],
    featured: p.featured || false,
    featuredOrder: index,
    displayOrder: index,
    status: "published",
    year: "",
    seo: {
      title: p.title,
      description: p.summary,
      keywords: [],
    },
    publishedAt: new Date(),
    lastStatusChangeAt: new Date(),
  };
}

async function seedProjects() {
  if (!isWriteMode) {
    console.log("DRY RUN MODE — no database writes will be performed.\n");
  } else {
    console.log("WRITE MODE — database inserts enabled.\n");
  }

  console.log("Connecting to MongoDB...");

  // Dynamic imports so env vars are set before db.ts captures MONGODB_URI
  const mongoose = await import("mongoose");
  const { projects: staticProjects } = await import("../src/data/projects");
  const dbConnect = (await import("../src/lib/db")).default;
  const Project = (await import("../src/models/Project")).default;

  try {
    await dbConnect();
    console.log("Connected to MongoDB\n");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  const report: SeedReport = {
    created: 0,
    wouldCreate: 0,
    skipped: 0,
    errors: 0,
  };

  for (let i = 0; i < staticProjects.length; i++) {
    const p = staticProjects[i];

    try {
      const existing = await Project.findOne({ slug: p.slug }).lean();

      if (existing) {
        console.log(`  [SKIPPED] ${p.slug} — ${p.title} (already exists)`);
        report.skipped++;
        continue;
      }

      const doc = buildDocument(p, i);

      if (isWriteMode) {
        await Project.create(doc);
        console.log(`  [CREATED] ${p.slug} — ${p.title}`);
        report.created++;
      } else {
        console.log(`  [WOULD CREATE] ${p.slug} — ${p.title}`);
        report.wouldCreate++;
      }
    } catch (error) {
      console.error(`  [ERROR] ${p.slug} — ${p.title}:`, error);
      report.errors++;
    }
  }

  console.log("\nSummary:");
  if (isWriteMode) {
    console.log(`  Created: ${report.created}`);
  } else {
    console.log(`  Would create: ${report.wouldCreate}`);
  }
  console.log(`  Skipped existing: ${report.skipped}`);
  console.log(`  Errors: ${report.errors}`);

  await mongoose.default.disconnect();
  console.log("\nDisconnected from MongoDB");
}

seedProjects().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
