import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getLogoSvgDataUri(): string {
  const svgPath = join(process.cwd(), "public", "images", "logo.svg");
  const svg = readFileSync(svgPath, "utf-8");
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export function getOgLogoMarkPngDataUri(): string {
  const pngPath = join(process.cwd(), "public", "images", "meta", "og-logo-mark.png");
  const png = readFileSync(pngPath);
  const base64 = png.toString("base64");
  return `data:image/png;base64,${base64}`;
}
