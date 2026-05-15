"use client";

import { useState } from "react";
import Image from "next/image";
import { VideoOff, Play } from "lucide-react";
import { getVideoThumbnailUrl } from "@/lib/media/config";

interface VideoPosterCardProps {
  src: string;
}

export default function VideoPosterCard({ src }: VideoPosterCardProps) {
  const thumbUrl = getVideoThumbnailUrl(src);
  const [fallback, setFallback] = useState(false);

  if (!thumbUrl || fallback) {
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
    <div className="absolute inset-0 bg-primary/5">
      <Image src={thumbUrl} alt="" fill className="object-cover" onError={() => setFallback(true)} />
      <span className="absolute inset-0 flex items-center justify-center bg-background/10">
        <Play size={24} className="text-accent" />
      </span>
    </div>
  );
}
