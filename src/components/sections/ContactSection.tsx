"use client";

const ContactSection = () => {
  return (
    <section className="py-24 bg-[#050508] relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-6xl text-white mb-6 glitch-text"
            data-text="CUT! LET'S WORK"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            CUT! LET'S WORK
          </h2>
          <p className="text-teal-400 font-mono tracking-widest uppercase text-sm">
            Together we create the next masterpiece
          </p>
        </div>
        
        <div className="pixel-box p-8 md:p-12 bg-zinc-900/50">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-mono">Mission Name (Full Name)</label>
                <input 
                  type="text" 
                  className="w-full bg-[#050508] border-2 border-zinc-800 focus:border-teal-500 outline-none p-4 text-white font-mono text-sm transition-colors"
                  placeholder="COMMANDER NAME"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-mono">Signal Channel (Email)</label>
                <input 
                  type="email" 
                  className="w-full bg-[#050508] border-2 border-zinc-800 focus:border-teal-500 outline-none p-4 text-white font-mono text-sm transition-colors"
                  placeholder="COMMAND@BASE.COM"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-mono">Mission Brief (Message)</label>
              <textarea 
                rows={5}
                className="w-full bg-[#050508] border-2 border-zinc-800 focus:border-teal-500 outline-none p-4 text-white font-mono text-sm transition-colors resize-none"
                placeholder="DESCRIBE YOUR VISION..."
              />
            </div>
            
            <button className="pixel-btn w-full">
              Transmit Brief
            </button>
          </form>
        </div>
        
        <div className="mt-12 flex justify-center gap-8">
          <a href="#" className="text-zinc-500 hover:text-teal-400 transition-colors uppercase text-[10px] font-mono tracking-widest">Instagram</a>
          <a href="#" className="text-zinc-500 hover:text-teal-400 transition-colors uppercase text-[10px] font-mono tracking-widest">Vimeo</a>
          <a href="#" className="text-zinc-500 hover:text-teal-400 transition-colors uppercase text-[10px] font-mono tracking-widest">LinkedIn</a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
