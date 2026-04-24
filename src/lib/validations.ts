import { z } from "zod";
import {
  bilingualStringSchema,
  optionalBilingualStringSchema,
  mediaItemSchema,
  mediaArraySchema,
  normalizeSlug,
  generateSlug,
  seoSchema,
  optionalUrlSchema,
} from "@/types/bilingual";

export const contentStatusSchema = z.enum(["draft", "published"]);

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

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectSchema = projectCreateSchema;

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const filterCreateSchema = z.object({
  name: bilingualStringSchema,
  slug: z.string().min(1, "Slug is required").transform(normalizeSlug),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const filterUpdateSchema = filterCreateSchema.partial();

export const filterSchema = filterCreateSchema;

export type FilterCreateInput = z.infer<typeof filterCreateSchema>;
export type FilterUpdateInput = z.infer<typeof filterUpdateSchema>;

export const heroCreateSchema = z.object({
  headline: bilingualStringSchema,
  subheadline: bilingualStringSchema,
  primaryCTA: bilingualStringSchema,
  primaryCTALink: z.string().default("/contact"),
  secondaryCTA: bilingualStringSchema,
  secondaryCTALink: z.string().default("/projects"),
  posterImage: optionalUrlSchema,
  showreelVideo: optionalUrlSchema,
  status: contentStatusSchema.default("draft"),
});

export const heroUpdateSchema = heroCreateSchema.partial();

export const heroSchema = heroCreateSchema;

export type HeroCreateInput = z.infer<typeof heroCreateSchema>;
export type HeroUpdateInput = z.infer<typeof heroUpdateSchema>;

export const showreelCreateSchema = z.object({
  title: bilingualStringSchema,
  subtitle: bilingualStringSchema,
  videoUrl: z.string().url("Valid video URL is required"),
  thumbnailUrl: z.string().url("Valid thumbnail URL is required"),
  isActive: z.boolean().default(false),
  ctaText: optionalBilingualStringSchema,
  ctaLink: z.string().default("/contact"),
});

export const showreelUpdateSchema = showreelCreateSchema.partial();

export const showreelSchema = showreelCreateSchema;

export type ShowreelCreateInput = z.infer<typeof showreelCreateSchema>;
export type ShowreelUpdateInput = z.infer<typeof showreelUpdateSchema>;

const socialLinksSchema = z.object({
  instagram: optionalUrlSchema,
  twitter: optionalUrlSchema,
  youtube: optionalUrlSchema,
  linkedin: optionalUrlSchema,
});

export const siteContentSchema = z.object({
  about: bilingualStringSchema,
  servicesTitle: bilingualStringSchema,
  servicesDescription: bilingualStringSchema,
  contactEmail: z.string().email("Valid email is required"),
  whatsappNumber: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
});

export const unifiedSettingsCreateSchema = z.object({
  hero: heroCreateSchema,
  siteContent: siteContentSchema,
  services: z.array(z.object({
    title: bilingualStringSchema,
    description: bilingualStringSchema,
    icon: z.string(),
  })).default([]),
  aboutStats: z.array(z.object({
    label: bilingualStringSchema,
    value: z.string(),
  })).default([]),
});

export const unifiedSettingsUpdateSchema = unifiedSettingsCreateSchema.partial();

export type UnifiedSettingsCreateInput = z.infer<typeof unifiedSettingsCreateSchema>;
export type UnifiedSettingsUpdateInput = z.infer<typeof unifiedSettingsUpdateSchema>;

export const leadCreateSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Valid email is required").trim(),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  message: z.string().min(1, "Message is required").trim(),
  offerType: z.enum(["general", "free_audit"]).default("general"),
  status: z.enum(["new", "contacted", "qualified", "closed"]).default("new"),
});

export const leadUpdateSchema = leadCreateSchema.partial();

export const leadSchema = leadCreateSchema;

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;