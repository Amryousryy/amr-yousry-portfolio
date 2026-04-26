export const ALLOWED_VIDEO_DOMAINS = [
  "https://www.youtube.com",
  "https://youtube.com",
  "https://youtu.be",
  "https://player.vimeo.com",
  "https://vimeo.com",
  "https://res.cloudinary.com",
  "https://mux.com",
  "https://*.mux.com",
] as const;

export const ALLOWED_VIDEO_PATTERNS = [
  /^https:\/\/www\.youtube\.com\/embed\//,
  /^https:\/\/youtube\.com\/embed\//,
  /^https:\/\/youtu\.be\//,
  /^https:\/\/player\.vimeo\.com\/video\//,
  /^https:\/\/vimeo\.com\/\d+/,
  /^https:\/\/res\.cloudinary\.com\//,
  /^https:\/\/.+\.mux\.com\//,
] as const;

export function isAllowedVideoUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url);
    
    // Check exact domain matches first
    for (const domain of ALLOWED_VIDEO_DOMAINS) {
      if (parsed.origin === domain) {
        return true;
      }
    }
    
    // Check pattern matches
    for (const pattern of ALLOWED_VIDEO_PATTERNS) {
      if (pattern.test(url)) {
        return true;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

export function getSafeVideoUrl(url: string | undefined | null): string | null {
  if (isAllowedVideoUrl(url)) {
    return url as string;
  }
  return null;
}