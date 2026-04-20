import mongoose, { Schema, Document } from "mongoose";

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

// Filters for Project Categories
export interface IFilter extends Document {
  name: { en: string; ar: string };
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

const FilterSchema: Schema = new Schema({
  name: { type: BilingualSchema, required: true },
  slug: { type: String, required: true, unique: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// Hero Section Settings
export interface IHeroSettings extends Document {
  headline: { en: string; ar: string };
  subheadline: { en: string; ar: string };
  primaryCTA: { en: string; ar: string };
  primaryCTALink: string;
  secondaryCTA: { en: string; ar: string };
  secondaryCTALink: string;
  posterImage: string;
  showreelVideo: string;
  status: "draft" | "published";
}

const HeroSettingsSchema: Schema = new Schema({
  headline: { type: BilingualSchema, required: true },
  subheadline: { type: BilingualSchema, required: true },
  primaryCTA: { type: BilingualSchema, required: true },
  primaryCTALink: { type: String, default: "/#contact" },
  secondaryCTA: { type: BilingualSchema, required: true },
  secondaryCTALink: { type: String, default: "/projects" },
  posterImage: { type: String },
  showreelVideo: { type: String },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
});

// General Site Content (About, Services, etc.)
export interface ISiteContent extends Document {
  about: { en: string; ar: string };
  servicesTitle: { en: string; ar: string };
  servicesDescription: { en: string; ar: string };
  contactEmail: string;
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

const SiteContentSchema: Schema = new Schema({
  about: { type: BilingualSchema, required: true },
  servicesTitle: { type: BilingualSchema, required: true },
  servicesDescription: { type: BilingualSchema, required: true },
  contactEmail: { type: String },
  whatsappNumber: { type: String },
  socialLinks: {
    instagram: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    linkedin: { type: String },
  },
});

export const Filter = mongoose.models.Filter || mongoose.model<IFilter>("Filter", FilterSchema);
export const HeroSettings = mongoose.models.HeroSettings || mongoose.model<IHeroSettings>("HeroSettings", HeroSettingsSchema);
export const SiteContent = mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
