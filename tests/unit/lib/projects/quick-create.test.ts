import { describe, it, expect } from "vitest";
import { buildQuickProjectShell, quickCreateIntent } from "@/lib/projects/quick-create";

describe("buildQuickProjectShell", () => {
  it("generates and normalizes a slug from the title when none is given", () => {
    const shell = buildQuickProjectShell({ title: "  ICCE 2026 Event Coverage  " });
    expect(shell.slug).toBe("icce-2026-event-coverage");
  });

  it("prefers an explicit slug over the generated one", () => {
    const shell = buildQuickProjectShell({ title: "ICCE 2026", slug: "custom-slug" });
    expect(shell.slug).toBe("custom-slug");
  });

  it("normalizes a messy explicit slug (non-word chars stripped, hyphens collapsed)", () => {
    const shell = buildQuickProjectShell({ title: "x", slug: "  My  Project -- Slug! " });
    expect(shell.slug).toBe("my-project-slug");
  });

  it("creates a draft shell by default", () => {
    const shell = buildQuickProjectShell({ title: "T" });
    expect(shell.status).toBe("draft");
  });

  it("honors a published status (API will still enforce readiness)", () => {
    const shell = buildQuickProjectShell({ title: "T", status: "published" });
    expect(shell.status).toBe("published");
  });

  it("carries the identifying fields through and trims them", () => {
    const shell = buildQuickProjectShell({
      title: "T",
      slug: "t",
      clientName: "  Acme  ",
      category: "  Brand Film ",
      year: "2026",
    });
    expect(shell.clientName).toBe("Acme");
    expect(shell.category).toBe("Brand Film");
    expect(shell.year).toBe("2026");
    expect(shell.displayOrder).toBe(0);
    expect(shell.featured).toBe(false);
    expect(shell.image).toBe("");
  });

  it("defaults the year to the current year and never passes an empty title/slug", () => {
    const shell = buildQuickProjectShell({ title: " ", slug: " " });
    expect(shell.slug).not.toBe("");
    expect(shell.year).toBe(String(new Date().getFullYear()));
  });
});

describe("quickCreateIntent", () => {
  it("maps status to save intent for the API contract", () => {
    expect(quickCreateIntent("draft")).toBe("save-draft");
    expect(quickCreateIntent("published")).toBe("publish");
  });
});