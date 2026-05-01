import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    slug: "al-ghazal-exhibition",
    title: "Al Ghazal Exhibition",
    client: "Al Ghazal",
    category: "CREATIVE DIRECTION",
    services: ["Event Coverage", "Cinematography", "Post-Production"],
    summary: "A premium cinematic showcase of the Al Ghazal exhibition, capturing the essence of luxury and heritage.",
    mainResult: "800K+ ENGAGED VIEWERS",
    thumbnail: "/images/projects/DSC09848-2.jpg",
    bannerImage: "/images/projects/DSC09850.jpg",
    featured: true,
    problem: "The client needed to translate a physical luxury experience into a digital narrative that resonates with a high-end audience.",
    idea: "Focus on the intricate details and emotional atmosphere using slow-motion cinematography and a minimal soundscape.",
    execution: "On-site multi-cam coverage over 2 days, with a heavy emphasis on color grading to match the brand's palette.",
    detailedResults: [
      { label: "Reach", value: "800K+ Views" },
      { label: "Engagement", value: "+60%" },
      { label: "Sentiment", value: "100% Positive" }
    ]
  },
  {
    id: "2",
    slug: "nextgen-fitness-app",
    title: "NextGen Fitness App",
    client: "NextGen Labs",
    category: "UGC PRODUCTION",
    services: ["Content Creation", "Ad Strategy", "Performance Editing"],
    summary: "Scalable UGC campaign that drove record-breaking conversions for a fitness tech startup.",
    mainResult: "+42% AD CONVERSION RATE",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920",
    featured: true,
    problem: "Traditional high-production ads were seeing diminishing returns and high CAC.",
    idea: "Deploy a fleet of authentic-style UGC creators to build peer-to-peer trust through relatable storytelling.",
    execution: "Managed 20+ creators, edited 100+ variations for A/B testing, and optimized based on real-time performance data.",
    detailedResults: [
      { label: "CVR Lift", value: "42%" },
      { label: "CAC Reduction", value: "30%" },
      { label: "ROAS", value: "4.5x" }
    ]
  },
  {
    id: "3",
    slug: "retro-arcade-concept",
    title: "Arcade Experience",
    client: "Creative Personal Project",
    category: "PIXEL DESIGN / UX",
    services: ["3D Animation", "Pixel Art", "Experience Design"],
    summary: "A 90s-inspired arcade experience exploration, pushing the boundaries of retro aesthetics in modern interfaces.",
    mainResult: "CONCEPT OF THE MONTH",
    thumbnail: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg",
    bannerImage: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg",
    featured: true,
    problem: "Modern UIs often lack the character and tactile feedback that made 90s gaming interfaces so memorable.",
    idea: "Recreate the high-saturation, low-bit feel of Sega arcade games using modern CSS and Framer Motion.",
    execution: "Developed a series of custom shaders and pixel-grid systems to simulate hardware limitations without the performance cost.",
    detailedResults: [
      { label: "Performance", value: "60 FPS" },
      { label: "Styles", value: "Retro-Modern" },
      { label: "Innovation", value: "High" }
    ]
  }
];

export const featuredProjects = projects.filter(p => p.featured);
