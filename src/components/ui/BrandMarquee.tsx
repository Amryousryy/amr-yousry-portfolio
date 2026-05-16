import { BRAND_LOGOS } from "@/data/brands";

export default function BrandMarquee() {
  // Hide marquee entirely if no real client logos are configured
  if (BRAND_LOGOS.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-blue/80 border-y border-slate-800/50 py-8 md:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-6 md:mb-8">
        <p className="font-pixel text-brand-cyan/60 text-[10px] tracking-[0.3em] uppercase text-center">
          Trusted By
        </p>
      </div>
      
        <div className="relative group">
        <div className="flex items-center gap-8 md:gap-16 animate-marquee hover:[animation-play-state:paused]" style={{"--marquee-duration": "60s"} as React.CSSProperties}>
          {/* First set of logos */}
          {BRAND_LOGOS.map((brand, i) => (
            <div
              key={`first-${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: 'clamp(112px, 34vw, 160px)', height: '60px', padding: '0 8px' }}
            >
              {brand.logoPath ? (
                <a
                  href={brand.website || undefined}
                  target={brand.website ? "_blank" : undefined}
                  rel={brand.website ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center h-full w-full"
                  style={{ 
                    filter: 'brightness(1.8) contrast(1.05)',
                  }}
                >
                  <img
                    src={brand.logoPath}
                    alt={`${brand.name} logo`}
                    width={160}
                    height={56}
                    className="max-h-full w-auto object-contain hover:brightness-125 transition-all duration-300"
                    style={{ maxHeight: '56px', maxWidth: '100%' }}
                  />
                </a>
              ) : (
                <span className="font-pixel text-white/70 text-sm whitespace-nowrap">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
          {/* Second set - identical for seamless loop */}
          {BRAND_LOGOS.map((brand, i) => (
            <div
              key={`second-${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: 'clamp(112px, 34vw, 160px)', height: '60px', padding: '0 8px' }}
            >
              {brand.logoPath ? (
                <a
                  href={brand.website || undefined}
                  target={brand.website ? "_blank" : undefined}
                  rel={brand.website ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center h-full w-full"
                  style={{ 
                    filter: 'brightness(1.8) contrast(1.05)',
                  }}
                >
                  <img
                    src={brand.logoPath}
                    alt={`${brand.name} logo`}
                    width={160}
                    height={56}
                    className="max-h-full w-auto object-contain hover:brightness-125 transition-all duration-300"
                    style={{ maxHeight: '56px', maxWidth: '100%' }}
                  />
                </a>
              ) : (
                <span className="font-pixel text-white/70 text-sm whitespace-nowrap">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Subtle fade edges - reduced width to preserve logo visibility */}
        <div className="absolute top-0 left-0 w-8 sm:w-16 h-full bg-gradient-to-r from-brand-blue/95 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 sm:w-16 h-full bg-gradient-to-l from-brand-blue/95 to-transparent z-10 pointer-events-none" />
      </div>
      

    </div>
  );
}
