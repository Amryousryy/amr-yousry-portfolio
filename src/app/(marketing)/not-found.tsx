import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-blue flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-pixel text-[11px] text-brand-cyan/50 tracking-[0.3em] uppercase mb-6">Error 404</p>
        <h1 className="font-pixel text-4xl sm:text-5xl text-brand-cyan mb-6 leading-relaxed tracking-wider">
          MISSION:<br />SIGNAL LOST
        </h1>
        <p className="font-modern text-sm sm:text-base text-foreground/60 mb-10 leading-relaxed">
          The page you requested has been lost in the void. It may have been moved, renamed, or never existed at all.
        </p>
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-8 py-3 bg-brand-cyan text-brand-blue font-pixel text-[11px] tracking-[0.25em] uppercase border-2 border-brand-cyan shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}