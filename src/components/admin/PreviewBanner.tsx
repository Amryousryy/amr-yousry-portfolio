"use client";

import React from "react";
import { Eye } from "lucide-react";

interface PreviewBannerProps {
  message?: string;
}

export function PreviewBanner({ message = "Preview Mode - Draft Content" }: PreviewBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 text-black px-4 py-2 text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
      <Eye size={14} />
      <span>{message}</span>
    </div>
  );
}

export function isPreviewMode(data: unknown): boolean {
  if (data && typeof data === "object" && "_preview" in data) {
    return (data as { _preview: boolean })._preview === true;
  }
  return false;
}