import { z } from "zod";
import { stringSchema, optionalUrlSchema, contentStatusSchema } from "./shared";

const socialLinksSchema = z.object({
  instagram: optionalUrlSchema,
  twitter: optionalUrlSchema,
  youtube: optionalUrlSchema,
  linkedin: optionalUrlSchema,
});

export const siteContentSchema = z.object({
  about: stringSchema,
  servicesTitle: stringSchema,
  servicesDescription: stringSchema,
  contactEmail: z.string().email("Valid email is required"),
  whatsappNumber: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
});

export const settingsCreateSchema = z.object({
  hero: z.object({
    headline: stringSchema,
    subheadline: stringSchema,
    primaryCTA: stringSchema,
    primaryCTALink: z.string().default("/contact"),
    secondaryCTA: stringSchema,
    secondaryCTALink: z.string().default("/projects"),
    posterImage: optionalUrlSchema,
    showreelVideo: optionalUrlSchema,
    status: contentStatusSchema.default("draft"),
  }),
  about: z.object({
    content: stringSchema,
    stats: z.array(z.object({
      label: stringSchema,
      value: z.string(),
    })).default([]),
  }),
  siteContent: siteContentSchema,
  services: z.array(z.object({
    title: stringSchema,
    description: stringSchema,
    icon: z.string(),
  })).default([]),
});

export const settingsUpdateSchema = settingsCreateSchema.partial();

export type SettingsCreateInput = z.infer<typeof settingsCreateSchema>;
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

// ============================================================================
// CONTENT-ONLY SCHEMAS - For the Content admin page
// ============================================================================

const socialLinksFormSchema = z.object({
  instagram: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
});

const serviceCardSchema = z.object({
  title: stringSchema,
  description: stringSchema,
  icon: z.string().default(""),
});

export type IServiceCard = z.infer<typeof serviceCardSchema>;

export const contentCreateSchema = z.object({
  about: stringSchema,
  servicesTitle: stringSchema,
  servicesSubtitle: stringSchema,
  servicesDescription: stringSchema,
  contactEmail: z.string().email("Valid email is required"),
  whatsappNumber: z.string().optional().default(""),
  socialLinks: socialLinksFormSchema.optional().default({
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  }),
  status: contentStatusSchema.default("draft"),
  servicesCards: z.array(serviceCardSchema).default([]),
});

export const contentUpdateSchema = contentCreateSchema.partial();

export type ContentCreateInput = z.infer<typeof contentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;

export const contentDefaultValues: ContentCreateInput = {
  about: "",
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Premium video content that drives real business results.",
  servicesDescription: "",
  contactEmail: "",
  whatsappNumber: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  },
  status: "draft",
  servicesCards: [
    { title: "Video Editing", description: "Turn raw footage into scroll-stopping content that converts viewers into buyers.", icon: "play-circle" },
    { title: "Motion Design", description: "Animated graphics that grab attention and hold it across every platform.", icon: "sparkles" },
    { title: "Content Strategy", description: "Strategic video content that aligns with your brand and drives growth.", icon: "target" },
    { title: "UGC Production", description: "Authentic creator-style content that builds trust and drives conversions.", icon: "users" },
  ],
};

export function createContentFormValues(existing?: Partial<ContentCreateInput>): ContentCreateInput {
  return {
    about: existing?.about || "",
    servicesTitle: existing?.servicesTitle || "What I Deliver",
    servicesSubtitle: existing?.servicesSubtitle || "Premium video content that drives real business results.",
    servicesDescription: existing?.servicesDescription || "",
    contactEmail: existing?.contactEmail || "",
    whatsappNumber: existing?.whatsappNumber || "",
    socialLinks: existing?.socialLinks || {
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    status: existing?.status || "draft",
    servicesCards: existing?.servicesCards || [
      { title: "Video Editing", description: "Turn raw footage into scroll-stopping content that converts viewers into buyers.", icon: "play-circle" },
      { title: "Motion Design", description: "Animated graphics that grab attention and hold it across every platform.", icon: "sparkles" },
      { title: "Content Strategy", description: "Strategic video content that aligns with your brand and drives growth.", icon: "target" },
      { title: "UGC Production", description: "Authentic creator-style content that builds trust and drives conversions.", icon: "users" },
    ],
  };
}