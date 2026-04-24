export type ContentStatus = "draft" | "published";

export const CONTENT_STATUSES = ["draft", "published"] as const;

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];

export const OFFER_TYPES = ["general", "free_audit"] as const;
export type OfferType = typeof OFFER_TYPES[number];

export const ACTIVITY_ACTIONS = ["create", "update", "delete", "login", "publish"] as const;
export type ActivityAction = typeof ACTIVITY_ACTIONS[number];

export const ACTIVITY_TARGETS = ["project", "settings", "auth"] as const;
export type ActivityTarget = typeof ACTIVITY_TARGETS[number];

export const ANALYTICS_TYPES = ["page_view", "interaction"] as const;
export type AnalyticsType = typeof ANALYTICS_TYPES[number];

export const MEDIA_TYPES = ["image", "video"] as const;
export type MediaType = typeof MEDIA_TYPES[number];