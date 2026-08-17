import { z } from "zod";

// ============================================================================
// SHARED SCHEMAS - Core validation building blocks
// ============================================================================

export const contentStatusSchema = z.enum(["draft", "published"]);

export const stringSchema = z.string().trim().min(1, "Content is required");

// ============================================================================
// COMPATIBILITY LAYER - Handle old bilingual documents gracefully
// ============================================================================

export function toEnglishOnly<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): T {
  const result = { ...data };
  for (const field of fields) {
    const value = result[field];
    if (value && typeof value === "object" && "en" in (value as object)) {
      const bilingualValue = value as { en?: string };
      (result as Record<string, unknown>)[field as string] = bilingualValue.en || "";
    }
  }
  return result;
}

// ============================================================================
// MEDIA SCHEMAS
// ============================================================================

export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Media URL must be a valid URL"),
});

export const mediaArraySchema = z.array(mediaItemSchema).default([]);

// ============================================================================
// SEO SCHEMA
// ============================================================================

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).default([]),
});

// ============================================================================
// URL HELPERS
// ============================================================================

export const optionalStringSchema = z.string().optional().default("");

export const safeUrlSchema = z.string().optional().default("").refine(
  (val) => {
    if (!val) return true;
    if (/^javascript:/i.test(val) || /^data:/i.test(val)) return false;
    try {
      const url = new URL(val);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  },
  "Must be a valid http or https URL"
);

export const optionalEmailSchema = z.string().optional().default("").refine(
  (val) => {
    if (!val) return true;
    const trimmed = val.trim();
    if (trimmed.length > 254) return false;
    if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  },
  "Invalid email format"
);

// ============================================================================
// SLUG UTILITIES
// ============================================================================

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================================================
// DEFAULT VALUE FACTORIES
// ============================================================================

export const createEmptyProjectSection = (): {
  id: string;
  title: string;
  content: string;
  media: { type: "image" | "video"; url: string }[];
} => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
  media: [],
});

// ============================================================================
// DERIVED TYPES
// ============================================================================

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type MediaArray = z.infer<typeof mediaArraySchema>;
export type SEO = z.infer<typeof seoSchema>;
export type ContentStatus = z.infer<typeof contentStatusSchema>;