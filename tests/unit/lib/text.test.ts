import { describe, it, expect } from "vitest";
import { getString } from "@/lib/text";

type Bilingual = { en: string; ar: string };

describe("getString", () => {
  it("returns an empty string for undefined", () => {
    expect(getString(undefined)).toBe("");
  });

  it("returns an empty string for null", () => {
    expect(getString(null as unknown as string | Bilingual | undefined)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(getString("")).toBe("");
  });

  it("returns plain strings unchanged", () => {
    expect(getString("hello")).toBe("hello");
  });

  it("returns the English value of a bilingual object", () => {
    expect(getString({ en: "Hello", ar: "مرحبا" })).toBe("Hello");
  });

  it("does NOT fall back to Arabic when English is missing", () => {
    expect(getString({ en: "", ar: "مرحبا" })).toBe("");
  });

  it("returns an empty string when English is undefined in a bilingual object", () => {
    expect(getString({ en: undefined, ar: "مرحبا" } as unknown as Bilingual)).toBe("");
  });

  it("returns an empty string for an object without English", () => {
    expect(getString({ ar: "مرحبا" } as unknown as Bilingual)).toBe("");
  });

  it("returns an empty string for an empty object", () => {
    expect(getString({} as Bilingual)).toBe("");
  });

  it("returns an empty string for falsy non-string values", () => {
    expect(getString(0 as unknown as string | Bilingual | undefined)).toBe("");
  });
});
