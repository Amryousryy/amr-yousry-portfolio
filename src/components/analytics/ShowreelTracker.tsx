"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/tracker";

export default function ShowreelTracker() {
  const trackedPlay = useRef(false);
  const trackedComplete = useRef(false);

  useEffect(() => {
    trackEvent("showreel_click", { path: "/showreel" });

    const videos = document.querySelectorAll("video");
    if (videos.length === 0) return;

    const playHandler = () => {
      if (!trackedPlay.current) {
        trackedPlay.current = true;
        trackEvent("showreel_play", { path: "/showreel" });
      }
    };

    const endedHandler = () => {
      if (!trackedComplete.current) {
        trackedComplete.current = true;
        trackEvent("showreel_complete", { path: "/showreel" });
      }
    };

    videos.forEach((v) => {
      v.addEventListener("play", playHandler);
      v.addEventListener("ended", endedHandler);
    });

    return () => {
      videos.forEach((v) => {
        v.removeEventListener("play", playHandler);
        v.removeEventListener("ended", endedHandler);
      });
    };
  }, []);

  return null;
}
