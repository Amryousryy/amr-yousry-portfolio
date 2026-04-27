"use client";

import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { ArrowRight } from "lucide-react";

interface ServiceCard {
  title: string | { en: string; ar?: string };
  description: string | { en: string; ar?: string };
  icon?: string;
}

const DEFAULT_SERVICES: ServiceCard[] = [
  {
    title: "Video Editing",
    description: "Turn raw footage into scroll-stopping content that converts viewers into buyers. Every cut serves a purpose.",
    icon: "play-circle",
  },
  {
    title: "Motion Design",
    description: "Animated graphics that grab attention and hold it across every platform—from reels to presentations.",
    icon: "sparkles",
  },
  {
    title: "Content Strategy",
    description: "Strategic video content that aligns with your brand voice and drives measurable business growth.",
    icon: "target",
  },
  {
    title: "UGC Production",
    description: "Authentic creator-style content that builds trust and drives conversions for high-ticket offers.",
    icon: "users",
  },
];

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, JSX.Element> = {
    "play-circle": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
      </svg>
    ),
    "sparkles": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
        <path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5L5 3Z" />
        <path d="M19 17L19.3 18.2L20.5 18.5L19.3 19L19 20.2L18.7 19L17.5 18.7L18.7 18.2L19 17Z" />
      </svg>
    ),
    "target": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    "users": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    "default": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9L15 15" />
        <path d="M15 9L9 15" />
      </svg>
    ),
  };

  return iconMap[name] || iconMap["default"];
}

interface ServiceCardProps {
  service: {
    title: string | { en: string; ar?: string } | undefined;
    description: string | { en: string; ar?: string } | undefined;
    icon?: string;
  };
  index: number;
  isPrimary?: boolean;
}

function ServiceCard({ service, index, isPrimary }: ServiceCardProps) {
  const icon = service.icon || "default";
  const iconClass = "w-8 h-8 text-accent";
  
  const getTitle = (title: typeof service.title) => {
    if (!title) return "Service";
    if (typeof title === "string") return title;
    return title.en || "Service";
  };
  
  const getDescription = (desc: typeof service.description) => {
    if (!desc) return "";
    if (typeof desc === "string") return desc;
    return desc.en || "";
  };

  return (
    <div 
      className={`
        relative p-8 border border-white/5 
        ${isPrimary ? "bg-accent/5 lg:col-span-2 lg:row-span-1" : "bg-zinc-900/30"}
        hover:border-accent/30 transition-all duration-500 group will-change-transform
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <ServiceIcon name={icon} className={iconClass} />
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">
          {getTitle(service.title)}
        </h3>
        
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
          {getDescription(service.description)}
        </p>
        
        <div className="flex items-center text-accent text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { data: contentResponse, error, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => SettingsService.getContent(),
  });

  const servicesCards = contentResponse?.data?.servicesCards?.length
    ? contentResponse.data.servicesCards
    : DEFAULT_SERVICES;

  const sectionTitle = contentResponse?.data?.servicesTitle || "What I Deliver";
  const sectionSubtitle = contentResponse?.data?.servicesSubtitle || "Premium video content that drives real business results.";

  return (
    <section className="py-24 md:py-32 bg-[#050508] relative">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            {sectionTitle}
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesCards.map((service: ServiceCard, i: number) => (
            <ServiceCard 
              key={i} 
              service={service} 
              index={i}
              isPrimary={i === 0}
            />
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white text-lg font-medium mb-2">Ready to elevate your content?</p>
              <p className="text-zinc-400 text-sm">Let's discuss your project and create something exceptional.</p>
            </div>
            <a 
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-accent text-background font-bold text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}