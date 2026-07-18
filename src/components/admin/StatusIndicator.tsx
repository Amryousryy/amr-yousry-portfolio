"use client";

import { Star } from "lucide-react";

interface StatusIndicatorProps {
  status: string;
  featured: boolean;
}

export default function StatusIndicator({ status, featured }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            status === "published"
              ? "bg-[var(--color-success)] shadow-[var(--shadow-glow-emerald)]"
              : "bg-[var(--color-warning)] shadow-[var(--shadow-glow-yellow)]"
          }`}
        />
        <span className={`text-xs capitalize ${
          status === "published" ? "text-[var(--color-success)]/80" : "text-[var(--color-warning)]/80"
        }`}>
          {status}
        </span>
      </span>
      {featured && (
        <Star
          size={13}
          className="text-[var(--color-warning)] fill-[var(--color-warning)] drop-shadow-[var(--shadow-glow-star)]"
          aria-label="Featured"
        />
      )}
    </div>
  );
}
