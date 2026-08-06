export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

const isProduction = process.env.NODE_ENV === "production";

export type AnalyticsParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

function gtagAvailable(): boolean {
  return (
    isProduction &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
}

export function pageview(url?: string): void {
  if (!gtagAvailable()) return;
  const pagePath = url || `${window.location.pathname}${window.location.search}`;
  window.gtag?.("event", "page_view", {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function event(action: string, params: AnalyticsParams = {}): void {
  if (!gtagAvailable()) return;
  window.gtag?.("event", action, params);
}
