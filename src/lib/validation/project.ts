import { z } from "zod";
import {
  mediaItemSchema,
  mediaArraySchema,
  normalizeSlug,
  seoSchema,
  optionalUrlSchema,
  contentStatusSchema,
  createEmptyMediaItem,
  createEmptyProjectSection,
  stringSchema,
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

const draftSafeString = z.string().trim().default("");

export const projectCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required").transform(normalizeSlug),
  title: draftSafeString,
  shortDescription: draftSafeString,
  fullDescription: draftSafeString,
  category: draftSafeString,
  categories: z.array(z.string()).default([]),
  image: z.string().url().or(z.literal("")).default(""),
  video: optionalUrlSchema,
  problem: stringSchema.optional(),
  strategy: stringSchema.optional(),
  solution: stringSchema.optional(),
  execution: stringSchema.optional(),
  results: stringSchema.optional(),
  idea: stringSchema.optional(),
  mainResult: stringSchema.optional(),
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
  problem: undefined,
  strategy: undefined,
  solution: undefined,
  execution: undefined,
  results: undefined,
  idea: undefined,
  mainResult: undefined,
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

export function createProjectFormValues(existing?: Partial<ProjectCreateInput>): ProjectCreateInput {
  return {
    slug: existing?.slug || "",
    title: existing?.title || "",
    shortDescription: existing?.shortDescription || "",
    fullDescription: existing?.fullDescription || "",
    category: existing?.category || "",
    categories: existing?.categories || [],
    image: existing?.image || "",
    video: existing?.video,
    problem: existing?.problem,
    strategy: existing?.strategy,
    solution: existing?.solution,
    execution: existing?.execution,
    results: existing?.results,
    idea: existing?.idea,
    mainResult: existing?.mainResult,
    client: existing?.client,
    services: existing?.services || [],
    detailedResults: existing?.detailedResults || [],
    caseStudyMedia: existing?.caseStudyMedia || [],
    featured: existing?.featured || false,
    featuredOrder: existing?.featuredOrder ?? 0,
    status: existing?.status || "draft",
    displayOrder: existing?.displayOrder || 0,
    year: existing?.year || new Date().getFullYear().toString(),
    clientName: existing?.clientName || "",
    seo: existing?.seo || { title: "", description: "", keywords: [] },
    gallery: existing?.gallery || [],
    tags: existing?.tags || [],
    sections: existing?.sections || [],
  };
}

export function mapProjectFormToPayload(formData: Partial<ProjectCreateInput>): Partial<ProjectCreateInput> {
  return {
    ...formData,
  };
}

export function generateSlugFromTitle(title: string): string {
  return normalizeSlug(title);
}

export function shouldAutoGenerateSlug(existingSlug: string | undefined, isEditMode: boolean): boolean {
  return isEditMode ? !existingSlug : true;
}