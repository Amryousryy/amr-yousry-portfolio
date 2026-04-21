export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

export interface Skill {
  name: string;
  category?: 'frontend' | 'backend' | 'design' | 'ai' | 'marketing';
}

export interface Service {
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Project {
  id: number;
  title: string;
  category: 'Web' | 'AI' | 'Design';
  description: string;
  tags: string[];
  size: 'small' | 'medium' | 'large';
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}

export interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
