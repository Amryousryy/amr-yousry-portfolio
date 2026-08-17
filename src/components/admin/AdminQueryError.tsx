"use client";

import { useQueryClient } from "@tanstack/react-query";

interface AdminQueryErrorProps {
  title: string;
  queryKey: string[];
  message?: string;
}

export default function AdminQueryError({ title, queryKey, message }: AdminQueryErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-red-500 text-2xl font-bold">!</span>
      </div>
      <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-foreground/50 text-sm mb-6 text-center max-w-md">
        {message}
      </p>
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey })}
        className="flex items-center space-x-2 px-6 py-3 bg-accent text-on-accent font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-all"
      >
        Retry
      </button>
    </div>
  );
}
