export interface BilingualString {
  en: string;
  ar: string;
}

export type ContentStatus = "draft" | "published";

export interface Project {
  _id: string;
  title: BilingualString;
  slug: string;
  shortDescription: BilingualString;
  fullDescription: BilingualString;
  category: string;
  image: string;
  video?: string;
  problem?: BilingualString;
  solution?: BilingualString;
  results?: BilingualString;
  gallery: string[];
  featured: boolean;
  status: ContentStatus;
  displayOrder: number;
  year?: string;
  clientName?: string;
  createdAt: string;
}

export type NewProject = Omit<Project, "_id" | "createdAt" | "slug">;

export interface Filter {
  _id: string;
  name: BilingualString;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HeroSettings {
  _id: string;
  headline: BilingualString;
  subheadline: BilingualString;
  primaryCTA: BilingualString;
  primaryCTALink: string;
  secondaryCTA: BilingualString;
  secondaryCTALink: string;
  posterImage: string;
  showreelVideo: string;
  status: ContentStatus;
}

export interface SiteContent {
  _id: string;
  about: BilingualString;
  servicesTitle: BilingualString;
  servicesDescription: BilingualString;
  contactEmail: string;
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}
