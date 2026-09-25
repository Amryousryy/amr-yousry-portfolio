import { describe, it, expect } from "vitest";
import Project from "@/models/Project";

describe("Project deployment metadata schema", () => {
  it("exposes a deployment subdocument path", () => {
    const path = Project.schema.path("deployment");
    expect(path).toBeDefined();
  });

  it("accepts every documented deployment state", () => {
    const doc = new Project({ slug: "test-deploy-slug", title: "Deploy Test" });
    for (const state of ["not_required", "pending", "deploying", "live", "failed"]) {
      doc.deployment = {
        state: state as
          | "not_required"
          | "pending"
          | "deploying"
          | "live"
          | "failed",
        deploymentId: "dpl_1",
        requestedAt: new Date(),
        completedAt: undefined,
        error: "",
      };
      expect(() => doc.validateSync()).not.toThrow();
    }
  });

  it("rejects an unknown deployment state", () => {
    const doc = new Project({ slug: "test-bad-state", title: "Bad State" });
    doc.deployment = { state: "exploded" as never };
    const err = doc.validateSync();
    expect(err).toBeDefined();
    expect(String(err).toLowerCase()).toContain("deployment");
  });

  it("defaults state to not_required when deployment sub-document is created empty", () => {
    const doc = new Project({ slug: "test-default-state", title: "Default" });
    doc.deployment = { state: undefined as never };
    const deployment = doc.deployment;
    expect(deployment).toBeDefined();
    expect(deployment!.state).toBe("not_required");
  });
});