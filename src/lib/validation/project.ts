import { z } from "zod";
import {
  bilingualStringSchema,
  optionalBilingualStringSchema,
  mediaItemSchema,
  mediaArraySchema,
  normalizeSlug,
  seoSchema,
  optionalUrlSchema,
  contentStatusSchema,
  emptyBilingual,
  createEmptyMediaItem,
  createEmptyProjectSection,
} from "./shared";

// ============================================================================
// PROJECT CREATE SCHEMA
// ============================================================================

export const projectCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required").transform(normalizeSlug),
  title: bilingualStringSchema,
  shortDescription: bilingualStringSchema,
  fullDescription: bilingualStringSchema,
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Valid cover image URL is required"),
  video: optionalUrlSchema,
  problem: optionalBilingualStringSchema,
  strategy: optionalBilingualStringSchema,
  solution: optionalBilingualStringSchema,
  execution: optionalBilingualStringSchema,
  results: optionalBilingualStringSchema,
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
    title: bilingualStringSchema,
    content: bilingualStringSchema,
    media: mediaArraySchema,
  })).default([]),
});

// ============================================================================
// PROJECT UPDATE SCHEMA (all fields optional)
// ============================================================================

export const projectUpdateSchema = projectCreateSchema.partial();

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

// ============================================================================
// DEFAULT VALUES FACTORIES
// ============================================================================

export const projectDefaultValues: ProjectCreateInput = {
  slug: "",
  title: emptyBilingual(),
  shortDescription: emptyBilingual(),
  fullDescription: emptyBilingual(),
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

// Factory for creating initial form values from existing project data
export function createProjectFormValues(existing?: Partial<ProjectCreateInput>): ProjectCreateInput {
  return {
    slug: existing?.slug || "",
    title: existing?.title || emptyBilingual(),
    shortDescription: existing?.shortDescription || emptyBilingual(),
    fullDescription: existing?.fullDescription || emptyBilingual(),
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

// ============================================================================
// PAYLOAD MAPPER
// ============================================================================

// Transform form data to API payload - single source of truth for shape conversion
export function mapProjectFormToPayload(formData: Partial<ProjectCreateInput>): Partial<ProjectCreateInput> {
  return {
    ...formData,
    // tags is already string[] from Controller transformation
    // gallery is already string[] from Controller transformation  
    // sections is already properly formatted from useFieldArray
  };
}

// ============================================================================
// SLUG BEHAVIOR
// ============================================================================

// Auto-generate slug from English title - only in create mode
export function generateSlugFromTitle(titleEn: string): string {
  return normalizeSlug(titleEn);
}

// Determine if slug should be auto-generated
export function shouldAutoGenerateSlug(existingSlug: string | undefined, isEditMode: boolean): boolean {
  // In edit mode, only auto-generate if slug is explicitly empty
  // In create mode, always auto-generate when title changes
  return isEditMode ? !existingSlug : true;
}