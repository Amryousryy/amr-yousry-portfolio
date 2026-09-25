import { describe, it, expect } from "vitest";
import { resolveSaveStatus, shouldRunReadinessCheck } from "@/lib/projects/save-intent";

describe("resolveSaveStatus", () => {
  it("force status to draft for the save-draft intent", () => {
    expect(resolveSaveStatus("draft", "save-draft")).toBe("draft");
    expect(resolveSaveStatus("published", "save-draft")).toBe("draft");
  });

  it("forces status to published for the publish intent", () => {
    expect(resolveSaveStatus("draft", "publish")).toBe("published");
    expect(resolveSaveStatus("published", "publish")).toBe("published");
  });

  it("keeps the current status for save-changes (published content stays published)", () => {
    expect(resolveSaveStatus("published", "save-changes")).toBe("published");
  });

  it("a draft form can never publish through the save-changes intent", () => {
    // save-changes is only offered for already-published projects; if it were
    // somehow triggered on a draft it must NOT promote it.
    expect(resolveSaveStatus("draft", "save-changes")).toBe("draft");
  });
});

describe("shouldRunReadinessCheck", () => {
  it("runs the strict readiness gate only for the explicit publish action", () => {
    expect(shouldRunReadinessCheck("publish")).toBe(true);
  });

  it("never gates saving a draft or saving changes on a published project", () => {
    expect(shouldRunReadinessCheck("save-draft")).toBe(false);
    expect(shouldRunReadinessCheck("save-changes")).toBe(false);
  });
});