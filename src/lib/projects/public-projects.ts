import type { Project, ProjectMedia } from "@/types/project";
import type { IProject } from "@/models/Project";
import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import {
  getAllProjects as getStaticAllProjects,
  getProjectBySlug as getStaticProjectBySlug,
  featuredProjects as staticFeaturedProjects,
} from "@/data/projects";

function toPlainText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const localized = value as { en?: unknown; ar?: unknown };
    if (typeof localized.en === "string") return localized.en;
    if (typeof localized.ar === "string") return localized.ar;
  }
  return fallback;
}

function normalizeStrings(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => toPlainText(item));
}

function normalizeDetailedResults(arr: unknown): { label: string; value: string }[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return {
        label: toPlainText(obj.label),
        value: toPlainText(obj.value),
      };
    }
    return { label: "", value: "" };
  });
}

function normalizeCaseStudyMedia(arr: unknown): Project["caseStudyMedia"] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return {
        type: (obj.type as ProjectMedia["type"]) || "image",
        src: toPlainText(obj.src),
        alt: toPlainText(obj.alt, undefined),
        caption: toPlainText(obj.caption, undefined),
      } as ProjectMedia;
    }
    return null;
  }).filter(Boolean) as Project["caseStudyMedia"];
}

function toPublicProject(doc: Record<string, unknown>): Project {
  const clientVal = toPlainText(doc.client) || toPlainText(doc.clientName) || "";
  const imageUrl = toPlainText(doc.image) || "";
  return {
    id: (doc._id as { toString(): string }).toString(),
    slug: toPlainText(doc.slug),
    title: toPlainText(doc.title),
    client: clientVal,
    category: toPlainText(doc.category),
    categories: normalizeStrings(doc.categories),
    services: normalizeStrings(doc.services),
    summary: toPlainText(doc.shortDescription) || "",
    thumbnail: imageUrl,
    mainResult: toPlainText(doc.mainResult) || "",
    featured: (doc.featured as boolean) || false,
    bannerImage: imageUrl,
    problem: toPlainText(doc.problem) || "",
    idea: toPlainText(doc.idea) || "",
    execution: toPlainText(doc.execution) || "",
    detailedResults: normalizeDetailedResults(doc.detailedResults),
    caseStudyMedia: normalizeCaseStudyMedia(doc.caseStudyMedia),
    heroVideo: toPlainText(doc.video) || undefined,
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
