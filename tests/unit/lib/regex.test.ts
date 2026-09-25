import { describe, it, expect } from "vitest";
import { escapeRegExp } from "@/lib/regex";

describe("escapeRegExp", () => {
  it("leaves a normal alphanumeric search untouched", () => {
    expect(escapeRegExp("brand 2026 campaign")).toBe("brand 2026 campaign");
  });

  it("escapes every regex meta-character so input matches literally", () => {
    expect(escapeRegExp("a.b")).toBe("a\\.b");
    expect(escapeRegExp("a+b")).toBe("a\\+b");
    expect(escapeRegExp("a?b")).toBe("a\\?b");
    expect(escapeRegExp("a*b")).toBe("a\\*b");
    expect(escapeRegExp("(group)")).toBe("\\(group\\)");
    expect(escapeRegExp("[char]")).toBe("\\[char\\]");
    expect(escapeRegExp("{1,2}")).toBe("\\{1,2\\}");
    expect(escapeRegExp("a|b")).toBe("a\\|b");
    expect(escapeRegExp("a^b$c")).toBe("a\\^b\\$c");
    expect(escapeRegExp("a\\b")).toBe("a\\\\b");
    expect(escapeRegExp("/")).toBe("/");
  });

  it("turns injection payloads into harmless literal patterns", () => {
    expect(escapeRegExp(".*")).toBe("\\.\\*");
    expect(escapeRegExp("^$")).toBe("\\^\\$");
    // lookahead becomes a literal string, not a regex construct
    expect(escapeRegExp("(?=a)")).toBe("\\(\\?=a\\)");
    expect(() => new RegExp(escapeRegExp("("))).not.toThrow(); // would throw unescaped
  });

  it("neutralizes catastrophic backtracking patterns", () => {
    const payload = "(a+)+$";
    const escaped = escapeRegExp(payload);
    expect(escaped).toBe("\\(a\\+\\)\\+\\$");
    // Must compile without error and match only the literal text
    const re = new RegExp(escaped);
    expect(re.test(payload)).toBe(true);
    expect(re.test("(a+)+$")).toBe(true);
    expect(re.test("aaa")).toBe(false); // literal-only, no backtracking amplification
  });

  it("handles empty string and unicode safely", () => {
    expect(escapeRegExp("")).toBe("");
    expect(new RegExp(escapeRegExp(""))).toBeDefined();
    const unicode = "ماجدة مشروع";
    expect(escapeRegExp(unicode)).toBe(unicode);
    const re = new RegExp(escapeRegExp(unicode), "i");
    expect(re.test("ماجدة مشروع")).toBe(true);
    expect(re.test("مشروع")).toBe(false); // full phrase is the literal pattern
  });

  it("escaped patterns match literally inside case-insensitive multi-char strings", () => {
    const re = new RegExp(escapeRegExp("retro-arcade"), "i");
    expect(re.test("Retro-Arcade")).toBe(true);
    expect(re.test("retroarcade")).toBe(false); // hyphen is literal, not optional
  });
});
