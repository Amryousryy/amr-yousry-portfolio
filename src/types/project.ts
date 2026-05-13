export interface ProjectMedia {
  type: "image" | "video" | "process" | "before-after" | "result";
  src: string;
  alt?: string;
  caption?: string;
}

export interface ProjectMediaItem {
  kind: "image" | "video" | "embed" | "external" | "unknown";
  src: string;
  embedUrl?: string;
  provider?: string | null;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  categories: string[];
  services: string[];
  summary: string;
  
  // Home/Projects list
  thumbnail: string;
  mainResult: string;
  featured?: boolean;
  
  // Case study page
  bannerImage: string;
  problem: string;
  idea: string;
  execution: string;
  detailedResults: ProjectResult[];
  
  // Media support
  caseStudyMedia?: ProjectMedia[];
  media?: ProjectMediaItem[];
  heroVideo?: string;
}
