import { z } from "zod";
import { stringSchema, contentStatusSchema, optionalStringSchema, optionalEmailSchema, safeUrlSchema } from "./shared";

// ============================================================================
// CONTENT-ONLY SCHEMAS - For the Content admin page
// ============================================================================

const socialLinksFormSchema = z.object({
  instagram: safeUrlSchema,
  facebook: safeUrlSchema.optional().default(""),
  behance: safeUrlSchema.optional().default(""),
  twitter: safeUrlSchema,
  youtube: safeUrlSchema,
  linkedin: safeUrlSchema,
});

const serviceCardSchema = z.object({
  title: stringSchema,
  description: stringSchema,
  icon: z.string().default(""),
});

export type IServiceCard = z.infer<typeof serviceCardSchema>;

const aboutStatsSchema = z.object({
  label: z.string().optional().default(""),
  value: z.string().optional().default(""),
});

const ctaLinkSchema = z.string().optional().default("").refine(
  (val) => {
    if (!val) return true;
    if (/^javascript:/i.test(val) || /^data:/i.test(val) || /^ftp:/i.test(val) || /^mailto:/i.test(val)) return false;
    if (val.startsWith("/") || val.startsWith("#")) return true;
    try {
      const url = new URL(val);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  },
  "Must be a valid URL, internal path, or hash link"
);

const trimmedStringArraySchema = z.array(z.string().optional().default("")).default([]);

export const contentCreateSchema = z.object({
  about: optionalStringSchema,
  aboutTitle: optionalStringSchema,
  aboutBadge: optionalStringSchema,
  aboutCtaLabel: optionalStringSchema,
  aboutCtaLink: ctaLinkSchema,
  aboutStats: z.array(aboutStatsSchema).default([]),
  aboutSkills: trimmedStringArraySchema,
  aboutIndustries: trimmedStringArraySchema,
  servicesTitle: stringSchema,
  servicesSubtitle: stringSchema,
  servicesDescription: stringSchema,
  contactEmail: optionalEmailSchema,
  whatsappNumber: z.string().optional().default(""),
  contactHeading: optionalStringSchema,
  contactSubheading: optionalStringSchema,
  contactAvailability: optionalStringSchema,
  socialLinks: socialLinksFormSchema.optional().default({
    instagram: "",
    facebook: "",
    behance: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  }),
  status: contentStatusSchema.default("draft"),
  servicesCards: z.array(serviceCardSchema).default([]),
});

export const contentUpdateSchema = contentCreateSchema.partial();

export type ContentCreateInput = z.infer<typeof contentCreateSchema>;

import { socialLinks } from "../../data/social-links";

export const contentDefaultValues: ContentCreateInput = {
  about: "",
  aboutTitle: "",
  aboutBadge: "",
  aboutCtaLabel: "",
  aboutCtaLink: "",
  aboutStats: [],
  aboutSkills: [],
  aboutIndustries: [],
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Premium video content that drives real business results.",
  servicesDescription: "",
  contactEmail: "",
  whatsappNumber: "",
  contactHeading: "",
  contactSubheading: "",
  contactAvailability: "",
  socialLinks: {
    instagram: socialLinks.instagram,
    facebook: socialLinks.facebook,
    behance: socialLinks.behance,
    twitter: "",
    youtube: "",
    linkedin: socialLinks.linkedin,
  },
  status: "draft",
  servicesCards: [
    { title: "Video Editing", description: "Turn raw footage into scroll-stopping content that converts viewers into buyers.", icon: "play-circle" },
    { title: "Motion Design", description: "Animated graphics that grab attention and hold it across every platform.", icon: "sparkles" },
    { title: "Content Strategy", description: "Strategic video content that aligns with your brand and drives growth.", icon: "target" },
    { title: "UGC Production", description: "Authentic creator-style content that builds trust and drives conversions.", icon: "users" },
  ],
};