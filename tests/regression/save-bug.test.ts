/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * REGRESSION TEST — Save Bug Fix
 *
 * This file specifically tests the exact scenario that caused the infinite
 * loading bug: optional string fields (idea, mainResult, problem, etc.)
 * sending empty strings "" that failed stringSchema.optional().min(1).
 *
 * Two root causes were fixed:
 * 1. @hookform/resolvers Zod 4 incompatibility (error.errors vs error.issues)
 * 2. getString(undefined) returning "" which failed stringSchema.min(1)
 *
 * These tests ensure the fix holds permanently.
 */

import { describe, it, expect } from "vitest";
import { projectUpdateSchema } from "@/lib/validation";
import { stringSchema } from "@/lib/validation/shared";

// ─── The exact bug: stringSchema.optional() with empty string ───

describe("REGRESSION: stringSchema.optional() + empty string", () => {
  it("stringSchema rejects empty string", () => {
    expect(stringSchema.safeParse("").success).toBe(false);
  });

  it("stringSchema.optional() rejects empty string (NOT undefined)", () => {
    // This was the root cause: "" is not undefined, so optional() doesn't help.
    // The min(1) on stringSchema still runs.
    const schema = stringSchema.optional();
    expect(schema.safeParse("").success).toBe(false);
  });

  it("stringSchema.optional() accepts undefined", () => {
    const schema = stringSchema.optional();
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("stringSchema.optional() accepts valid string", () => {
    expect(stringSchema.safeParse("hello").success).toBe(true);
  });
});

// ─── The fix: onSubmit cleans empty strings → undefined ───

describe("REGRESSION: onSubmit empty string cleanup", () => {
  const OPTIONAL_FIELDS = [
    "problem", "strategy", "solution", "execution",
    "results", "idea", "mainResult", "client",
  ];

  function cleanOptionalStrings(data: Record<string, unknown>) {
    for (const field of OPTIONAL_FIELDS) {
      if (data[field] === "") {
        data[field] = undefined;
      }
    }
    return data;
  }

  for (const field of OPTIONAL_FIELDS) {
    it(`cleans empty ${field} to undefined`, () => {
      const data = { [field]: "" };
      const cleaned = cleanOptionalStrings(data);
      expect(cleaned[field]).toBeUndefined();
    });

    it(`preserves valid ${field}`, () => {
      const data = { [field]: "Some content" };
      const cleaned = cleanOptionalStrings(data);
      expect(cleaned[field]).toBe("Some content");
    });

    it(`preserves undefined ${field}`, () => {
      const data = { [field]: undefined };
      const cleaned = cleanOptionalStrings(data);
      expect(cleaned[field]).toBeUndefined();
    });
  }

  it("full payload passes validation after cleanup", () => {
    const data: Record<string, unknown> = {
      title: "Test",
      slug: "test",
      image: "https://example.com/img.png",
      idea: "",
      mainResult: "",
      problem: "",
      strategy: "",
      solution: "",
      execution: "",
      results: "",
      client: "",
      video: "",
    };
    const cleaned = cleanOptionalStrings(data);
    // After cleanup, optional fields are undefined → passes validation
    const result = projectUpdateSchema.safeParse(cleaned);
    expect(result.success).toBe(true);
  });

  it("BUG SCENARIO: getString(undefined) → '' → cleanup → undefined → validates", () => {
    // Simulate getString from ProjectEditor
    function getString(val: string | { en: string; ar: string } | undefined): string {
      if (!val) return "";
      if (typeof val === "string") return val;
      return val.en || "";
    }

    // Simulate API project with no idea/mainResult
    const apiProject = { idea: undefined, mainResult: undefined };

    // Form fills with "" via getString
    const formData = {
      idea: getString(apiProject.idea),
      mainResult: getString(apiProject.mainResult),
    };
    expect(formData.idea).toBe("");
    expect(formData.mainResult).toBe("");

    // onSubmit cleans them
    const cleaned = cleanOptionalStrings({ ...formData, title: "T", slug: "t", image: "" });
    expect(cleaned.idea).toBeUndefined();
    expect(cleaned.mainResult).toBeUndefined();

    // Validation passes
    const result = projectUpdateSchema.safeParse(cleaned);
    expect(result.success).toBe(true);
  });
});

// ─── The resolver fix: standardSchemaResolver ───

describe("REGRESSION: standardSchemaResolver compatibility", () => {
  it("Zod 4 errors use .issues, not .errors", () => {
    const schema = projectUpdateSchema;
    const result = schema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Zod 4: error has .issues (array of ZodIssue)
      expect(Array.isArray(result.error.issues)).toBe(true);
      // Zod 4: error does NOT have .errors (that was Zod 3)
      expect((result.error as any).errors).toBeUndefined();
    }
  });

  it("standardSchemaResolver uses ~standard.validate (Standard Schema spec)", () => {
    const schema = projectUpdateSchema;
    // Zod 4 schemas implement the Standard Schema spec
    expect(typeof (schema as any)["~standard"]).toBe("object");
    expect(typeof (schema as any)["~standard"].validate).toBe("function");
  });

  it("standardSchema returns issues on validation failure", () => {
    const schema = projectUpdateSchema;
    const result = (schema as any)["~standard"].validate({ title: "" });
    // Standard Schema returns { issues: [...] } on failure
    expect(result.issues).toBeDefined();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("standardSchema returns value on validation success", () => {
    const schema = projectUpdateSchema;
    const result = (schema as any)["~standard"].validate({ title: "Test", slug: "test" });
    expect(result.issues).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value.title).toBe("Test");
  });
});

// ─── Edge cases: what if someone re-introduces the bug ───

describe("REGRESSION: edge cases that must not break", () => {
  it("all optional fields undefined → valid", () => {
    const r = projectUpdateSchema.safeParse({
      title: "Test",
      idea: undefined,
      mainResult: undefined,
      problem: undefined,
      strategy: undefined,
      solution: undefined,
      execution: undefined,
      results: undefined,
      client: undefined,
    });
    expect(r.success).toBe(true);
  });

  it("all optional fields with values → valid", () => {
    const r = projectUpdateSchema.safeParse({
      title: "Test",
      idea: "Big idea",
      mainResult: "Main result",
      problem: "Problem statement",
      strategy: "Strategy",
      solution: "Solution",
      execution: "Execution",
      results: "Results",
      client: "Client",
    });
    expect(r.success).toBe(true);
  });

  it("empty object → valid (partial update)", () => {
    const r = projectUpdateSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it("only tags → valid", () => {
    const r = projectUpdateSchema.safeParse({ tags: ["a", "b"] });
    expect(r.success).toBe(true);
  });

  it("only categories → valid", () => {
    const r = projectUpdateSchema.safeParse({ categories: ["Cat1"] });
    expect(r.success).toBe(true);
  });

  it("only SEO → valid", () => {
    const r = projectUpdateSchema.safeParse({
      seo: { title: "SEO", description: "Desc", keywords: ["k"] },
    });
    expect(r.success).toBe(true);
  });

  it("only detailedResults → valid", () => {
    const r = projectUpdateSchema.safeParse({
      detailedResults: [{ label: "L", value: "V" }],
    });
    expect(r.success).toBe(true);
  });

  it("only gallery → valid", () => {
    const r = projectUpdateSchema.safeParse({
      gallery: ["https://example.com/img.png"],
    });
    expect(r.success).toBe(true);
  });

  it("empty gallery → valid", () => {
    const r = projectUpdateSchema.safeParse({ gallery: [] });
    expect(r.success).toBe(true);
  });

  it("image replacement (new URL over old)", () => {
    const r = projectUpdateSchema.safeParse({
      image: "https://res.cloudinary.com/new-image.png",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.image).toBe("https://res.cloudinary.com/new-image.png");
    }
  });

  it("image removal (empty string)", () => {
    const r = projectUpdateSchema.safeParse({ image: "" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.image).toBe("");
    }
  });
});
