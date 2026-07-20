export interface ProjectMedia {
  type: "image" | "video" | "process" | "before-after" | "result";
  src: string;
  alt?: string;
  caption?: string;
  title?: string;
  description?: string;
}

export interface ProjectMediaItem {
  kind: "image" | "video" | "embed" | "external" | "unknown";
  src: string;
  embedUrl?: string;
  provider?: string | null;
  alt?: string;
  caption?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface KeyDecision {
  decision: string;
  reason: string;
  alternativeConsidered?: string;
  whyRejected?: string;
  impact: string;
}

export interface SocialProofItem {
  type: "testimonial" | "award" | "recognition" | "featured" | "performance";
  content: string;
  source?: string;
}

export interface QuickFacts {
  challenge: string;
  solution: string;
  outcome: string;
}

export interface BeforeAfter {
  before: string;
  after: string;
  mediaBefore?: string;
  mediaAfter?: string;
}

export interface ProjectSeo {
  title?: string;
  description?: string;
  keywords?: string[];
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
  solution: string;
  execution: string;
  detailedResults: ProjectResult[];
  keyDecisions?: KeyDecision[];
  outcomeNarrative?: string;
  quickFacts?: QuickFacts;
  beforeAfter?: BeforeAfter;
  socialProof?: SocialProofItem[];

  // Media support
  caseStudyMedia?: ProjectMedia[];
  media?: ProjectMediaItem[];
  heroVideo?: string;

  // SEO
  seo?: ProjectSeo;
}
