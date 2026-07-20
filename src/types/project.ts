export type ContentStatus = "draft" | "published";

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  media: { type: "image" | "video"; url: string }[];
}

export interface CaseStudyMediaItem {
  type: "image" | "video" | "process" | "before-after" | "result";
  src: string;
  alt?: string;
  caption?: string;
  title?: string;
  description?: string;
}

export interface DetailedResult {
  label: string;
  value: string;
}

export interface ProjectSEO {
  title?: string;
  description?: string;
  keywords?: string[];
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
  idea?: string;
  mainResult?: string;
  client?: string;
  clientName?: string;
  gallery: string[];
  tags: string[];
  sections: ProjectSection[];
  featured: boolean;
  status: ContentStatus;
  displayOrder: number;
  year?: string;
  categories: string[];
  services: string[];
  detailedResults: DetailedResult[];
  caseStudyMedia: CaseStudyMediaItem[];
  featuredOrder: number;
  seo?: ProjectSEO;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewProject = Omit<Project, "_id" | "createdAt" | "updatedAt">;
