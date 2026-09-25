import { describe, it, expect } from "vitest";
import React, { act } from "react";
import TestRenderer, { type ReactTestInstance } from "react-test-renderer";
import DeploymentStatusBadge, {
  DeploymentStatusCell,
} from "@/components/admin/DeploymentStatusBadge";

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

describe("DeploymentStatusBadge", () => {
  it("renders a human label for every deployment state", () => {
    expect(json(<DeploymentStatusBadge state="not_required" />)).toContain("No Deployment Required");
    expect(json(<DeploymentStatusBadge state="pending" />)).toContain("Deployment Pending");
    expect(json(<DeploymentStatusBadge state="deploying" />)).toContain("Deploying");
    expect(json(<DeploymentStatusBadge state="live" />)).toContain("Live");
    expect(json(<DeploymentStatusBadge state="failed" />)).toContain("Deployment Failed");
  });

  it("never claims Live unless the state is live", () => {
    const labels = ["not_required", "pending", "deploying", "failed"] as const;
    for (const state of labels) {
      const rendered = json(<DeploymentStatusBadge state={state} />);
      const label = deployedLabel(state);
      expect(rendered).toContain(label);
      expect(rendered).not.toContain("Live");
    }
  });

  it("exposes an accessible label that mirrors the visible text", () => {
    const node = renderElement(<DeploymentStatusBadge state="live" />).root.find(
      (el) => el.props["aria-label"] === "Deployment status: Live"
    );
    expect(node.props.title).toBe("Live");
  });

  it("renders nothing when state is unknown", () => {
    expect(renderElement(<DeploymentStatusBadge />).toJSON()).toBeNull();
    expect(renderElement(<DeploymentStatusBadge state={null} />).toJSON()).toBeNull();
  });
});

describe("DeploymentStatusCell (admin list)", () => {
  it("shows a dash for drafts even when a deployment subdocument says Live", () => {
    const rendered = json(
      <DeploymentStatusCell status="draft" deployment={{ state: "live" }} />
    );
    expect(rendered).toContain("—");
    expect(rendered).not.toContain("Live");
  });

  it("shows a dash for published rows with no deployment record", () => {
    const rendered = json(<DeploymentStatusCell status="published" deployment={undefined} />);
    expect(rendered).toContain("—");
  });

  it("shows Live only for a live published deployment", () => {
    expect(json(<DeploymentStatusCell status="published" deployment={{ state: "live" }} />)).toContain(
      "Live"
    );
  });

  it("shows Deploying (never Live) while a published deployment is in flight", () => {
    for (const state of ["pending", "deploying"] as const) {
      const rendered = json(<DeploymentStatusCell status="published" deployment={{ state }} />);
      expect(rendered).toContain(deployedLabel(state));
      expect(rendered).not.toContain("Live");
    }
  });

  it("shows Deployment Failed for a failed published deployment", () => {
    expect(
      json(<DeploymentStatusCell status="published" deployment={{ state: "failed" }} />)
    ).toContain("Deployment Failed");
  });
});

function deployedLabel(state: "not_required" | "pending" | "deploying" | "live" | "failed"): string {
  switch (state) {
    case "not_required":
      return "No Deployment Required";
    case "pending":
      return "Deployment Pending";
    case "deploying":
      return "Deploying";
    case "live":
      return "Live";
    case "failed":
      return "Deployment Failed";
  }
}