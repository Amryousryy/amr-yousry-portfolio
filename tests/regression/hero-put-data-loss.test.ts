/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * REGRESSION TEST — Hero PUT data-loss bug
 *
 * The Hero form does not include posterImage / showreelVideo, so the PUT payload
 * omits them. The route previously validated with heroCreateSchema (defaults fill
 * them with "") and replaced the whole hero subdocument, silently wiping existing
 * posterImage / showreelVideo values on every save.
 *
 * The fix validates with heroUpdateSchema (partial update) and merges the update
 * into the current persisted hero, applying only the keys the client actually sent.
 * Fields omitted from the request are preserved.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSettings } = vi.hoisted(() => ({
  mockSettings: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Settings", () => ({ default: mockSettings }));

import { getServerSession } from "next-auth/next";
import { PUT } from "@/app/api/settings/hero/route";
import { heroUpdateSchema } from "@/lib/validation";

const mockSession = vi.mocked(getServerSession);

const BASE_HERO = {
  headline: "Creative Strategist & Video Editor",
  subheadline: "I turn content into clients for brands",
  primaryCTA: "View Projects",
  primaryCTALink: "/contact",
  secondaryCTA: "Contact Me",
  secondaryCTALink: "/contact",
  posterImage: "existing-poster.jpg",
  showreelVideo: "existing-showreel.mp4",
  status: "published",
};

function makeForm(): Record<string, unknown> {
  return {
    headline: "New headline",
    subheadline: "New subheadline",
    primaryCTA: "Start a Project",
    primaryCTALink: "/contact",
    secondaryCTA: "View Missions",
    secondaryCTALink: "/projects",
    status: "published",
  };
}

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/settings/hero", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mergedHeroWritten(): Record<string, unknown> {
  return mockSettings.findOneAndUpdate.mock.calls[0][1].$set.hero;
}

async function put(body: Record<string, unknown>): Promise<{ status: number; json: any }> {
  const res = await PUT(makeRequest(body));
  return { status: res.status, json: await res.json() };
}

describe("REGRESSION: Hero PUT preserves posterImage and showreelVideo", () => {
  beforeEach(() => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    mockSettings.findOne.mockReset();
    mockSettings.findOneAndUpdate.mockReset();
    mockSession.mockReset();
    mockSession.mockResolvedValue({ user: { email: "admin@test.com" } } as any);
    mockSettings.findOne.mockImplementation(() => ({
      lean: () => ({ hero: { ...BASE_HERO } }),
    }));
    mockSettings.findOneAndUpdate.mockImplementation((_filter: any, update: any) =>
      Promise.resolve({ hero: update.$set.hero })
    );
  });

  it("TEST 1: preserves posterImage when the update omits it", async () => {
    const { json } = await put(makeForm());
    const merged = mergedHeroWritten();
    expect(merged.posterImage).toBe("existing-poster.jpg");
    expect(json.data.posterImage).toBe("existing-poster.jpg");
  });

  it("TEST 2: preserves showreelVideo when the update omits it", async () => {
    const { json } = await put(makeForm());
    const merged = mergedHeroWritten();
    expect(merged.showreelVideo).toBe("existing-showreel.mp4");
    expect(json.data.showreelVideo).toBe("existing-showreel.mp4");
  });

  it("TEST 3: preserves BOTH posterImage and showreelVideo while persisting unrelated changes", async () => {
    const { json } = await put(makeForm());
    const merged = mergedHeroWritten();
    expect(merged.posterImage).toBe("existing-poster.jpg");
    expect(merged.showreelVideo).toBe("existing-showreel.mp4");
    expect(merged.headline).toBe("New headline");
    expect(json.data.headline).toBe("New headline");
    expect(json.data.posterImage).toBe("existing-poster.jpg");
    expect(json.data.showreelVideo).toBe("existing-showreel.mp4");
  });

  it("TEST 4a: persists an explicitly provided new posterImage", async () => {
    const { json } = await put({ ...makeForm(), posterImage: "new-poster.jpg" });
    const merged = mergedHeroWritten();
    expect(merged.posterImage).toBe("new-poster.jpg");
    expect(json.data.posterImage).toBe("new-poster.jpg");
  });

  it("TEST 4b: persists an explicitly provided new showreelVideo", async () => {
    const { json } = await put({ ...makeForm(), showreelVideo: "new-showreel.mp4" });
    const merged = mergedHeroWritten();
    expect(merged.showreelVideo).toBe("new-showreel.mp4");
    expect(json.data.showreelVideo).toBe("new-showreel.mp4");
  });

  it("TEST 5: persists an explicit empty string (clearing) for posterImage and showreelVideo", async () => {
    const { json } = await put({ ...makeForm(), posterImage: "", showreelVideo: "" });
    const merged = mergedHeroWritten();
    expect(merged.posterImage).toBe("");
    expect(merged.showreelVideo).toBe("");
    expect(json.data.posterImage).toBe("");
    expect(json.data.showreelVideo).toBe("");
  });

  it("applies only keys the client actually sent, not schema defaults", async () => {
    const parsed = heroUpdateSchema.safeParse(makeForm());
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.posterImage).toBe("");
    }
    await put(makeForm());
    const merged = mergedHeroWritten();
    expect(merged.posterImage).toBe("existing-poster.jpg");
    expect(merged.showreelVideo).toBe("existing-showreel.mp4");
  });

  it("TEST 6a: preserves other fields when only headline changes", async () => {
    await put({ headline: "Only headline changed" });
    const merged = mergedHeroWritten();
    expect(merged.headline).toBe("Only headline changed");
    expect(merged.subheadline).toBe(BASE_HERO.subheadline);
    expect(merged.primaryCTA).toBe(BASE_HERO.primaryCTA);
    expect(merged.primaryCTALink).toBe(BASE_HERO.primaryCTALink);
    expect(merged.secondaryCTA).toBe(BASE_HERO.secondaryCTA);
    expect(merged.secondaryCTALink).toBe(BASE_HERO.secondaryCTALink);
    expect(merged.status).toBe("published");
  });

  it("TEST 6b: publishes a draft hero and stamps publishedAt", async () => {
    mockSettings.findOne.mockImplementation(() => ({
      lean: () => ({ hero: { ...BASE_HERO, status: "draft" } }),
    }));
    await put({ ...makeForm(), status: "published" });
    const merged = mergedHeroWritten();
    expect(merged.status).toBe("published");
    expect(merged.publishedAt).toBeInstanceOf(Date);
    expect(merged.lastStatusChangeAt).toBeInstanceOf(Date);
  });

  it("TEST 6c: preserves publishedAt when the hero stays published", async () => {
    mockSettings.findOne.mockImplementation(() => ({
      lean: () => ({ hero: { ...BASE_HERO, publishedAt: new Date("2026-01-01") } }),
    }));
    await put(makeForm());
    const merged = mergedHeroWritten();
    expect(merged.status).toBe("published");
    expect(merged.publishedAt).toBeInstanceOf(Date);
    expect((merged.publishedAt as Date).getTime()).toBe(new Date("2026-01-01").getTime());
  });

  it("TEST 6d: still rejects invalid field values", async () => {
    const { status } = await put({ headline: "" });
    expect(status).toBe(400);
  });

  it("TEST 6e: preserves the response shape", async () => {
    const { status, json } = await put(makeForm());
    expect(status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.headline).toBe("New headline");
    expect(json.data.status).toBe("published");
  });
});
