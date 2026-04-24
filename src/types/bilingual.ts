import { z } from "zod";

export interface BilingualString {
  en: string;
  ar: string;
}

export type BilingualFieldDefinition = {
  en: { type: typeof String; required: true };
  ar: { type: typeof String; required: true };
};

export type OptionalBilingualFieldDefinition = {
  en: { type: typeof String };
  ar: { type: typeof String };
};

export const bilingualStringSchema = z.object({
  en: z.string().trim().min(1, "English content is required"),
  ar: z.string().trim().min(1, "Arabic content is required"),
});

export const optionalBilingualStringSchema = bilingualStringSchema.optional();

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateSlug(title: string): string {
  return normalizeSlug(title);
}

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .transform(normalizeSlug);

export const slugInputSchema = z.string().min(1, "Slug is required");

export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Media URL must be a valid URL"),
});

export const mediaArraySchema = z.array(mediaItemSchema).default([]);

export type MediaItem = z.infer<typeof mediaItemSchema>;

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).default([]),
});

export const optionalUrlSchema = z.string().url().optional().or(z.literal(""));