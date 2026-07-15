import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getLogoSvgDataUri(): string {
  const svgPath = join(process.cwd(), "public", "images", "logo.svg");
  const svg = readFileSync(svgPath, "utf-8");
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
