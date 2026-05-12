export function toPlainText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const localized = value as { en?: unknown; ar?: unknown };
    if (typeof localized.en === "string") return localized.en;
    if (typeof localized.ar === "string") return localized.ar;
  }
  return fallback;
}
