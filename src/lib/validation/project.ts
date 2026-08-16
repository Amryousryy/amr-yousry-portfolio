import { z } from "zod";
import {
  mediaArraySchema,
  normalizeSlug,
  seoSchema,
  safeUrlSchema,
  contentStatusSchema,
} from "./shared";

const caseStudyMediaItemSchema = z.object({
  type: z.enum(["image", "video", "process", "before-after", "result"]),
  src: z.string().trim().default(""),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const caseStudyMediaArraySchema = z.array(caseStudyMediaItemSchema).default([]);

const detailedResultSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

const detailedResultArraySchema = z.array(detailedResultSchema).default([]);

const draftSafeStringBase = z.string().trim();
const draftSafeString = draftSafeStringBase.default("");

export const projectCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and single hyphens between segments")
    .transform(normalizeSlug),
  title: draftSafeStringBase.min(1, "Title is required"),
  shortDescription: draftSafeString,
  fullDescription: draftSafeString,
  category: draftSafeString,
  categories: z.array(z.string()).default([]),
  image: safeUrlSchema,
  video: safeUrlSchema.optional(),
  problem: draftSafeString,
  strategy: draftSafeString,
  solution: draftSafeString,
  execution: draftSafeString,
  results: draftSafeString,
  idea: draftSafeString,
  mainResult: draftSafeString,
  client: z.string().optional(),
  services: z.array(z.string()).default([]),
  detailedResults: detailedResultArraySchema,
  caseStudyMedia: caseStudyMediaArraySchema,
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().default(0),
  status: contentStatusSchema.default("draft"),
  displayOrder: z.number().int().default(0),
  year: z.string().optional(),
  clientName: z.string().optional(),
  seo: seoSchema.optional(),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sections: z.array(z.object({
    id: z.string(),
    title: draftSafeString,
    content: draftSafeString,
    media: mediaArraySchema,
  })).default([]),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const projectDefaultValues: ProjectCreateInput = {
  slug: "",
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  categories: [],
  image: "",
  video: undefined,
  problem: "",
  strategy: "",
  solution: "",
  execution: "",
  results: "",
  idea: "",
  mainResult: "",
  client: undefined,
  services: [],
  detailedResults: [],
  caseStudyMedia: [],
  featured: false,
  featuredOrder: 0,
  status: "draft",
  displayOrder: 0,
  year: new Date().getFullYear().toString(),
  clientName: "",
  seo: { title: "", description: "", keywords: [] },
  gallery: [],
  tags: [],
  sections: [],
};

export function generateSlugFromTitle(title: string): string {
  return normalizeSlug(title);
}