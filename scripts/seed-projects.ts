import mongoose from "mongoose";
import { projects as staticProjects } from "../src/data/projects";
import dbConnect from "../src/lib/db";
import Project from "../src/models/Project";

async function seedProjects() {
  console.log("Connecting to MongoDB...");
  try {
    await dbConnect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  let seeded = 0;

  for (let i = 0; i < staticProjects.length; i++) {
    const p = staticProjects[i];
    const displayOrder = i + 1;

    const updateData: Record<string, unknown> = {
      title: p.title,
      slug: p.slug,
      shortDescription: p.summary,
      fullDescription: p.summary,
      category: p.category,
      categories: p.categories || [],
      services: p.services || [],
      image: p.thumbnail,
      client: p.client,
      clientName: p.client,
      problem: p.problem,
      idea: p.idea,
      execution: p.execution,
      mainResult: p.mainResult,
      detailedResults: p.detailedResults || [],
      caseStudyMedia: p.caseStudyMedia || [],
      featured: p.featured || false,
      featuredOrder: p.featured ? displayOrder : 0,
      displayOrder,
      status: "published",
      video: p.heroVideo || "",
      gallery: [],
      tags: [],
      sections: [],
      year: new Date().getFullYear().toString(),
      publishedAt: new Date(),
      lastStatusChangeAt: new Date(),
      strategy: "",
      solution: "",
      results: "",
    };

    try {
      const result = await Project.findOneAndUpdate(
        { slug: p.slug },
        { $set: updateData },
        { upsert: true, new: true },
      );

      const action = result.createdAt === result.updatedAt ? "Created" : "Updated";
      console.log(`  ${action} project: ${result.slug} (${result.title})`);
      seeded++;
    } catch (error) {
      console.error(`  Error processing project ${p.slug}:`, error);
    }
  }

  console.log(`\nSeeding complete. ${seeded}/${staticProjects.length} projects processed.`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedProjects().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
