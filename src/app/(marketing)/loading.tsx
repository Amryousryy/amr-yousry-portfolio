import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0A0A0F] pixel-grid">
      {/* Scanlines overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
        }}
      />
      
      <div className="relative z-20 flex flex-col items-center gap-8 px-4">
        {/* Logo */}
        <div className="relative">
          <img 
            src="/images/logo.svg" 
            alt="AMR YOUSRY" 
            className="w-16 h-16 md:w-20 md:h-20 animate-pulse"
          />
          {/* Pixel corner decorations */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#00F5D4]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00F5D4]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#00F5D4]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00F5D4]" />
        </div>

        {/* Brand Text */}
        <div className={`${pixelify.className} text-[#00F5D4] text-xs md:text-sm tracking-[0.2em]`}>
          AMR YOUSRY
        </div>

        {/* Pixel Loading Bar Container */}
        <div className="w-48 md:w-64 border-2 border-[#00F5D4] p-1 bg-[#0A0A0F] shadow-[4px_4px_0px_0px_rgba(0,245,212,0.3)]">
          {/* Loading Bar Fill */}
          <div className="h-4 bg-[#00F5D4] animate-[loadingBar_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Loading Text */}
        <div className={`${pixelify.className} text-[#00F5D4] text-[8px] md:text-[10px] tracking-[0.3em] opacity-70`}>
          LOADING...
        </div>

        {/* Pixel dots animation */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[#00F5D4] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#6C4AB6] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#F472B6] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
