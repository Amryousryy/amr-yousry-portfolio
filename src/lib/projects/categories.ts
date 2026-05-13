export const CATEGORY_LABELS: Record<string, string> = {
  "ugc": "UGC Production",
  "ugc-production": "UGC Production",
  "video-editing": "Video Editing",
  "graphic-design": "Graphic Design",
  "motion-graphic": "Motion Graphic",
  "filmmaking": "Filmmaking",
  "ai": "AI",
  "real-estate": "Real Estate",
  "social-media": "Social Media",
};

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category.toLowerCase()] || category;
}

export const PROJECT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "filmmaking", label: "Filmmaking" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "motion-graphic", label: "Motion Graphic" },
  { value: "video-editing", label: "Video Editing" },
  { value: "ai", label: "AI" },
] as const;
