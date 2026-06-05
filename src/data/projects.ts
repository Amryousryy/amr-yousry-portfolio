import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    slug: "al-ghazal-exhibition",
    title: "Al Ghazal Exhibition",
    client: "Al Ghazal",
    category: "CREATIVE DIRECTION",
    categories: ["filmmaking", "video-editing"],
    services: ["Event Coverage", "Cinematography", "Post-Production"],
    summary: "A premium cinematic showcase of the Al Ghazal exhibition, capturing the essence of luxury and heritage.",
    thumbnail: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=1920",
    mainResult: "Premium cinematic showcase built for brand presence across digital and event channels.",
    detailedResults: [
      { label: "DELIVERY", value: "READY" },
      { label: "SCOPE", value: "FULL CAMPAIGN" },
    ],
    featured: true,
    problem: "The client needed to translate a physical luxury experience into a digital narrative that resonates with a high-end audience.",
    idea: "Focus on the intricate details and emotional atmosphere using slow-motion cinematography and a minimal soundscape.",
    execution: "On-site multi-cam coverage over 2 days, with a heavy emphasis on color grading to match the brand's palette.",
    caseStudyMedia: [
      { type: "image", src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=800", alt: "Al Ghazal Exhibition Main Shot" },
      { type: "process", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", alt: "On-set filming process" },
      { type: "result", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", alt: "Final cinematic result" },
    ],
  },
  {
    id: "2",
    slug: "nextgen-fitness-app",
    title: "NextGen Fitness App",
    client: "NextGen Labs",
    category: "UGC PRODUCTION",
    categories: ["filmmaking", "video-editing"],
    services: ["Content Creation", "Ad Strategy", "Performance Editing"],
    summary: "Scalable UGC campaign that drove record-breaking conversions for a fitness tech startup.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920",
    mainResult: "Scalable UGC content system designed for conversion and platform-native performance.",
    detailedResults: [
      { label: "DELIVERY", value: "READY" },
      { label: "SCOPE", value: "CAMPAIGN SYSTEM" },
    ],
    featured: true,
    problem: "Traditional high-production ads were seeing diminishing returns and high CAC.",
    idea: "Deploy a fleet of authentic-style UGC creators to build peer-to-peer trust through relatable storytelling.",
    execution: "Managed 20+ creators, edited 100+ variations for A/B testing, and optimized based on real-time performance data.",
    caseStudyMedia: [
      { type: "video", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", alt: "UGC Ad Example" },
      { type: "image", src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", alt: "Creator filming process" },
      { type: "result", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", alt: "Conversion results dashboard" },
    ],
  },
  {
    id: "3",
    slug: "retro-arcade-concept",
    title: "Arcade Experience",
    client: "Creative Personal Project",
    category: "PIXEL DESIGN / UX",
    categories: ["graphic-design", "motion-graphic"],
    services: ["3D Animation", "Pixel Art", "Experience Design"],
    summary: "A 90s-inspired arcade experience exploration, pushing the boundaries of retro aesthetics in modern interfaces.",
    thumbnail: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg",
    bannerImage: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg",
    mainResult: "Retro digital experience concept with a strong visual identity and interactive pixel-art system.",
    detailedResults: [
      { label: "DELIVERY", value: "READY" },
      { label: "SCOPE", value: "CONCEPT PROTOTYPE" },
    ],
    featured: true,
    problem: "Modern UIs often lack the character and tactile feedback that made 90s gaming interfaces so memorable.",
    idea: "Recreate the high-saturation, low-bit feel of Sega arcade games using modern CSS and Framer Motion.",
    execution: "Developed a series of custom shaders and pixel-grid systems to simulate hardware limitations without the performance cost.",
    caseStudyMedia: [
      { type: "image", src: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg", alt: "Arcade concept main visual" },
      { type: "process", src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", alt: "Pixel art creation process" },
      { type: "result", src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800", alt: "Final interactive result" },
    ],
  }
];

export const featuredProjects = projects.filter(p => p.featured);
export const getAllProjects = () => projects;
export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
