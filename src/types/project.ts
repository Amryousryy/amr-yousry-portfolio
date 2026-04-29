export interface ProjectMetric {
  label: string;
  value: string;
  desc: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  heroImage: string;
  strategicSummary: string;
  metrics: ProjectMetric[];
  challenge: string;
  approach: string;
  deliverables: string[];
  outcome: string;
  testimonial: ProjectTestimonial;
  gallery?: string[];
}
