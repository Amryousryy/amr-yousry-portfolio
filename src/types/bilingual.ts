import { z } from "zod";
import mongoose, { Schema } from "mongoose";

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

export const BILINGUAL_SCHEMA_DEFINITION = {
  en: { type: String, required: true },
  ar: { type: String, required: true },
} as const;

export const OPTIONAL_BILINGUAL_SCHEMA_DEFINITION = {
  en: { type: String },
  ar: { type: String },
} as const;

export function createBilingualMongooseSchema(): Schema {
  return new mongoose.Schema(BILINGUAL_SCHEMA_DEFINITION, { _id: false });
}

export function createOptionalBilingualMongooseSchema(): Schema {
  return new mongoose.Schema(OPTIONAL_BILINGUAL_SCHEMA_DEFINITION, { _id: false });
}

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

export function createSeoMongooseSchema(): Schema {
  return new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    keywords: { type: [String], default: [] },
  });
}

export const optionalUrlSchema = z.string().url().optional().or(z.literal(""));