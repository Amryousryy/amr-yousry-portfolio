import { describe, it, expect } from "vitest";
import React, { act } from "react";
import TestRenderer, { type ReactTestInstance } from "react-test-renderer";
import DeploymentStatusInline from "@/components/admin/DeploymentStatusInline";

function renderElement(jsx: React.ReactElement) {
  let renderer: ReactTestInstance;
  act(() => {
    renderer = TestRenderer.create(jsx);
  });
  return renderer!;
}

function json(jsx: React.ReactElement) {
  return JSON.stringify(renderElement(jsx).toJSON());
}

describe("DeploymentStatusInline (editor action bar)", () => {
  it("exposes the deployment state in an accessible live region", () => {
    const root = renderElement(<DeploymentStatusInline state="deploying" />).root;
    const region = root.findByProps({ role: "status" });
    expect(region.props["aria-live"]).toBe("polite");
    expect(region.props["aria-label"]).toBe("Deployment status: Deploying");
  });

  it("shows the human label, not internal terminology", () => {
    expect(json(<DeploymentStatusInline state="pending" />)).toContain("Deployment Pending");
    expect(json(<DeploymentStatusInline state="deploying" />)).toContain("Deploying");
    expect(json(<DeploymentStatusInline state="live" />)).toContain("Live");
    expect(json(<DeploymentStatusInline state="not_required" />)).toContain("No Deployment Required");
  });

  it("never claims Live unless the state is live", () => {
    for (const state of ["pending", "deploying", "failed", "not_required"] as const) {
      expect(json(<DeploymentStatusInline state={state} />)).not.toContain("Live");
    }
  });

  it("renders a retry action only for failed deployments", () => {
    const failed = renderElement(
      <DeploymentStatusInline state="failed" onRetry={() => {}} />
    ).root;
    expect(failed.findByProps({ "aria-label": "Retry deployment" })).toBeDefined();

    for (const state of ["live", "deploying", "pending", "not_required"] as const) {
      const rendered = renderElement(
        <DeploymentStatusInline state={state} onRetry={() => {}} />
      ).root;
      expect(rendered.findAllByProps({ "aria-label": "Retry deployment" })).toHaveLength(0);
    }
  });

  it("disables and marks the retry button as busy while a retry is in flight", () => {
    const root = renderElement(
      <DeploymentStatusInline state="failed" onRetry={() => {}} isRetrying />
    ).root;
    const button = root.findByProps({ "aria-label": "Retry deployment" });
    expect(button.props.disabled).toBe(true);
    expect(button.props["aria-busy"]).toBe(true);
  });

  it("prevents duplicate retries by disabling the button while pending", () => {
    const root = renderElement(
      <DeploymentStatusInline state="failed" onRetry={() => {}} isRetrying={false} />
    ).root;
    expect(root.findByProps({ "aria-label": "Retry deployment" }).props.disabled).toBe(false);
  });

  it("surfaces the safe diagnostic text only for failed deployments", () => {
    const rendered = json(
      <DeploymentStatusInline
        state="failed"
        error="Project must be published before retrying deployment"
        onRetry={() => {}}
      />
    );
    expect(rendered).toContain("Project must be published before retrying deployment");

    for (const state of ["live", "deploying", "pending", "not_required"] as const) {
      const renderedOther = json(
        <DeploymentStatusInline state={state} error="should not surface" onRetry={() => {}} />
      );
      expect(renderedOther).not.toContain("should not surface");
    }
  });

  it("does not expose attempt ids or build-hook urls in the DOM", () => {
    const rendered = json(
      <DeploymentStatusInline
        state="failed"
        error="Something went wrong"
        onRetry={() => {}}
      />
    );
    expect(rendered).not.toMatch(/deployHookId|attemptId|v1\/integrations\/deploy|VERCEL_API/i);
  });

  it("renders nothing when state is unknown", () => {
    expect(renderElement(<DeploymentStatusInline />).toJSON()).toBeNull();
  });
});