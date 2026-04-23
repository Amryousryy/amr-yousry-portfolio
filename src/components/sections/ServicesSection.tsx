"use client";

const services = [
  { 
    title: 'Video Editing', 
    desc: 'Cinematic storytelling with rhythm and pace.', 
    icon: '🎥' 
  },
  { 
    title: 'Motion Design', 
    desc: 'Dynamic visuals that bring brands to life.', 
    icon: '🎨' 
  },
  { 
    title: 'UGC Strategy', 
    desc: 'High-converting authentic video content.', 
    icon: '📱' 
  },
  { 
    title: 'Sound Design', 
    desc: 'Immersive audio experiences for every frame.', 
    icon: '🔊' 
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-[#050508] relative">
      <div className="container mx-auto px-6">
        <h2 
          className="text-4xl text-white mb-16 text-center md:text-left"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          CORE <span className="text-teal-400">SERVICES</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, i) => (
            <div 
              key={i} 
              className="pixel-box p-8 bg-zinc-900/50 hover:-translate-y-2 transition-transform duration-100 cursor-default group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 
                className="text-teal-400 text-sm mb-4"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {service.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
