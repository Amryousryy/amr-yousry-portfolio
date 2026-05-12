type TrackEvent =
  | "page_view"
  | "project_card_click"
  | "project_detail_view"
  | "category_filter_click"
  | "contact_cta_click"
  | "showreel_click";

interface TrackPayload {
  path: string;
  projectSlug?: string;
  category?: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export function trackEvent(event: TrackEvent, payload: TrackPayload) {
  try {
    const body = JSON.stringify({ event, ...payload });
    fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  } catch {
    // silently ignore — tracking must never break UI
  }
}
