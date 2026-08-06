export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

const isProduction = process.env.NODE_ENV === "production";

export function pageview(url: string): void {
  if (!isProduction || typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export function event({ action, category, label, value }: AnalyticsEvent): void {
  if (!isProduction || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
