import mongoose, { Schema, Document } from "mongoose";
import type { ContentStatus } from "@/types/constants";

export interface IServiceItem {
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface IServiceCard {
  title: string;
  description: string;
  icon: string;
}

export interface IHeroSettings {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryCTALink: string;
  secondaryCTA: string;
  secondaryCTALink: string;
  posterImage?: string;
  showreelVideo?: string;
  status: ContentStatus;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
}

export interface IAboutSection {
  content: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface ISettings extends Document {
  hero: IHeroSettings;
  about: IAboutSection;
  services: IServiceItem[];
  siteContent?: {
    about: string;
    servicesTitle: string;
    servicesDescription: string;
    contactEmail: string;
    whatsappNumber: string;
    socialLinks: {
      instagram: string;
      twitter: string;
      youtube: string;
      linkedin: string;
    };
    status: ContentStatus;
    servicesCards: IServiceCard[];
    publishedAt?: Date;
    lastStatusChangeAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema = new Schema({
  headline: { type: String, required: true },
  subheadline: { type: String, required: true },
  primaryCTA: { type: String, required: true },
  primaryCTALink: { type: String, default: "/#contact" },
  secondaryCTA: { type: String, required: true },
  secondaryCTALink: { type: String, default: "/projects" },
  posterImage: { type: String },
  showreelVideo: { type: String },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: { type: Date },
  lastStatusChangeAt: { type: Date },
}, { _id: false });

const AboutSchema = new Schema({
  content: { type: String, required: true },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
  }],
}, { _id: false });

const ServiceItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const ServiceCardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const SocialLinksSchema = new Schema({
  instagram: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  linkedin: { type: String },
}, { _id: false });

const SiteContentSchema = new Schema({
  about: { type: String, required: true },
  servicesTitle: { type: String, required: true },
  servicesSubtitle: { type: String },
  servicesDescription: { type: String },
  contactEmail: { type: String, required: true },
  whatsappNumber: { type: String },
  socialLinks: { type: SocialLinksSchema },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  servicesCards: { type: [ServiceCardSchema], default: [] },
  publishedAt: { type: Date },
  lastStatusChangeAt: { type: Date },
}, { _id: false });

const SettingsSchema: Schema = new Schema({
  hero: { type: HeroSchema, required: true },
  about: { type: AboutSchema, required: true },
  services: { type: [ServiceItemSchema], default: [] },
  siteContent: { type: SiteContentSchema },
}, { timestamps: true });

SettingsSchema.index({ "hero.status": 1 });
SettingsSchema.index({ "siteContent.status": 1 });

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);