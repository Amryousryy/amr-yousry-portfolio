import { describe, it, expect } from "vitest";
import { collectProjectMediaUrls } from "@/lib/cloudinary";

describe("collectProjectMediaUrls", () => {
  it("collects every project-owned asset including caseStudyMedia", () => {
    const urls = collectProjectMediaUrls({
      image: "cloud://img/main.jpg",
      video: "cloud://video/main.mp4",
      gallery: ["cloud://g/1.jpg", "cloud://g/2.jpg"],
      sections: [{ media: [{ url: "cloud://s/1.jpg" }, { url: "cloud://s/2.jpg" }] }],
      caseStudyMedia: [{ src: "cloud://cs/1.jpg" }, { src: "cloud://cs/2.mp4" }],
    });

    expect(urls).toEqual([
      "cloud://img/main.jpg",
      "cloud://video/main.mp4",
      "cloud://g/1.jpg",
      "cloud://g/2.jpg",
      "cloud://s/1.jpg",
      "cloud://s/2.jpg",
      "cloud://cs/1.jpg",
      "cloud://cs/2.mp4",
    ]);
  });

  it("dedupes URLs shared across fields so Cloudinary deletes each asset once", () => {
    const urls = collectProjectMediaUrls({
      image: "cloud://same.jpg",
      gallery: ["cloud://same.jpg"],
      sections: [{ media: [{ url: "cloud://same.jpg" }] }],
      caseStudyMedia: [{ src: "cloud://same.jpg" }],
    });

    expect(urls).toEqual(["cloud://same.jpg"]);
  });

  it("skips missing/invalid entries without failing the collection", () => {
    const urls = collectProjectMediaUrls({
      image: "",
      video: null,
      gallery: ["", null, "cloud://ok.jpg"],
      sections: [{ media: [{ url: null }, { url: "" }, null] }],
      caseStudyMedia: [{ src: "" }, null],
    });

    expect(urls).toEqual(["cloud://ok.jpg"]);
  });

  it("handles projects with absent optional fields", () => {
    expect(collectProjectMediaUrls({ image: "cloud://img.jpg" })).toEqual(["cloud://img.jpg"]);
    expect(collectProjectMediaUrls({})).toEqual([]);
    expect(collectProjectMediaUrls({ gallery: [], sections: [], caseStudyMedia: [] })).toEqual([]);
  });
});