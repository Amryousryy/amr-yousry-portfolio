"use client";

const skills = [
  { name: 'Premiere Pro', level: 95 },
  { name: 'After Effects', level: 90 },
  { name: 'DaVinci Resolve', level: 85 },
  { name: 'Cinema 4D', level: 75 },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-[#050508] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <div className="pixel-box p-2 inline-block mb-8">
              <div className="w-64 h-80 bg-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 border-4 border-[#050508] pointer-events-none" />
                {/* Placeholder for photo */}
                <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs uppercase">
                  [ PHOTO_SCAN ]
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-[1.5]">
            <h2 
              className="text-3xl text-teal-400 mb-8"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ABOUT THE <span className="text-white">DIRECTOR</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
              Based in Cairo, I specialize in crafting visual experiences that bridge the gap between 
              traditional filmmaking and modern digital trends. With over 3 years of experience and 
              50+ successful projects, I bring a unique "pixel-perfect" attention to detail to every frame.
            </p>
            
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-white uppercase font-mono tracking-widest">{skill.name}</span>
                    <span className="text-xs text-teal-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-4 bg-zinc-900 border border-zinc-800 p-1">
                    <div 
                      className="h-full bg-teal-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
