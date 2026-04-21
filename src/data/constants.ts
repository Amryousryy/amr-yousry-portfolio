import { NavLink, SocialLink, Skill, Service, Project, Experience, Testimonial, Stat, ContactInfo } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://github.com', icon: 'Github', label: 'GitHub' },
  { href: 'https://linkedin.com', icon: 'Linkedin', label: 'LinkedIn' },
  { href: 'https://twitter.com', icon: 'Twitter', label: 'Twitter' },
  { href: 'https://youtube.com', icon: 'Youtube', label: 'YouTube' },
  { href: 'https://instagram.com', icon: 'Instagram', label: 'Instagram' },
];

export const SKILLS: Skill[] = [
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Three.js', category: 'frontend' },
  { name: 'GSAP', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Python', category: 'backend' },
  { name: 'AI APIs', category: 'ai' },
  { name: 'Prompt Engineering', category: 'ai' },
  { name: 'Video Production', category: 'design' },
  { name: 'Digital Marketing', category: 'marketing' },
  { name: 'Figma', category: 'design' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  { name: 'GraphQL', category: 'backend' },
  { name: 'AWS', category: 'backend' },
  { name: 'Docker', category: 'backend' },
];

export const SERVICES: Service[] = [
  {
    number: '01',
    icon: 'Monitor',
    title: 'Web Development',
    description: 'Building modern, responsive web applications with Next.js, React, and TypeScript. From landing pages to complex SaaS platforms.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
  },
  {
    number: '02',
    icon: 'Brain',
    title: 'AI Integration',
    description: 'Integrating AI capabilities into your projects using OpenAI, Anthropic, and custom ML models. Prompt engineering and API development.',
    tags: ['OpenAI', 'Claude API', 'Python', 'LangChain'],
  },
  {
    number: '03',
    icon: 'Video',
    title: 'Content Creation',
    description: 'Creating engaging tech content for YouTube, TikTok, and Instagram. Tutorial videos, AI showcases, and tech reviews.',
    tags: ['Video Editing', 'Motion Graphics', 'Scripting'],
  },
  {
    number: '04',
    icon: 'TrendingUp',
    title: 'Digital Marketing',
    description: 'Strategic digital marketing for tech companies and automotive businesses. Social media management and content strategy.',
    tags: ['Social Media', 'SEO', 'Content Strategy'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web',
    description: 'Full-featured e-commerce platform with Next.js, Stripe integration, and admin dashboard.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    size: 'large',
  },
  {
    id: 2,
    title: 'AI Chat Application',
    category: 'AI',
    description: 'Real-time AI chat application with multiple model support and streaming responses.',
    tags: ['React', 'OpenAI API', 'WebSocket'],
    size: 'small',
  },
  {
    id: 3,
    title: 'Portfolio Generator',
    category: 'Web',
    description: 'Drag-and-drop portfolio builder with customizable templates and export functionality.',
    tags: ['Next.js', 'TypeScript', 'Framer'],
    size: 'medium',
  },
  {
    id: 4,
    title: 'Content Scheduler',
    category: 'Web',
    description: 'Social media content scheduler with analytics and AI-powered post suggestions.',
    tags: ['React', 'Node.js', 'AI'],
    size: 'medium',
  },
  {
    id: 5,
    title: 'Video Analytics Dashboard',
    category: 'Design',
    description: 'Analytics dashboard for video content creators with engagement metrics visualization.',
    tags: ['Next.js', 'D3.js', 'Analytics'],
    size: 'small',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    year: '2023 - Present',
    title: 'Freelance Full-Stack Developer',
    company: 'Self-employed',
    description: 'Building innovative web applications and AI integrations for clients worldwide. Working with startups and established brands to deliver cutting-edge digital solutions.',
    skills: ['Next.js', 'React', 'AI Integration', 'TypeScript'],
  },
  {
    year: '2021 - 2023',
    title: 'Full-Stack Developer',
    company: 'Tech Solutions Egypt',
    description: 'Developed multiple web applications for local and international clients. Led the integration of AI features into existing platforms.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    year: '2019 - 2021',
    title: 'Junior Web Developer',
    company: 'Digital Agency Cairo',
    description: 'Built responsive websites and e-commerce platforms. Collaborated with design teams to implement pixel-perfect interfaces.',
    skills: ['HTML/CSS', 'JavaScript', 'WordPress', 'Figma'],
  },
  {
    year: '2018 - 2019',
    title: 'Content Creator',
    company: 'Freelance',
    description: 'Started content creation journey on YouTube and social media, sharing tech tutorials and insights about web development and AI.',
    skills: ['Video Editing', 'Motion Graphics', 'Social Media'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: 'Amr delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are outstanding.',
    name: 'Sarah Ahmed',
    role: 'CEO, TechStart Egypt',
    rating: 5,
  },
  {
    id: 2,
    quote: 'Working with Amr on our AI integration was a game-changer. He transformed our business with intelligent automation solutions.',
    name: 'Mohamed Hassan',
    role: 'Founder, SmartSolutions',
    rating: 5,
  },
  {
    id: 3,
    quote: "Amr's content is incredibly helpful. His tutorials helped our team level up our React skills significantly.",
    name: 'Ahmed Talaat',
    role: 'CTO, DigitalFirst',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Professional, responsive, and highly skilled. Amr delivered our project on time and with exceptional quality.',
    name: 'Lina Mostafa',
    role: 'Marketing Director, AutoConnect',
    rating: 5,
  },
  {
    id: 5,
    quote: 'The AI-powered features Amr integrated into our app increased user engagement by 40%. Incredible results!',
    name: 'Omar Farouk',
    role: 'Product Manager, AppVenture',
    rating: 5,
  },
];

export const STATS: Stat[] = [
  { value: '50+', label: 'Projects' },
  { value: '5+', label: 'Years Experience' },
  { value: '20+', label: 'Clients' },
];

export const CONTACT_INFO: ContactInfo[] = [
  { icon: 'MapPin', label: 'Location', value: 'Cairo, Egypt' },
  { icon: 'Mail', label: 'Email', value: 'hello@amryousry.dev' },
  { icon: 'Phone', label: 'Phone', value: 'Available upon request' },
];

export const HERO_ROLES = [
  'Full-Stack Developer',
  'AI Integration Specialist',
  'Creative Technologist',
  'Digital Marketer',
];

export const PROJECT_CATEGORIES = ['All', 'Web', 'AI', 'Design'] as const;
