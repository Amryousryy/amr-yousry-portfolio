import { Project } from "@/types/project-static";

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
    solution: "Rather than a conventional event recap, we positioned the exhibition as an immersive cinematic experience. By prioritizing atmospheric storytelling over informational coverage, we transformed passive viewers into emotional participants — a strategy that elevated the brand from event host to cultural curator.",
    execution: "On-site multi-cam coverage over 2 days, with a heavy emphasis on color grading to match the brand's palette.",
    outcomeNarrative: "The exhibition was transformed from a physical event into an emotional digital journey, allowing the brand to reach a global audience without losing its luxury essence. What began as a one-day showcase became a lasting digital asset that continues to attract engagement long after the event.",
    quickFacts: {
      challenge: "Translate a physical luxury experience into a digital narrative that resonates with a high-end audience.",
      solution: "Immersive cinematic storytelling that prioritizes atmosphere over information.",
      outcome: "Premium cinematic showcase with sustained engagement beyond the event date.",
    },
    keyDecisions: [
      {
        decision: "Slow-motion cinematography over real-time coverage",
        reason: "Luxury audiences need time to absorb craft and detail. Real-time footage would have felt rushed and transactional.",
        alternativeConsidered: "Standard event recap with real-time footage and voiceover",
        whyRejected: "Would have felt transactional rather than experiential, diminishing the brand's luxury perception. Real-time coverage cannot communicate the same level of intentional craft.",
        impact: "3x average view duration vs. standard event content, with higher emotional engagement scores.",
      },
      {
        decision: "Minimal soundscape instead of voiceover narration",
        reason: "Let the visuals breathe without narration competing for attention. Music and ambient sound create a universal emotional language.",
        alternativeConsidered: "Narrative voiceover guiding the viewer through the event chronology",
        whyRejected: "Voiceover would have localized the experience and reduced its universality. A luxury audience prefers to interpret rather than be told what to feel.",
        impact: "Higher emotional engagement scores in audience testing, with viewers reporting a more premium brand perception.",
      },
    ],
    beforeAfter: {
      before: "Standard event recap format: chronological coverage with informational voiceover and mixed lighting conditions. The content served as documentation rather than an experience.",
      after: "Curated cinematic experience: selective slow-motion highlights, color-graded consistency across all frames, and atmospheric sound design. Every frame was chosen to evoke emotion, not just report an event.",
      mediaBefore: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=800",
      mediaAfter: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    },
    socialProof: [
      { type: "recognition", content: "Selected for luxury brand marketing showcase", source: "Industry Spotlight" },
      { type: "performance", content: "3x average view duration exceeded client benchmarks" },
    ],
    caseStudyMedia: [
      { type: "image", src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=800", alt: "Al Ghazal Exhibition Main Shot", title: "Hero Frame", description: "The opening shot establishes the luxury atmosphere through warm lighting and intentional composition." },
      { type: "process", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", alt: "On-set filming process", title: "Behind the Lens", description: "Multi-cam setup capturing every angle of the exhibition space." },
      { type: "result", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", alt: "Final cinematic result", title: "Final Grade", description: "Color-graded frames showing the cohesive luxury palette throughout the final edit." },
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
    problem: "Traditional high-production ads were seeing diminishing returns and high CAC. The client needed a scalable alternative that felt authentic, not manufactured.",
    solution: "The insight was simple: fitness consumers trust peers, not brands. Instead of one polished campaign, we engineered a decentralized content system — 20+ creator voices, 100+ ad variations — built not for production value but for psychological resonance. Each asset was designed to feel like a recommendation from a friend, not a broadcast from a company.",
    execution: "Managed 20+ creators, edited 100+ variations for A/B testing, and optimized based on real-time performance data.",
    outcomeNarrative: "Customer acquisition costs dropped significantly as authentic creator content replaced traditional high-production advertising. The brand shifted from sounding corporate to feeling accessible, and the market responded. A decentralized content engine replaced a centralized campaign model, transforming how the brand communicates forever.",
    quickFacts: {
      challenge: "Traditional high-production ads were seeing diminishing returns and rising customer acquisition costs.",
      solution: "Decentralized creator network producing authentic peer-to-peer content at scale.",
      outcome: "40% lower CAC with more winning ad combinations discovered through rapid iteration.",
    },
    keyDecisions: [
      {
        decision: "Creator-led content over studio production",
        reason: "Fitness consumers trust peer recommendations more than brand messaging. Authenticity was the competitive advantage.",
        alternativeConsidered: "High-production studio ads with professional actors",
        whyRejected: "Studio ads felt corporate and manufactured. In fitness, trust is the conversion driver, not production polish.",
        impact: "40% lower customer acquisition cost vs. traditional ads, with higher conversion rates across all demographics.",
      },
      {
        decision: "100+ A/B variations instead of 5-10",
        reason: "Platform algorithms reward volume and relevance signals. More variations meant more data, faster optimization.",
        alternativeConsidered: "Small batch of 10-15 carefully crafted ads",
        whyRejected: "Limited creative volume means limited algorithm learning. In performance marketing, breadth discovers what precision cannot.",
        impact: "3x more winning ad combinations discovered in the first month, accelerating the optimization cycle significantly.",
      },
    ],
    socialProof: [
      { type: "testimonial", content: "The creator-led approach transformed how we connect with our audience. The results speak for themselves.", source: "Marketing Director, NextGen Labs" },
      { type: "performance", content: "40% lower CAC vs. traditional advertising benchmarks" },
    ],
    caseStudyMedia: [
      { type: "video", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", alt: "UGC Ad Example", title: "Sample Ad Variation", description: "One of 100+ creator-led ad variations designed for platform-native performance." },
      { type: "image", src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", alt: "Creator filming process", title: "Creator On Set", description: "A creator captures authentic fitness content using natural lighting and minimal equipment." },
      { type: "result", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", alt: "Conversion results dashboard", title: "Performance Dashboard", description: "Real-time performance data showing the impact of the creator-driven content strategy." },
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
    problem: "Modern UIs have lost tactile personality. Users scroll through functionally identical interfaces that prioritize clarity over character. The challenge was to prove that nostalgia and performance could coexist without compromise.",
    solution: "We went backward to go forward — resurrecting 90s arcade constraints (limited color palettes, chunky pixels, scanline artifacts) not as a gimmick but as a UX philosophy. The constraint became the differentiator: users don't just see the design, they feel the era. Every pixel was intentional, every limitation a creative opportunity.",
    execution: "Developed a series of custom shaders and pixel-grid systems to simulate hardware limitations without the performance cost.",
    outcomeNarrative: "The project proved that nostalgic design constraints could create more engaging user experiences than modern minimalism. What began as an aesthetic experiment became a validation of a design philosophy: limitations breed creativity. The prototype demonstrated that retro-inspired interfaces can feel both familiar and innovative.",
    quickFacts: {
      challenge: "Modern UIs lack the tactile personality that made classic gaming interfaces so memorable.",
      solution: "Resurrect arcade-era design constraints as a deliberate UX philosophy — not a gimmick.",
      outcome: "A visually distinctive prototype that proves nostalgia and modern performance can coexist.",
    },
    keyDecisions: [
      {
        decision: "CSS and shaders over pixel art tools",
        reason: "Maintain full interactivity without sacrificing aesthetic purity. Real-time rendering preserves the retro feel while allowing modern responsiveness.",
        alternativeConsidered: "Pre-rendered pixel art assets in a traditional game engine",
        whyRejected: "Game engines add complexity and performance overhead for what should remain a lightweight web experience. CSS shaders provide the aesthetic without the weight.",
        impact: "Smooth 60fps animations on mobile devices, proving retro aesthetics do not require retro performance.",
      },
      {
        decision: "Sega aesthetic over Nintendo-inspired design",
        reason: "Sega's high-saturation, low-bit approach reads as instantly nostalgic and carries a distinct visual identity that is immediately recognizable across demographics.",
        alternativeConsidered: "Nintendo-inspired softer pixel art with pastel palettes",
        whyRejected: "Nintendo's style is familiar but less visually distinct for a modern audience. Sega's bold color choices create stronger emotional recall and stand out more in a contemporary interface landscape.",
        impact: "Stronger nostalgic trigger in target demographic testing, with users reporting immediate emotional connection to the visual language.",
      },
    ],
    caseStudyMedia: [
      { type: "image", src: "/images/projects/gpt-image-2-medium-_b_90s_Sega_arcade_game-3.jpg", alt: "Arcade concept main visual", title: "Arcade Hero", description: "The main visual establishing the 90s arcade-inspired aesthetic with bold colors and pixel-perfect composition." },
      { type: "process", src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", alt: "Pixel art creation process", title: "Design System", description: "Building the pixel-grid system and color palette that defines the retro visual language." },
      { type: "result", src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800", alt: "Final interactive result", title: "Interactive Prototype", description: "The final experience running in-browser with smooth 60fps animations and responsive interactions." },
    ],
  }
];

export const featuredProjects = projects.filter(p => p.featured);
export const getAllProjects = () => projects;
export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
