import { describe, it, expect, vi } from "vitest";
import React, { act } from "react";
import TestRenderer, { type ReactTestInstance } from "react-test-renderer";
import { useForm } from "react-hook-form";
import ProjectStatusFields from "@/components/admin/ProjectStatusFields";
import { projectDefaultValues } from "@/lib/validation";

vi.mock("next/link", async () => {
  const ReactModule = await import("react");
  return {
    __esModule: true,
    default: (props: { href: string; children?: React.ReactNode; className?: string }) =>
      ReactModule.createElement("a", {
        href: props.href,
        className: props.className,
      }, props.children),
  };
});

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

function Harness({ featured, status }: { featured: boolean; status: string }) {
  const { register } = useForm({
    defaultValues: { ...projectDefaultValues, featured, status },
  });
  return <ProjectStatusFields register={register as never} featured={featured} status={status} />;
}

describe("ProjectStatusFields — publishing & homepage controls", () => {
  it("exports a valid component", () => {
    expect(typeof ProjectStatusFields).toBe("function");
  });

  it("offers a simple homepage visibility toggle", () => {
    const root = renderElement(<Harness featured={false} status="draft" />).root;
    const checkbox = root.findByProps({ name: "featured" });
    expect(checkbox.props.type).toBe("checkbox");
    expect(json(<Harness featured={false} status="draft" />)).toContain("Show on homepage");
  });

  it("removes ALL manual order number inputs (order lives on the Homepage screen)", () => {
    const rendered = json(<Harness featured={false} status="draft" />);
    expect(rendered).not.toContain("Featured Order");
    expect(rendered).not.toContain("Display Order");
    expect(rendered).not.toContain('"type":"number"');
  });

  it("links to the homepage curation screen", () => {
    expect(json(<Harness featured={false} status="draft" />)).toContain("Manage homepage");
  });

  it("warns that a featured draft stays hidden until published", () => {
    const rendered = json(<Harness featured={true} status="draft" />);
    expect(rendered).toContain("will not appear on the homepage until published");
  });
});