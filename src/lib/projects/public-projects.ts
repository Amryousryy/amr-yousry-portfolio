import type { Project } from "@/types/project";
import type { IProject } from "@/models/Project";
import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import {
  getAllProjects as getStaticAllProjects,
  getProjectBySlug as getStaticProjectBySlug,
  featuredProjects as staticFeaturedProjects,
} from "@/data/projects";

function toPublicProject(doc: Record<string, unknown>): Project {
  const clientVal = (doc.client as string) || (doc.clientName as string) || "";
  const imageUrl = (doc.image as string) || "";
  return {
    id: (doc._id as { toString(): string }).toString(),
    slug: doc.slug as string,
    title: doc.title as string,
    client: clientVal,
    category: doc.category as string,
    categories: (doc.categories as string[]) || [],
    services: (doc.services as string[]) || [],
    summary: (doc.shortDescription as string) || "",
    thumbnail: imageUrl,
    mainResult: (doc.mainResult as string) || "",
    featured: (doc.featured as boolean) || false,
    bannerImage: imageUrl,
    problem: (doc.problem as string) || "",
    idea: (doc.idea as string) || "",
    execution: (doc.execution as string) || "",
    detailedResults: (doc.detailedResults as { label: string; value: string }[]) || [],
    caseStudyMedia: (doc.caseStudyMedia as Project["caseStudyMedia"]) || [],
    heroVideo: (doc.video as string) || undefined,
  };
}

async function tryDb<T>(
  fn: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  try {
    await dbConnect();
    return await fn();
  } catch {
    return fallback();
  }
}

export async function getPublicProjects(): Promise<Project[]> {
  return tryDb(
    async () => {
      const docs = await ProjectModel
        .find({ status: "published" })
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      if (!docs || docs.length === 0) {
        return getStaticAllProjects();
      }

      return docs.map((doc) => toPublicProject(doc as unknown as Record<string, unknown>));
    },
    () => getStaticAllProjects(),
  );
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return tryDb(
    async () => {
      const docs = await ProjectModel
        .find({ status: "published", featured: true })
        .sort({ featuredOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (!docs || docs.length === 0) {
        return staticFeaturedProjects.slice(0, limit);
      }

      return docs.map((doc) => toPublicProject(doc as unknown as Record<string, unknown>));
    },
    () => staticFeaturedProjects.slice(0, limit),
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return tryDb(
    async () => {
      const doc = await ProjectModel
        .findOne({ slug, status: "published" })
        .lean();

      if (!doc) {
        return getStaticProjectBySlug(slug) || null;
      }

      return toPublicProject(doc as unknown as Record<string, unknown>);
    },
    () => getStaticProjectBySlug(slug) || null,
  );
}
