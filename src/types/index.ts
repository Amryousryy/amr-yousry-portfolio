export type ContentStatus = "draft" | "published";

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  media: { type: "image" | "video"; url: string }[];
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  image: string;
  video?: string;
  problem?: string;
  strategy?: string;
  solution?: string;
  execution?: string;
  results?: string;
  outcome?: string;
  gallery: string[];
  tags: string[];
  sections: ProjectSection[];
  featured: boolean;
  status: ContentStatus;
  displayOrder: number;
  year?: string;
  clientName?: string;
  role?: string;
  tools?: string[];
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
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HeroSettings {
  _id: string;
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryCTALink: string;
  secondaryCTA: string;
  secondaryCTALink: string;
  posterImage: string;
  showreelVideo: string;
  status: ContentStatus;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
}

export interface SiteContent {
  _id: string;
  about: string;
  servicesTitle: string;
  servicesSubtitle?: string;
  servicesDescription: string;
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
    title: string;
    description: string;
    icon: string;
  }>;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  projectSlug?: string;
  avatar?: string;
  rating: number;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  createdAt: Date;
}
