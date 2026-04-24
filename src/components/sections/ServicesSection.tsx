"use client";

import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { IServiceCard } from "@/lib/validation/settings";

const DEFAULT_SERVICES = [
  { title: { en: "Video Editing", ar: "تحرير الفيديو" }, description: { en: "Cinematic storytelling with rhythm and pace.", ar: "سرد سينمائي بإيقاع وتيرة." }, icon: "🎥" },
  { title: { en: "Motion Design", ar: "تصميم الحركة" }, description: { en: "Dynamic visuals that bring brands to life.", ar: "مرئيات ديناميكية تجذب العلامات التجارية للحياة." }, icon: "🎨" },
  { title: { en: "UGC Strategy", ar: "استراتيجية UGC" }, description: { en: "High-converting authentic video content.", ar: "محتوى فيديو أصلي عالي التحويل." }, icon: "📱" },
  { title: { en: "Sound Design", ar: "تصميم الصوت" }, description: { en: "Immersive audio experiences for every frame.", ar: "تجارب صوتية غامرة لكل إطار." }, icon: "🔊" },
];

export default function ServicesSection() {
  const { data: contentResponse } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => SettingsService.getContent(),
  });

  const servicesCards = contentResponse?.data?.servicesCards && contentResponse.data.servicesCards.length > 0 
    ? contentResponse.data.servicesCards 
    : DEFAULT_SERVICES;

  const title = contentResponse?.data?.servicesTitle?.en 
    ? contentResponse.data.servicesTitle 
    : { en: "Services", ar: "خدمات" };

  return (
    <section className="py-24 bg-[#050508] relative">
      <div className="container mx-auto px-6">
        <h2 
          className="text-4xl text-white mb-16 text-center md:text-left"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {title.en.toUpperCase()} <span className="text-teal-400">SERVICES</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {servicesCards.map((service: IServiceCard, i: number) => (
            <div 
              key={i} 
              className="pixel-box p-8 bg-zinc-900/50 hover:-translate-y-2 transition-transform duration-100 cursor-default group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 
                className="text-teal-400 text-sm mb-4"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {service.title?.en}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {service.description?.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}