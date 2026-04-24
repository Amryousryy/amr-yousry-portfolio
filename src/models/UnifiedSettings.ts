import mongoose, { Schema, Document } from "mongoose";
import type { ContentStatus } from "@/types/constants";

export interface IHeroSection {
  headline: { en: string; ar: string };
  subheadline: { en: string; ar: string };
  primaryCTA: { en: string; ar: string };
  primaryCTALink: string;
  secondaryCTA: { en: string; ar: string };
  secondaryCTALink: string;
  posterImage?: string;
  showreelVideo?: string;
  status: ContentStatus;
}

export interface ISiteContent {
  about: { en: string; ar: string };
  servicesTitle: { en: string; ar: string };
  servicesDescription: { en: string; ar: string };
  contactEmail: string;
  whatsappNumber?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface IAboutStat {
  label: { en: string; ar: string };
  value: string;
}

export interface IServiceItem {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
}

export interface IUnifiedSettings extends Document {
  hero: IHeroSection;
  siteContent: ISiteContent;
  services: IServiceItem[];
  aboutStats: IAboutStat[];
  createdAt: Date;
  updatedAt: Date;
}

const BilingualSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false }
);

const OptionalBilingualSchema = new mongoose.Schema(
  {
    en: { type: String },
    ar: { type: String },
  },
  { _id: false }
);

const HeroSectionSchema = new mongoose.Schema(
  {
    headline: { type: BilingualSchema, required: true },
    subheadline: { type: BilingualSchema, required: true },
    primaryCTA: { type: BilingualSchema, required: true },
    primaryCTALink: { type: String, default: "/contact" },
    secondaryCTA: { type: BilingualSchema, required: true },
    secondaryCTALink: { type: String, default: "/projects" },
    posterImage: { type: String },
    showreelVideo: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { _id: false }
);

const SocialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    linkedin: { type: String },
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema(
  {
    about: { type: BilingualSchema, required: true },
    servicesTitle: { type: BilingualSchema, required: true },
    servicesDescription: { type: BilingualSchema, required: true },
    contactEmail: { type: String, required: true },
    whatsappNumber: { type: String },
    socialLinks: { type: SocialLinksSchema },
  },
  { _id: false }
);

const AboutStatSchema = new mongoose.Schema(
  {
    label: { type: BilingualSchema, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ServiceItemSchema = new mongoose.Schema(
  {
    title: { type: BilingualSchema, required: true },
    description: { type: BilingualSchema, required: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const UnifiedSettingsSchema = new mongoose.Schema(
  {
    hero: { type: HeroSectionSchema, required: true },
    siteContent: { type: SiteContentSchema, required: true },
    services: { type: [ServiceItemSchema], default: [] },
    aboutStats: { type: [AboutStatSchema], default: [] },
  },
  { timestamps: true }
);

UnifiedSettingsSchema.index({ "hero.status": 1 });

export const UnifiedSettings = mongoose.models.UnifiedSettings || mongoose.model<IUnifiedSettings>("UnifiedSettings", UnifiedSettingsSchema);

export default UnifiedSettings;