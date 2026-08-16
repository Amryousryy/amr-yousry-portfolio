import { describe, it, expect } from "vitest";
import { normalizeCaseStudyMedia } from "@/lib/project-utils";

describe("normalizeCaseStudyMedia", () => {
  it("returns non-array input unchanged", () => {
    expect(normalizeCaseStudyMedia(undefined)).toBe(undefined);
    expect(normalizeCaseStudyMedia(null)).toBe(null);
    const obj = { a: 1 };
    expect(normalizeCaseStudyMedia(obj)).toBe(obj);
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeCaseStudyMedia([])).toEqual([]);
  });

  it("leaves items with an explicit type untouched", () => {
    const item = { src: "a.mp4", type: "video", alt: "clip" };
    const result = normalizeCaseStudyMedia([item]) as unknown[];
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(item);
  });

  it("infers image type from an image URL", () => {
    const item = { src: "https://example.com/poster.jpg" };
    const result = normalizeCaseStudyMedia([item]) as Record<string, unknown>[];
    expect(result[0]).toEqual({ src: "https://example.com/poster.jpg", type: "image" });
  });

  it("infers video type from a video URL with a query string", () => {
    const item = { src: "/media/showreel.webm?v=2", type: "" };
    const result = normalizeCaseStudyMedia([item]) as Record<string, unknown>[];
    expect(result[0].type).toBe("video");
  });

  it("keeps items without a detectable src type unchanged", () => {
    const item = { src: "https://example.com/page" };
    const result = normalizeCaseStudyMedia([item]) as unknown[];
    expect(result[0]).toBe(item);
  });

  it("does not mutate the original item or input array", () => {
    const item: Record<string, unknown> = { src: "clip.mov" };
    const media = [item];
    normalizeCaseStudyMedia(media);
    expect(item.type).toBeUndefined();
    expect(media).toHaveLength(1);
    expect(media[0]).toBe(item);
  });

  it("preserves item order and leaves other fields intact", () => {
    const a = { src: "a.mp4", alt: "A" };
    const b = { src: "b.png", alt: "B" };
    const c = { src: "c.xyz" };
    const result = normalizeCaseStudyMedia([a, b, c]) as Record<string, unknown>[];
    expect(result[0]).toEqual({ src: "a.mp4", type: "video", alt: "A" });
    expect(result[1]).toEqual({ src: "b.png", type: "image", alt: "B" });
    expect(result[2]).toBe(c);
  });

  it("treats a non-string type as absent", () => {
    const item = { src: "img.svg", type: 7 } as Record<string, unknown>;
    const result = normalizeCaseStudyMedia([item]) as Record<string, unknown>[];
    expect(result[0].type).toBe("image");
  });
});
