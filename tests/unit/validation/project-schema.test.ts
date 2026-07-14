import { describe, it, expect } from "vitest";
import {
  projectCreateSchema,
  projectUpdateSchema,
  projectDefaultValues,
  generateSlugFromTitle,
} from "@/lib/validation";
import {
  stringSchema,
  safeUrlSchema,
  seoSchema,
  contentStatusSchema,
  normalizeSlug,
} from "@/lib/validation/shared";

function validMinimal(overrides: Record<string, unknown> = {}) {
  return {
    slug: "test-project",
    title: "Test Project",
    status: "draft",
    ...overrides,
  };
}

describe("projectCreateSchema", () => {
  describe("required fields", () => {
    it("accepts valid minimal payload", () => {
      const r = projectCreateSchema.safeParse(validMinimal());
      expect(r.success).toBe(true);
    });

    it("rejects empty title", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ title: "" }));
      expect(r.success).toBe(false);
    });

    it("rejects missing title", () => {
      const { title, ...rest } = validMinimal();
      const r = projectCreateSchema.safeParse(rest);
      expect(r.success).toBe(false);
    });

    it("rejects empty slug", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "" }));
      expect(r.success).toBe(false);
    });

    it("rejects missing slug", () => {
      const { slug, ...rest } = validMinimal();
      const r = projectCreateSchema.safeParse(rest);
      expect(r.success).toBe(false);
    });

    it("rejects whitespace-only title", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ title: "   " }));
      expect(r.success).toBe(false);
    });

    it("trims title whitespace", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ title: "  My Project  " }));
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.title).toBe("My Project");
    });
  });

  describe("optional string fields", () => {
    const optionalStringFields = [
      "problem", "strategy", "solution", "execution",
      "results", "idea", "mainResult",
    ];

    for (const field of optionalStringFields) {
      it(`accepts undefined ${field}`, () => {
        const r = projectCreateSchema.safeParse(validMinimal({ [field]: undefined }));
        expect(r.success).toBe(true);
      });

      it(`accepts valid ${field}`, () => {
        const r = projectCreateSchema.safeParse(validMinimal({ [field]: "Some content" }));
        expect(r.success).toBe(true);
        if (r.success) expect(r.data[field as keyof typeof r.data]).toBe("Some content");
      });

      it(`accepts empty string ${field}`, () => {
        const r = projectCreateSchema.safeParse(validMinimal({ [field]: "" }));
        expect(r.success).toBe(true);
      });
    }
  });

  describe("client field (z.string().optional())", () => {
    it("accepts undefined client", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ client: undefined }));
      expect(r.success).toBe(true);
    });

    it("accepts empty string client", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ client: "" }));
      expect(r.success).toBe(true);
    });

    it("accepts valid client", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ client: "ACME Corp" }));
      expect(r.success).toBe(true);
    });
  });

  describe("slug validation", () => {
    it("accepts valid slug", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "my-project" }));
      expect(r.success).toBe(true);
    });

    it("normalizes slug via transform", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "my-project" }));
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.slug).toBe("my-project");
    });

    it("rejects slug with spaces", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "my project" }));
      expect(r.success).toBe(false);
    });

    it("rejects slug with special characters", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "my_project" }));
      expect(r.success).toBe(false);
    });

    it("rejects slug with leading hyphen", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "-my-project" }));
      expect(r.success).toBe(false);
    });

    it("rejects slug with double hyphens", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "my--project" }));
      expect(r.success).toBe(false);
    });

    it("rejects arabic slug", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ slug: "مشروع" }));
      expect(r.success).toBe(false);
    });
  });

  describe("status enum", () => {
    it("accepts draft", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ status: "draft" }));
      expect(r.success).toBe(true);
    });

    it("accepts published", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ status: "published" }));
      expect(r.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ status: "archived" }));
      expect(r.success).toBe(false);
    });
  });

  describe("URL fields", () => {
    it("accepts valid HTTPS image", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        image: "https://res.cloudinary.com/test/image.png",
      }));
      expect(r.success).toBe(true);
    });

    it("accepts valid HTTP image", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        image: "http://example.com/img.jpg",
      }));
      expect(r.success).toBe(true);
    });

    it("rejects javascript: URL", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        image: "javascript:alert(1)",
      }));
      expect(r.success).toBe(false);
    });

    it("rejects data: URL", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        image: "data:text/html,<script>alert(1)</script>",
      }));
      expect(r.success).toBe(false);
    });

    it("rejects invalid URL format", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        image: "not-a-url",
      }));
      expect(r.success).toBe(false);
    });

    it("accepts empty string image (defaults to empty)", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ image: "" }));
      expect(r.success).toBe(true);
    });

    it("accepts undefined video", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ video: undefined }));
      expect(r.success).toBe(true);
    });

    it("accepts valid video URL", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        video: "https://youtube.com/watch?v=123",
      }));
      expect(r.success).toBe(true);
    });
  });

  describe("array fields", () => {
    it("accepts valid tags array", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        tags: ["tag1", "tag2"],
      }));
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.tags).toEqual(["tag1", "tag2"]);
    });

    it("defaults empty tags", () => {
      const r = projectCreateSchema.safeParse(validMinimal());
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.tags).toEqual([]);
    });

    it("accepts valid categories array", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        categories: ["Motion Graphics", "3D"],
      }));
      expect(r.success).toBe(true);
    });

    it("accepts valid services array", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        services: ["Web Dev", "Design"],
      }));
      expect(r.success).toBe(true);
    });

    it("accepts valid gallery array", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        gallery: ["https://example.com/img1.png"],
      }));
      expect(r.success).toBe(true);
    });

    it("rejects non-array tags", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        tags: "not-an-array",
      }));
      expect(r.success).toBe(false);
    });
  });

  describe("detailedResults", () => {
    it("accepts valid detailed results", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        detailedResults: [{ label: "ROI", value: "+200%" }],
      }));
      expect(r.success).toBe(true);
    });

    it("rejects detailed result with empty label", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        detailedResults: [{ label: "", value: "+200%" }],
      }));
      expect(r.success).toBe(false);
    });

    it("rejects detailed result with empty value", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        detailedResults: [{ label: "ROI", value: "" }],
      }));
      expect(r.success).toBe(false);
    });
  });

  describe("SEO fields", () => {
    it("accepts valid SEO object", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        seo: { title: "SEO Title", description: "Desc", keywords: ["k1"] },
      }));
      expect(r.success).toBe(true);
    });

    it("accepts undefined SEO", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ seo: undefined }));
      expect(r.success).toBe(true);
    });

    it("accepts empty SEO", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        seo: { title: "", description: "", keywords: [] },
      }));
      expect(r.success).toBe(true);
    });

    it("defaults SEO keywords to empty array", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        seo: { title: "t", description: "d" },
      }));
      expect(r.success).toBe(true);
      if (r.success && r.data.seo) expect(r.data.seo.keywords).toEqual([]);
    });

    it("rejects non-array SEO keywords", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        seo: { title: "t", keywords: "not-array" },
      }));
      expect(r.success).toBe(false);
    });
  });

  describe("numeric fields", () => {
    it("accepts valid featuredOrder", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ featuredOrder: 5 }));
      expect(r.success).toBe(true);
    });

    it("rejects float featuredOrder", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ featuredOrder: 1.5 }));
      expect(r.success).toBe(false);
    });

    it("accepts negative featuredOrder", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ featuredOrder: -1 }));
      expect(r.success).toBe(true);
    });

    it("accepts valid displayOrder", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ displayOrder: 3 }));
      expect(r.success).toBe(true);
    });
  });

  describe("boolean fields", () => {
    it("accepts featured true", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ featured: true }));
      expect(r.success).toBe(true);
    });

    it("accepts featured false", () => {
      const r = projectCreateSchema.safeParse(validMinimal({ featured: false }));
      expect(r.success).toBe(true);
    });

    it("defaults featured to false", () => {
      const r = projectCreateSchema.safeParse(validMinimal());
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.featured).toBe(false);
    });
  });

  describe("sections", () => {
    it("accepts valid sections", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        sections: [{
          id: "sec-1",
          title: "Section 1",
          content: "Content here",
          media: [],
        }],
      }));
      expect(r.success).toBe(true);
    });

    it("defaults section title/content to empty string", () => {
      const r = projectCreateSchema.safeParse(validMinimal({
        sections: [{ id: "s1" }],
      }));
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.sections[0].title).toBe("");
        expect(r.data.sections[0].content).toBe("");
      }
    });
  });
});

