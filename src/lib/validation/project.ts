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

export const projectCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required").transform(normalizeSlug),
  title: stringSchema,
  shortDescription: stringSchema,
  fullDescription: stringSchema,
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Valid cover image URL is required"),
  video: optionalUrlSchema,
  problem: stringSchema.optional(),
  strategy: stringSchema.optional(),
  solution: stringSchema.optional(),
  execution: stringSchema.optional(),
  results: stringSchema.optional(),
  featured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  displayOrder: z.number().int().default(0),
  year: z.string().optional(),
  clientName: z.string().optional(),
  seo: seoSchema.optional(),
  gallery: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  sections: z.array(z.object({
    id: z.string(),
    title: stringSchema,
    content: stringSchema,
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
  image: "",
  video: undefined,
  problem: undefined,
  strategy: undefined,
  solution: undefined,
  execution: undefined,
  results: undefined,
  featured: false,
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
    image: existing?.image || "",
    video: existing?.video,
    problem: existing?.problem,
    strategy: existing?.strategy,
    solution: existing?.solution,
    execution: existing?.execution,
    results: existing?.results,
    featured: existing?.featured || false,
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