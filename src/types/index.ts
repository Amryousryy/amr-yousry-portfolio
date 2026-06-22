import type { ContentStatus } from "./project";

export type { ContentStatus, Project, ProjectSection, CaseStudyMediaItem, DetailedResult, ProjectSEO, NewProject } from "./project";

export type { ApiSuccess, ApiError, ApiResponse, PaginationMeta } from "./api";

export type { ActivityAction, ActivityTargetType, ActivityMetadata, ActivityEntry } from "./activity";

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
  aboutTitle?: string;
  aboutBadge?: string;
  aboutCtaLabel?: string;
  aboutCtaLink?: string;
  aboutStats?: Array<{ label: string; value: string }>;
  aboutSkills?: string[];
  aboutIndustries?: string[];
  servicesTitle: string;
  servicesSubtitle?: string;
  servicesDescription: string;
  contactEmail: string;
  whatsappNumber: string;
  contactHeading?: string;
  contactSubheading?: string;
  contactAvailability?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    behance?: string;
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
