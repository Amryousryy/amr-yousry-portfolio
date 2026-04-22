import { z } from "zod";

const bilingualString = z.object({
  en: z.string().min(1, "English content is required"),
  ar: z.string().min(1, "Arabic content is required"),
});

export const projectSchema = z.object({
  title: bilingualString,
  shortDescription: bilingualString,
  fullDescription: bilingualString,
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Valid cover image URL is required"),
  video: z.string().url().optional().or(z.literal("")),
  problem: bilingualString.optional(),
  strategy: bilingualString.optional(),
  solution: bilingualString.optional(),
  execution: bilingualString.optional(),
  results: bilingualString.optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  displayOrder: z.number().default(0),
  year: z.string().optional(),
  clientName: z.string().optional(),
  gallery: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  sections: z.array(z.object({
    id: z.string(),
    title: bilingualString,
    content: bilingualString,
    media: z.array(z.object({
      type: z.enum(["image", "video"]),
      url: z.string().url()
    })).default([])
  })).default([]),
});

export const filterSchema = z.object({
  name: bilingualString,
  slug: z.string().min(1, "Slug is required"),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const heroSchema = z.object({
  headline: bilingualString,
  subheadline: bilingualString,
  primaryCTA: bilingualString,
  primaryCTALink: z.string().default("/#contact"),
  secondaryCTA: bilingualString,
  secondaryCTALink: z.string().default("/projects"),
  posterImage: z.string().url().optional().or(z.literal("")),
  showreelVideo: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const siteContentSchema = z.object({
  about: bilingualString,
  servicesTitle: bilingualString,
  servicesDescription: bilingualString,
  contactEmail: z.string().email().optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  socialLinks: z.object({
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }).optional(),
});
