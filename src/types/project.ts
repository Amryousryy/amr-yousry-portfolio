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
  services: string[];
  summary: string;
  thumbnail: string;
  bannerImage: string;
  featured?: boolean;
  
  // High-level result for the card
  mainResult: string;

  // Case Study Details
  problem: string;
  idea: string;
  execution: string;
  detailedResults: ProjectResult[];
}