describe("projectUpdateSchema", () => {
  it("accepts partial payload (only title)", () => {
    const r = projectUpdateSchema.safeParse({ title: "Updated" });
    expect(r.success).toBe(true);
  });

  it("accepts empty object", () => {
    const r = projectUpdateSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it("accepts partial tags only", () => {
    const r = projectUpdateSchema.safeParse({ tags: ["new-tag"] });
    expect(r.success).toBe(true);
  });

  it("accepts undefined optional fields (no validation error)", () => {
    const r = projectUpdateSchema.safeParse({
      title: "Test",
      idea: undefined,
      mainResult: undefined,
      problem: undefined,
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid title if present", () => {
    const r = projectUpdateSchema.safeParse({ title: "" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid slug if present", () => {
    const r = projectUpdateSchema.safeParse({ slug: "Invalid Slug!" });
    expect(r.success).toBe(false);
  });
});

describe("defaults and helpers", () => {
  it("projectDefaultValues has all required keys", () => {
    const requiredKeys = [
      "slug", "title", "shortDescription", "fullDescription",
      "category", "categories", "image", "tags", "services",
      "detailedResults", "caseStudyMedia", "featured", "featuredOrder",
      "status", "displayOrder", "year", "seo", "gallery", "sections",
    ];
    for (const key of requiredKeys) {
      expect(projectDefaultValues).toHaveProperty(key);
    }
  });

  it("generateSlugFromTitle produces valid slug", () => {
    const slug = generateSlugFromTitle("My Awesome Project!");
    expect(slug).toBe("my-awesome-project");
  });

  it("generateSlugFromTitle handles arabic characters", () => {
    const slug = generateSlugFromTitle("مشروع تجريبي");
    expect(slug).toMatch(/^[a-z0-9-]*$/);
  });

  it("normalizeSlug handles multiple hyphens", () => {
    expect(normalizeSlug("a---b")).toBe("a-b");
  });

  it("normalizeSlug handles leading/trailing spaces", () => {
    expect(normalizeSlug("  hello world  ")).toBe("hello-world");
  });
});

describe("shared schemas", () => {
  it("stringSchema rejects empty string", () => {
    expect(stringSchema.safeParse("").success).toBe(false);
  });

  it("stringSchema accepts non-empty string", () => {
    expect(stringSchema.safeParse("hello").success).toBe(true);
  });

  it("stringSchema trims whitespace", () => {
    const r = stringSchema.safeParse("  hello  ");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe("hello");
  });

  it("stringSchema rejects whitespace-only", () => {
    expect(stringSchema.safeParse("   ").success).toBe(false);
  });

  it("safeUrlSchema accepts valid URL", () => {
    expect(safeUrlSchema.safeParse("https://example.com").success).toBe(true);
  });

  it("safeUrlSchema rejects javascript: URL", () => {
    expect(safeUrlSchema.safeParse("javascript:void(0)").success).toBe(false);
  });

  it("safeUrlSchema rejects data: URL", () => {
    expect(safeUrlSchema.safeParse("data:text/html,x").success).toBe(false);
  });

  it("safeUrlSchema accepts empty string (optional default)", () => {
    expect(safeUrlSchema.safeParse("").success).toBe(true);
  });

  it("safeUrlSchema accepts undefined", () => {
    expect(safeUrlSchema.safeParse(undefined).success).toBe(true);
  });

  it("seoSchema accepts valid object", () => {
    const r = seoSchema.safeParse({ title: "t", description: "d", keywords: ["k"] });
    expect(r.success).toBe(true);
  });

  it("seoSchema defaults keywords to empty array", () => {
    const r = seoSchema.safeParse({ title: "t" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.keywords).toEqual([]);
  });

  it("contentStatusSchema accepts draft", () => {
    expect(contentStatusSchema.safeParse("draft").success).toBe(true);
  });

  it("contentStatusSchema accepts published", () => {
    expect(contentStatusSchema.safeParse("published").success).toBe(true);
  });

  it("contentStatusSchema rejects other values", () => {
    expect(contentStatusSchema.safeParse("archived").success).toBe(false);
    expect(contentStatusSchema.safeParse("").success).toBe(false);
  });
});
