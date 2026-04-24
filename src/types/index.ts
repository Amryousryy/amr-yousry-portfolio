export interface BilingualString {
  en: string;
  ar: string;
}

export type ContentStatus = "draft" | "published";

export interface ProjectSection {
  id: string;
  title: BilingualString;
  content: BilingualString;
  media: { type: "image" | "video"; url: string }[];
}

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
  strategy?: BilingualString;
  solution?: BilingualString; // Keep for backward compatibility
  execution?: BilingualString;
  results?: BilingualString;
  gallery: string[];
  tags: string[];
  sections: ProjectSection[];
  featured: boolean;
  status: ContentStatus;
  displayOrder: number;
  year?: string;
  clientName?: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
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
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
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
  status: ContentStatus;
  servicesCards: Array<{
    title: BilingualString;
    description: BilingualString;
    icon: string;
  }>;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
}
