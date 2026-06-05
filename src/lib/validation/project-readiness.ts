export type ReadinessSeverity = "blocking" | "warning" | "info";

export interface ReadinessIssue {
  field: string;
  severity: ReadinessSeverity;
  message: string;
}

export interface ReadinessResult {
  isPublishReady: boolean;
  issues: ReadinessIssue[];
}

const STALE_PLACEHOLDERS = [
  "arcade experience",
  "creative personal project",
  "retro digital experience",
  "sega arcade",
  "new project",
  "sample project",
  "test project",
  "untitled project",
  "lorem ipsum",
];

function isPlaceholder(val: string): boolean {
  const lower = val.toLowerCase().trim();
  return STALE_PLACEHOLDERS.some(p => lower === p.toLowerCase());
}

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i;

export function detectExpectedMediaType(url: string): "image" | "video" | null {
  if (!url) return null;
  const cleanUrl = url.split("?")[0].split("#")[0];
  if (VIDEO_EXT.test(cleanUrl)) return "video";
  if (IMAGE_EXT.test(cleanUrl)) return "image";
  return null;
}

export function checkReadiness(
  data: Record<string, unknown>,
): ReadinessResult {
  const issues: ReadinessIssue[] = [];

  const s = (field: string): string =>
    typeof data[field] === "string" ? (data[field] as string).trim() : "";

  const arr = (field: string): unknown[] =>
    Array.isArray(data[field]) ? (data[field] as unknown[]) : [];

  const obj = (field: string): Record<string, unknown> | null =>
    data[field] && typeof data[field] === "object"
      ? (data[field] as Record<string, unknown>)
      : null;

  // ── BLOCKING: Core fields ──
  if (!s("title")) {
    issues.push({ field: "title", severity: "blocking", message: "Title is required" });
  }
  if (!s("slug")) {
    issues.push({ field: "slug", severity: "blocking", message: "Slug is required" });
  }
  if (!s("shortDescription")) {
    issues.push({ field: "shortDescription", severity: "blocking", message: "Short description is required" });
  }
  if (!s("fullDescription")) {
    issues.push({ field: "fullDescription", severity: "blocking", message: "Full description is required" });
  }
  if (!s("category")) {
    issues.push({ field: "category", severity: "blocking", message: "Category is required" });
  }
  if (arr("categories").length === 0) {
    issues.push({ field: "categories", severity: "blocking", message: "At least one category is required" });
  }
  if (!s("image")) {
    issues.push({ field: "image", severity: "blocking", message: "Cover image / thumbnail is required" });
  }

  // ── BLOCKING: Media integrity ──
  const mediaItems = arr("caseStudyMedia") as Record<string, unknown>[];
  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    const src = typeof item.src === "string" ? item.src.trim() : "";
    if (!src) {
      issues.push({ field: `caseStudyMedia[${i}].src`, severity: "blocking", message: `Media item ${i + 1} has an empty URL` });
      continue;
    }
    const selectedType = typeof item.type === "string" ? item.type : "";
    const detected = detectExpectedMediaType(src);
    if (detected === "image" && selectedType !== "image") {
      issues.push({ field: `caseStudyMedia[${i}].type`, severity: "blocking", message: `Media item ${i + 1} URL looks like an image but type is "${selectedType}"` });
    }
    if (detected === "video" && selectedType !== "video") {
      issues.push({ field: `caseStudyMedia[${i}].type`, severity: "blocking", message: `Media item ${i + 1} URL looks like a video but type is "${selectedType}"` });
    }
  }

  const featured = !!data.featured;
  if (featured) {
    if (!s("image")) {
      issues.push({ field: "image", severity: "blocking", message: "Featured project must have a thumbnail" });
    }
    if (mediaItems.length === 0) {
      issues.push({ field: "caseStudyMedia", severity: "blocking", message: "Featured project must have case study media" });
    }
  }

  // ── BLOCKING: Stale placeholder detection ──
  const seoObj = obj("seo");
  if (seoObj) {
    const seoTitle = typeof seoObj.title === "string" ? seoObj.title : "";
    const seoDesc = typeof seoObj.description === "string" ? seoObj.description : "";
    if (seoTitle && isPlaceholder(seoTitle)) {
      issues.push({ field: "seo.title", severity: "blocking", message: "SEO title contains stale placeholder wording" });
    }
    if (seoDesc && isPlaceholder(seoDesc)) {
      issues.push({ field: "seo.description", severity: "blocking", message: "SEO description contains stale placeholder wording" });
    }
  }

  const titleVal = s("title");
  if (titleVal && isPlaceholder(titleVal)) {
    issues.push({ field: "title", severity: "blocking", message: "Title contains stale placeholder wording" });
  }

  // ── WARNING: SEO ──
  if (seoObj) {
    if (!seoObj.title) {
      issues.push({ field: "seo.title", severity: "warning", message: "SEO title is empty" });
    }
    if (!seoObj.description) {
      issues.push({ field: "seo.description", severity: "warning", message: "SEO description is empty" });
    }
    const keywords = Array.isArray(seoObj.keywords) ? seoObj.keywords : [];
    if (keywords.length === 0) {
      issues.push({ field: "seo.keywords", severity: "warning", message: "SEO keywords are empty" });
    }
  }

  // ── WARNING: Content quality ──
  if (arr("services").length === 0) {
    issues.push({ field: "services", severity: "warning", message: "No services listed" });
  }
  if (arr("tags").length === 0) {
    issues.push({ field: "tags", severity: "warning", message: "No tags added" });
  }
  if (arr("detailedResults").length === 0) {
    issues.push({ field: "detailedResults", severity: "warning", message: "No detailed results" });
  }
  if (arr("sections").length === 0) {
    issues.push({ field: "sections", severity: "warning", message: "No case study sections" });
  }
  if (!s("client") && !s("clientName")) {
    issues.push({ field: "client", severity: "warning", message: "Client information is empty" });
  }
  if (!s("year")) {
    issues.push({ field: "year", severity: "warning", message: "Year is not set" });
  }
  if (!s("results")) {
    issues.push({ field: "results", severity: "warning", message: "Results summary is empty" });
  }
  if (!s("strategy") && !s("idea")) {
    issues.push({ field: "strategy", severity: "warning", message: "Strategy / idea section is empty" });
  }
  if (!s("execution")) {
    issues.push({ field: "execution", severity: "warning", message: "Execution summary is empty" });
  }

  // ── WARNING: Media accessibility ──
  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    const alt = typeof item.alt === "string" ? item.alt.trim() : "";
    if (!alt) {
      issues.push({ field: `caseStudyMedia[${i}].alt`, severity: "warning", message: `Media item ${i + 1} has no alt text` });
    }
    const caption = typeof item.caption === "string" ? item.caption.trim() : "";
    if (!caption) {
      issues.push({ field: `caseStudyMedia[${i}].caption`, severity: "warning", message: `Media item ${i + 1} has no caption` });
    }
  }
  if (arr("gallery").length === 0) {
    issues.push({ field: "gallery", severity: "warning", message: "No gallery items" });
  }
  if (featured && mediaItems.length < 2) {
    issues.push({ field: "caseStudyMedia", severity: "warning", message: "Featured projects should have at least 2 case study media items" });
  }
  if (featured && !arr("gallery").some(u => VIDEO_EXT.test(String(u)) || String(u).includes("/video/"))) {
    issues.push({ field: "featured", severity: "warning", message: "Featured project should include video media" });
  }

  const hasBlocking = issues.some(i => i.severity === "blocking");
  return { isPublishReady: !hasBlocking, issues };
}
