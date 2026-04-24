import { z } from "zod";
import { bilingualStringSchema, optionalBilingualStringSchema, optionalUrlSchema, contentStatusSchema } from "./shared";

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

export const settingsCreateSchema = z.object({
  hero: z.object({
    headline: bilingualStringSchema,
    subheadline: bilingualStringSchema,
    primaryCTA: bilingualStringSchema,
    primaryCTALink: z.string().default("/contact"),
    secondaryCTA: bilingualStringSchema,
    secondaryCTALink: z.string().default("/projects"),
    posterImage: optionalUrlSchema,
    showreelVideo: optionalUrlSchema,
    status: contentStatusSchema.default("draft"),
  }),
  about: z.object({
    content: bilingualStringSchema,
    stats: z.array(z.object({
      label: bilingualStringSchema,
      value: z.string(),
    })).default([]),
  }),
  siteContent: siteContentSchema,
  services: z.array(z.object({
    title: bilingualStringSchema,
    description: bilingualStringSchema,
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
  title: bilingualStringSchema,
  description: bilingualStringSchema,
  icon: z.string().default(""),
});

export type IServiceCard = z.infer<typeof serviceCardSchema>;

export const contentCreateSchema = z.object({
  about: bilingualStringSchema,
  servicesTitle: bilingualStringSchema,
  servicesDescription: bilingualStringSchema,
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
  about: { en: "", ar: "" },
  servicesTitle: { en: "", ar: "" },
  servicesDescription: { en: "", ar: "" },
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
    { title: { en: "Video Editing", ar: "تحرير الفيديو" }, description: { en: "Cinematic storytelling with rhythm and pace.", ar: "سرد سينمائي بإيقاع وتيرة." }, icon: "🎥" },
    { title: { en: "Motion Design", ar: "تصميم الحركة" }, description: { en: "Dynamic visuals that bring brands to life.", ar: "مرئيات ديناميكية تجذب العلامات التجارية للحياة." }, icon: "🎨" },
    { title: { en: "UGC Strategy", ar: "استراتيجية UGC" }, description: { en: "High-converting authentic video content.", ar: "محتوى فيديو أصلي عالي التحويل." }, icon: "📱" },
    { title: { en: "Sound Design", ar: "تصميم الصوت" }, description: { en: "Immersive audio experiences for every frame.", ar: "تجارب صوتية غامرة لكل إطار." }, icon: "🔊" },
  ],
};

export function createContentFormValues(existing?: Partial<ContentCreateInput>): ContentCreateInput {
  return {
    about: existing?.about || { en: "", ar: "" },
    servicesTitle: existing?.servicesTitle || { en: "", ar: "" },
    servicesDescription: existing?.servicesDescription || { en: "", ar: "" },
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
      { title: { en: "Video Editing", ar: "تحرير الفيديو" }, description: { en: "Cinematic storytelling with rhythm and pace.", ar: "سرد سينمائي بإيقاع وتيرة." }, icon: "🎥" },
      { title: { en: "Motion Design", ar: "تصميم الحركة" }, description: { en: "Dynamic visuals that bring brands to life.", ar: "مرئيات ديناميكية تجذب العلامات التجارية للحياة." }, icon: "🎨" },
      { title: { en: "UGC Strategy", ar: "استراتيجية UGC" }, description: { en: "High-converting authentic video content.", ar: "محتوى فيديو أصلي عالي التحويل." }, icon: "📱" },
      { title: { en: "Sound Design", ar: "تصميم الصوت" }, description: { en: "Immersive audio experiences for every frame.", ar: "تجارب صوتية غامرة لكل إطار." }, icon: "🔊" },
    ],
  };
}