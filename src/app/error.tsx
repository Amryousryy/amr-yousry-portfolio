"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Application Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-red-500/30 bg-red-500/10">
          <span className="text-red-400 font-pixel text-lg">!</span>
        </div>
        <h1 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4">System Error</h1>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest pixel-border hover:bg-accent/80 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
