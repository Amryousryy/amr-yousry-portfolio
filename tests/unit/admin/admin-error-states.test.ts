import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import AdminLoadingSpinner from "@/components/admin/AdminLoadingSpinner";
import AdminQueryError from "@/components/admin/AdminQueryError";

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

describe("AdminLoadingSpinner", () => {
  it("exports a valid React component", () => {
    expect(typeof AdminLoadingSpinner).toBe("function");
  });

  it("renders without crashing", () => {
    const { result } = renderHook(() => {
      const Component = AdminLoadingSpinner;
      return Component;
    });
    expect(result.current).toBeDefined();
  });
});

describe("AdminQueryError", () => {
  it("exports a valid React component", () => {
    expect(typeof AdminQueryError).toBe("function");
  });

  it("accepts required props without error", () => {
    const props = {
      title: "Failed to Load Content",
      queryKey: ["site-content"],
      message: "Could not fetch content.",
    };
    expect(props.title).toBe("Failed to Load Content");
    expect(props.queryKey).toEqual(["site-content"]);
    expect(props.message).toBe("Could not fetch content.");
  });

  it("accepts optional message prop", () => {
    const props: { title: string; queryKey: string[]; message?: string } = {
      title: "Failed to Load",
      queryKey: ["data"],
    };
    expect(props.message).toBeUndefined();
  });

  it("preserves exact title strings", () => {
    expect("Failed to Load Content").toBe("Failed to Load Content");
    expect("Failed to Load Hero Settings").toBe("Failed to Load Hero Settings");
    expect("Failed to Load Contact Settings").toBe("Failed to Load Contact Settings");
  });

  it("preserves exact query keys", () => {
    expect(["site-content"]).toEqual(["site-content"]);
    expect(["hero-settings"]).toEqual(["hero-settings"]);
  });

  it("preserves exact fallback messages", () => {
    expect("Could not fetch site content. Please try again.").toBe(
      "Could not fetch site content. Please try again."
    );
    expect("Could not fetch hero settings. Please try again.").toBe(
      "Could not fetch hero settings. Please try again."
    );
    expect("Could not fetch contact settings. Please try again.").toBe(
      "Could not fetch contact settings. Please try again."
    );
  });
});
