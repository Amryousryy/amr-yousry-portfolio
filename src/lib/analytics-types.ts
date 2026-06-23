export type AnalyticsEventType =
  | "page_view"
  | "project_card_click"
  | "project_detail_view"
  | "category_filter_click"
  | "contact_cta_click"
  | "showreel_click"
  | "showreel_play"
  | "showreel_complete"
  | "form_submit"
  | "email_click"
  | "whatsapp_click";

export const ALLOWED_EVENTS: AnalyticsEventType[] = [
  "page_view",
  "project_card_click",
  "project_detail_view",
  "category_filter_click",
  "contact_cta_click",
  "showreel_click",
  "showreel_play",
  "showreel_complete",
  "form_submit",
  "email_click",
  "whatsapp_click",
];

export interface TrackPayload {
  path: string;
  projectSlug?: string;
  category?: string;
  label?: string;
  visitorHash?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ParsedUserAgent {
  deviceType: string;
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  const lower = ua.toLowerCase();

  let deviceType = "desktop";
  if (/mobile|android.*mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    deviceType = "mobile";
  } else if (/tablet|ipad|playbook|silk|android(?!.*mobile)/i.test(ua)) {
    deviceType = "tablet";
  }

  let browser = "unknown";
  if (lower.includes("opr") || lower.includes("opera")) {
    browser = "Opera";
  } else if (lower.includes("edg")) {
    browser = "Edge";
  } else if (lower.includes("chrome") && !lower.includes("chromium")) {
    browser = "Chrome";
  } else if (lower.includes("firefox") && !lower.includes("seamonkey")) {
    browser = "Firefox";
  } else if (lower.includes("safari") && !lower.includes("chrome")) {
    browser = "Safari";
  }

  let os = "unknown";
  if (lower.includes("win")) {
    os = "Windows";
  } else if (lower.includes("mac") || lower.includes("darwin")) {
    os = "macOS";
  } else if (lower.includes("linux") && !lower.includes("android")) {
    os = "Linux";
  } else if (lower.includes("android")) {
    os = "Android";
  } else if (lower.includes("ios") || lower.includes("iphone") || lower.includes("ipad")) {
    os = "iOS";
  }

  return { deviceType, browser, os };
}

export function extractReferrerDomain(referrer: string): string | undefined {
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export type DateRange = "24h" | "7d" | "30d" | "all";

export function getDateRange(range: DateRange): Date | null {
  if (range === "all") return null;
  const now = Date.now();
  const ms = range === "24h" ? 24 * 60 * 60 * 1000
    : range === "7d" ? 7 * 24 * 60 * 60 * 1000
    : 30 * 24 * 60 * 60 * 1000;
  return new Date(now - ms);
}

export interface OverviewData {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  visits7d: number;
  visits30d: number;
  projectDetailViews: number;
  contactActions: number;
  topProject: { slug: string; title: string; views: number } | null;
  topReferrer: { domain: string; count: number } | null;
}

export interface TrendPoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface TopPage {
  path: string;
  views: number;
  uniqueVisitors: number;
  lastVisit: string | null;
}

export interface TopProject {
  slug: string;
  title: string;
  views: number;
  uniqueVisitors: number;
}

export interface ConversionEvent {
  event: string;
  count: number;
}

export interface DeviceStat {
  type: string;
  count: number;
}

export interface ReferrerStat {
  domain: string;
  count: number;
}

export interface RecentEvent {
  _id: string;
  type: string;
  interactionType?: string;
  page: string;
  deviceType?: string;
  referrerDomain?: string;
  createdAt: string;
}

export interface AnalyticsResponse {
  overview: OverviewData;
  trend: TrendPoint[];
  topPages: TopPage[];
  topProjects: TopProject[];
  conversions: ConversionEvent[];
  devices: DeviceStat[];
  referrers: ReferrerStat[];
  recentEvents: RecentEvent[];
}