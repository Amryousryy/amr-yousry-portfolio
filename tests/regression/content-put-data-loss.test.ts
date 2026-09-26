/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * REGRESSION TEST — Content PUT data-loss bug
 *
 * The Content PUT previously built a hand-maintained whitelist `merged` object
 * that omitted `servicesSubtitle` and then persisted `$set: { siteContent:
 * merged }`, replacing the whole subdocument. Every successful save silently
 * dropped the stored `servicesSubtitle` and GET fell back to the default.
 *
 * The fix seeds the merged object from the currently persisted `siteContent`
 * and applies only the route's accepted request fields on top, so omitted
 * fields (including `servicesSubtitle`) are preserved.
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
import { PUT } from "@/app/api/settings/content/route";

const mockSession = vi.mocked(getServerSession);

const BASE_CONTENT = {
  about: "v1",
  aboutTitle: "About v1",
  servicesTitle: "What I Deliver",
  servicesSubtitle: "existing",
  servicesDescription: "Services description",
  contactEmail: "admin@test.com",
  whatsappNumber: "",
  contactHeading: "Let's talk",
  contactSubheading: "",
  contactAvailability: "",
  socialLinks: {
    instagram: "https://instagram.com/amr",
    twitter: "",
    youtube: "",
    linkedin: "https://linkedin.com/in/amr",
  },
  servicesCards: [{ title: "Video Editing", description: "d", icon: "play" }],
  status: "published",
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
};

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/settings/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mergedSiteContentWritten(): Record<string, unknown> {
  return mockSettings.findOneAndUpdate.mock.calls[0][1].$set.siteContent;
}

async function put(body: Record<string, unknown>): Promise<{ status: number; json: any }> {
  const res = await PUT(makeRequest(body));
  return { status: res.status, json: await res.json() };
}

describe("REGRESSION: Content PUT preserves servicesSubtitle and existing fields", () => {
  beforeEach(() => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    mockSettings.findOne.mockReset();
    mockSettings.findOneAndUpdate.mockReset();
    mockSession.mockReset();
    mockSession.mockResolvedValue({ user: { email: "admin@test.com" } } as any);
    mockSettings.findOne.mockImplementation(() => ({
      lean: () => ({ siteContent: { ...BASE_CONTENT } }),
    }));
    mockSettings.findOneAndUpdate.mockImplementation((_filter: any, update: any) =>
      Promise.resolve({ siteContent: update.$set.siteContent })
    );
  });

  it("TEST 1: preserves omitted existing servicesSubtitle when another field changes", async () => {
    const { status, json } = await put({ about: "v2" });
    expect(status).toBe(200);
    const merged = mergedSiteContentWritten();
    expect(merged.servicesSubtitle).toBe("existing");
    expect(merged.about).toBe("v2");
    expect(json.data.servicesSubtitle).toBe("existing");
    expect(json.data.about).toBe("v2");
  });

  it("TEST 2: persists an explicitly provided new servicesSubtitle", async () => {
    const { status, json } = await put({ servicesSubtitle: "new" });
    expect(status).toBe(200);
    const merged = mergedSiteContentWritten();
    expect(merged.servicesSubtitle).toBe("new");
    expect(json.data.servicesSubtitle).toBe("new");
  });

  it("TEST 3: preserves multiple unrelated existing fields alongside an update", async () => {
    const { json } = await put({ about: "v2" });
    const merged = mergedSiteContentWritten();
    expect(merged.servicesSubtitle).toBe("existing");
    expect(merged.servicesDescription).toBe(BASE_CONTENT.servicesDescription);
    expect(merged.contactEmail).toBe(BASE_CONTENT.contactEmail);
    expect(merged.contactHeading).toBe(BASE_CONTENT.contactHeading);
    expect((merged.socialLinks as Record<string, string>).instagram).toBe(BASE_CONTENT.socialLinks.instagram);
    expect((merged.servicesCards as Array<{ title: string }>)[0].title).toBe("Video Editing");
    expect(json.data.servicesSubtitle).toBe("existing");
    expect(json.data.servicesDescription).toBe(BASE_CONTENT.servicesDescription);
  });

  it("TEST 4: preserves status metadata on a non-status update", async () => {
    const { json } = await put({ about: "v2" });
    const merged = mergedSiteContentWritten();
    expect(merged.status).toBe("published");
    expect(merged.publishedAt).toBeInstanceOf(Date);
    expect((merged.publishedAt as Date).getTime()).toBe(BASE_CONTENT.publishedAt.getTime());
    expect(json.data.publishedAt).toBe(BASE_CONTENT.publishedAt.toISOString());
  });

  it("TEST 4b: stamps publishedAt when transitioning a draft to published", async () => {
    mockSettings.findOne.mockImplementation(() => ({
      lean: () => ({ siteContent: { ...BASE_CONTENT, status: "draft", publishedAt: undefined } }),
    }));
    const { status } = await put({ about: "v2", status: "published" });
    expect(status).toBe(200);
    const merged = mergedSiteContentWritten();
    expect(merged.status).toBe("published");
    expect(merged.publishedAt).toBeInstanceOf(Date);
  });

  it("TEST 5: clears servicesSubtitle only when explicitly sent empty", async () => {
    const { status, json } = await put({ servicesSubtitle: "" });
    expect(status).toBe(200);
    const merged = mergedSiteContentWritten();
    expect(merged.servicesSubtitle).toBe("");
    expect(json.data.servicesSubtitle).toBe("");
  });

  it("still rejects invalid email values", async () => {
    const { status } = await put({ contactEmail: "not-an-email" });
    expect(status).toBe(400);
  });
});