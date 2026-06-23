import type { AnalyticsEventType, TrackPayload } from "./analytics-types";

function getVisitorHash(): string {
  if (typeof window === "undefined") return "";
  try {
    let hash = sessionStorage.getItem("ay_visitor_hash");
    if (!hash) {
      hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("ay_visitor_hash", hash);
    }
    return hash;
  } catch {
    return "";
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem("ay_session_id");
    if (!sid) {
      sid = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem("ay_session_id", sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function trackEvent(event: AnalyticsEventType, payload: TrackPayload) {
  try {
    const visitorHash = getVisitorHash();
    const sessionId = getSessionId();
    const body = JSON.stringify({ event, visitorHash, sessionId, ...payload });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/events", body);
    } else {
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // silently ignore — tracking must never break UI
  }
}
