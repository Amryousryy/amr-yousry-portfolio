import type { Project, ProjectMedia, ProjectMediaItem } from "@/types/project-static";
import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getMediaKind, getEmbeddableVideoUrl, getMediaProvider } from "@/lib/media/config";
import {
  getAllProjects as getStaticAllProjects,
  getProjectBySlug as getStaticProjectBySlug,
  featuredProjects as staticFeaturedProjects,
} from "@/data/projects";
import { formatCategory } from "@/lib/projects/categories";

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

function normalizeCaseStudyMedia(arr: unknown): ProjectMedia[] {
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
  }).filter((m): m is ProjectMedia => m !== null);
}

function normalizeMediaItems(doc: Record<string, unknown>, title: string): ProjectMediaItem[] {
  const items: ProjectMediaItem[] = [];
  const seen = new Set<string>();

  const addItem = (src: string, alt?: string, caption?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    const kind = getMediaKind(src);
    const embedUrl = getEmbeddableVideoUrl(src);
    items.push({ kind, src, embedUrl: embedUrl || undefined, provider: getMediaProvider(src), alt, caption });
  };

  const caseStudyMedia = normalizeCaseStudyMedia(doc.caseStudyMedia) || [];
  for (const m of caseStudyMedia) {
    if (m.src) addItem(m.src, m.alt, m.caption);
  }

  const gallery = normalizeStrings(doc.gallery);
  for (const url of gallery) {
    if (url) addItem(url, title);
  }

  if (items.length === 0) {
    const imageUrl = toPlainText(doc.image) || "";
    const videoUrl = toPlainText(doc.video) || "";
    if (imageUrl) addItem(imageUrl, title);
    if (videoUrl) addItem(videoUrl, title);
  }

  return items;
}

function withMedia(project: Project): Project {
  if (project.media && project.media.length > 0) return project;
  const items: ProjectMediaItem[] = [];
  const seen = new Set<string>();
  const addItem = (src: string, alt?: string, caption?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    const kind = getMediaKind(src);
    items.push({ kind, src, embedUrl: getEmbeddableVideoUrl(src) || undefined, provider: getMediaProvider(src), alt, caption });
  };
  if (project.caseStudyMedia) {
    for (const m of project.caseStudyMedia) addItem(m.src, m.alt, m.caption);
  }
  if (items.length === 0 && project.thumbnail) addItem(project.thumbnail, project.title);
  return { ...project, media: items };
}

function toPublicProject(doc: Record<string, unknown>): Project {
  const clientVal = toPlainText(doc.client) || toPlainText(doc.clientName) || "";
  const imageUrl = toPlainText(doc.image) || "";
  const title = toPlainText(doc.title);
  const rawSeo = doc.seo as Record<string, unknown> | undefined;
  const seo = rawSeo
    ? {
        title: toPlainText(rawSeo.title, undefined),
        description: toPlainText(rawSeo.description, undefined),
        keywords: normalizeStrings(rawSeo.keywords),
      }
    : undefined;
  return {
    id: (doc._id as { toString(): string }).toString(),
    slug: toPlainText(doc.slug),
    title,
    client: clientVal,
    category: formatCategory(toPlainText(doc.category)),
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
    media: normalizeMediaItems(doc, title),
    seo: seo && (seo.title !== undefined || seo.description !== undefined)
      ? seo as { title?: string; description?: string; keywords?: string[] }
      : undefined,
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

      return docs
        .map((doc) => toPublicProject(doc as unknown as Record<string, unknown>));
    },
    () => getStaticAllProjects().map(withMedia),
  );
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return tryDb(
    async () => {
      const docs = await ProjectModel
        .find({ status: "published", featured: true })
        .sort({ featuredOrder: 1, createdAt: -1 })
        .lean();

      const cmsFeatured = docs
        .map((doc) => toPublicProject(doc as unknown as Record<string, unknown>));

      return cmsFeatured.slice(0, limit);
    },
    () => staticFeaturedProjects.slice(0, limit).map(withMedia),
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return tryDb(
    async () => {
      const doc = await ProjectModel
        .findOne({ slug, status: "published" })
        .lean();

      if (!doc) return null;

      return toPublicProject(doc as unknown as Record<string, unknown>);
    },
    () => getStaticProjectBySlug(slug) || null,
  );
}
