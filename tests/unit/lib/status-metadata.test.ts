import { describe, it, expect } from "vitest";
import { resolveStatusMetadata } from "@/lib/status-metadata";

describe("resolveStatusMetadata", () => {
  it("always stamps lastStatusChangeAt", () => {
    const meta = resolveStatusMetadata("draft", "draft");
    expect(meta.lastStatusChangeAt).toBeInstanceOf(Date);
  });

  it("stamps publishedAt when transitioning into published", () => {
    const meta = resolveStatusMetadata("published", "draft");
    expect(meta.publishedAt).toBeInstanceOf(Date);
    expect(Object.keys(meta).sort()).toEqual(["lastStatusChangeAt", "publishedAt"]);
  });

  it("does not stamp publishedAt when already published", () => {
    const meta = resolveStatusMetadata("published", "published");
    expect(meta.publishedAt).toBeUndefined();
    expect(Object.keys(meta)).toEqual(["lastStatusChangeAt"]);
  });

  it("does not stamp publishedAt when unpublishing", () => {
    const meta = resolveStatusMetadata("draft", "published");
    expect(meta.publishedAt).toBeUndefined();
    expect(meta.lastStatusChangeAt).toBeInstanceOf(Date);
  });

  it("does not stamp publishedAt when staying draft", () => {
    const meta = resolveStatusMetadata("draft", "draft");
    expect(meta.publishedAt).toBeUndefined();
  });

  it("stamps publishedAt for a new record created as published", () => {
    const meta = resolveStatusMetadata("published", "");
    expect(meta.publishedAt).toBeInstanceOf(Date);
  });

  it("does not stamp publishedAt for a new record created as draft", () => {
    const meta = resolveStatusMetadata("draft", "");
    expect(meta.publishedAt).toBeUndefined();
  });

  it("never clears or touches an existing publishedAt", () => {
    const meta = resolveStatusMetadata("published", "published");
    expect("publishedAt" in meta).toBe(false);
  });
});
