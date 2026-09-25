import { describe, it, expect } from "vitest";
import {
  DEPLOYMENT_POLL_INTERVAL_MS,
  DEPLOYMENT_STATE_LABELS,
  deploymentStateLabel,
  isDeploymentBlockingLive,
  shouldPollDeployment,
} from "@/lib/projects/deployment-status";

describe("deployment-status pure helpers", () => {
  it("maps every deployment state to a human label", () => {
    expect(DEPLOYMENT_STATE_LABELS).toEqual({
      not_required: "No Deployment Required",
      pending: "Deployment Pending",
      deploying: "Deploying",
      live: "Live",
      failed: "Deployment Failed",
    });
  });

  it("resolves state labels", () => {
    expect(deploymentStateLabel("not_required")).toBe("No Deployment Required");
    expect(deploymentStateLabel("pending")).toBe("Deployment Pending");
    expect(deploymentStateLabel("deploying")).toBe("Deploying");
    expect(deploymentStateLabel("live")).toBe("Live");
    expect(deploymentStateLabel("failed")).toBe("Deployment Failed");
    expect(deploymentStateLabel(undefined)).toBe("Deployment Status");
    expect(deploymentStateLabel(null)).toBe("Deployment Status");
  });

  it("polls only while pending or deploying", () => {
    expect(shouldPollDeployment("pending")).toBe(true);
    expect(shouldPollDeployment("deploying")).toBe(true);
    expect(shouldPollDeployment("live")).toBe(false);
    expect(shouldPollDeployment("failed")).toBe(false);
    expect(shouldPollDeployment("not_required")).toBe(false);
    expect(shouldPollDeployment(undefined)).toBe(false);
    expect(shouldPollDeployment(null)).toBe(false);
  });

  it("blocks claiming live only while deployment is in flight or failed", () => {
    expect(isDeploymentBlockingLive("pending")).toBe(true);
    expect(isDeploymentBlockingLive("deploying")).toBe(true);
    expect(isDeploymentBlockingLive("failed")).toBe(true);
    expect(isDeploymentBlockingLive("live")).toBe(false);
    expect(isDeploymentBlockingLive("not_required")).toBe(false);
    expect(isDeploymentBlockingLive(undefined)).toBe(false);
    expect(isDeploymentBlockingLive(null)).toBe(false);
  });

  it("uses a sane polling interval between 2 and 5 seconds", () => {
    expect(DEPLOYMENT_POLL_INTERVAL_MS).toBeGreaterThanOrEqual(2000);
    expect(DEPLOYMENT_POLL_INTERVAL_MS).toBeLessThanOrEqual(5000);
  });
});