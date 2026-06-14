export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-blue flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-48 h-1 bg-white/10 mb-6 overflow-hidden">
        <div className="h-full bg-brand-cyan" style={{ animation: "loadingBarFill 2s ease-in-out infinite" }} />
      </div>
      <p className="font-pixel text-[10px] text-text-dim uppercase tracking-widest">Loading...</p>
    </div>
  );
}
