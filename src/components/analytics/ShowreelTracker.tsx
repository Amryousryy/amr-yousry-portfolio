"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracker";

export default function ShowreelTracker() {
  useEffect(() => {
    trackEvent("showreel_click", { path: "/showreel" });
  }, []);

  return null;
}
