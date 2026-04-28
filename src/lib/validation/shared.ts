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

export function toEnglishOnlyArray<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): T {
  return toEnglishOnly(data, fields);
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

export const optionalUrlSchema = z.string().url().optional().or(z.literal(""));

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

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .transform(normalizeSlug);

// ============================================================================
// DEFAULT VALUE FACTORIES
// ============================================================================

export const createEmptyMediaItem = (): { type: "image" | "video"; url: string } => ({
  type: "image",
  url: "",
});

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
// ARRAY MAPPING HELPERS (string <-> string[])
// ============================================================================

export function stringToStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(",").map(s => s.trim()).filter(Boolean);
}

export function stringArrayToString(values: string[] | undefined): string {
  if (!values || !Array.isArray(values)) return "";
  return values.join(", ");
}

export function commaStringToArray(input: string): string[] {
  return input.split(",").map(s => s.trim()).filter(Boolean);
}

export function arrayToCommaString(values: string[]): string {
  return values.join(", ");
}

// ============================================================================
// DERIVED TYPES
// ============================================================================

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type MediaArray = z.infer<typeof mediaArraySchema>;
export type SEO = z.infer<typeof seoSchema>;
export type ContentStatus = z.infer<typeof contentStatusSchema>;