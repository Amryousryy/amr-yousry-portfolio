"use client";

import { useState } from "react";
import { Loader2, VideoOff } from "lucide-react";

interface VideoPreviewProps {
  src: string;
}

export default function VideoPreview({ src }: VideoPreviewProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  if (state === "error") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/5 p-3">
        <VideoOff size={24} className="text-foreground/30" />
        <span className="text-[8px] text-foreground/40 uppercase tracking-wider text-center">
          Video preview unavailable
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-accent hover:text-accent/80 underline"
        >
          Open video
        </a>
      </div>
    );
  }

  return (
    <>
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 z-10">
          <Loader2 size={20} className="animate-spin text-accent" />
        </div>
      )}
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onError={() => setState("error")}
        onLoadedMetadata={(e) => {
          const vid = e.target as HTMLVideoElement;
          setState(!vid.duration || isNaN(vid.duration) ? "error" : "loaded");
        }}
        onCanPlay={() => setState("loaded")}
      />
    </>
  );
}
