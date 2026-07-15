import { toPlainText } from "./text";

const STRING_FIELDS = ["title", "slug", "category", "shortDescription", "fullDescription", "image", "video", "client", "clientName", "problem", "strategy", "solution", "execution", "results", "mainResult", "idea", "outcome", "role"];
const ARRAY_FIELDS = ["tags", "categories", "services", "gallery"];

export function normalizeProject(doc: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...doc };
  for (const field of STRING_FIELDS) {
    if (field in normalized) {
      normalized[field] = toPlainText(normalized[field]);
    }
  }
  for (const field of ARRAY_FIELDS) {
    const arr = normalized[field];
    if (Array.isArray(arr)) {
      normalized[field] = arr.map((item: unknown) => toPlainText(item));
    }
  }
  if (normalized.seo && typeof normalized.seo === "object") {
    const seo = normalized.seo as Record<string, unknown>;
    if (seo.title) seo.title = toPlainText(seo.title);
    if (seo.description) seo.description = toPlainText(seo.description);
  }
  return normalized;
}
