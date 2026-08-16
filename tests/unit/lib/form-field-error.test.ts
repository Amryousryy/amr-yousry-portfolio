import { describe, it, expect } from "vitest";
import { getFieldError } from "@/lib/form-field-error";

describe("getFieldError", () => {
  it("returns the message for an existing field error", () => {
    expect(
      getFieldError({ title: { message: "Required", type: "too_small" } }, "title")
    ).toBe("Required");
  });

  it("returns undefined for a missing field", () => {
    expect(getFieldError({}, "title")).toBeUndefined();
  });

  it("returns undefined when the errors object is undefined", () => {
    expect(
      getFieldError(undefined as unknown as Record<string, unknown>, "title")
    ).toBeUndefined();
  });

  it("extracts the message from nested fields", () => {
    expect(
      getFieldError(
        { socialLinks: { instagram: { message: "Invalid URL" } } },
        "socialLinks.instagram"
      )
    ).toBe("Invalid URL");
  });

  it("returns undefined when a nested segment is missing", () => {
    expect(getFieldError({ socialLinks: {} }, "socialLinks.instagram")).toBeUndefined();
  });

  it("returns undefined when a field error has no message", () => {
    expect(getFieldError({ title: { type: "required" } }, "title")).toBeUndefined();
  });

  it("returns undefined for deeply missing nested paths", () => {
    expect(
      getFieldError({ socialLinks: { instagram: {} } }, "socialLinks.instagram.foo")
    ).toBeUndefined();
  });
});
