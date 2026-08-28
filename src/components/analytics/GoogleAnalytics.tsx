"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/analytics";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!GA_MEASUREMENT_ID) return;
    import("@/components/analytics/ga-runtime")
      .then(({ bootGA }) => bootGA(GA_MEASUREMENT_ID))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      pageview(pathname + window.location.search);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}