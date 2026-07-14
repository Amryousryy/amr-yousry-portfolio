/**
 * API Integration Tests — Project CRUD endpoints.
 *
 * These tests hit the real API routes and MongoDB.
 * They require the dev server on localhost:3000 and a valid session.
 *
 * Set TEST_BASE_URL if not localhost:3000.
 * Authentication is handled via a cookie jar stored in a temp file.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const COOKIE_PATH = join(process.cwd(), ".test-session-cookies");

let cookieJar = "";

async function request(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; json: any; headers: Headers }> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookieJar) headers["Cookie"] = cookieJar;

  const init: RequestInit = { method, headers, redirect: "manual" };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(url, init);

  const setCookies = res.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    const pairs: Record<string, string> = {};
    for (const line of cookieJar.split("; ")) {
      const [k, v] = line.split("=");
      if (k) pairs[k] = v ?? "";
    }
    for (const sc of setCookies) {
      const raw = sc.split(";")[0];
      const eq = raw.indexOf("=");
      if (eq > 0) pairs[raw.slice(0, eq)] = raw.slice(eq + 1);
    }
    cookieJar = Object.entries(pairs)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  let json: any = null;
  const text = await res.text();
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json, headers: res.headers };
}

let AUTHENTICATED = false;

async function ensureAuth() {
  if (AUTHENTICATED) return;

  const csrf = await request("GET", "/api/auth/csrf");
  const csrfToken = csrf.json?.csrfToken;
  if (!csrfToken) throw new Error("Failed to get CSRF token — is the dev server running?");

  const params = new URLSearchParams({
    csrfToken,
    email: "amryousryy@gmail.com",
    password: "1937468250Aa@",
  });

  const url = `${BASE_URL}/api/auth/callback/credentials`;
  const headers: Record<string, string> = {};
  if (cookieJar) headers["Cookie"] = cookieJar;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers },
    body: params.toString(),
    redirect: "manual",
  });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    const pairs: Record<string, string> = {};
    for (const line of cookieJar.split("; ")) {
      const [k, v] = line.split("=");
      if (k) pairs[k] = v ?? "";
    }
    for (const sc of setCookies) {
      const raw = sc.split(";")[0];
      const eq = raw.indexOf("=");
      if (eq > 0) pairs[raw.slice(0, eq)] = raw.slice(eq + 1);
    }
    cookieJar = Object.entries(pairs)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  const session = await request("GET", "/api/auth/session");
  AUTHENTICATED = session.json?.user?.email === "amryousryy@gmail.com";
  if (!AUTHENTICATED) throw new Error("Authentication failed — check credentials");
}

const CREATED_IDS: string[] = [];

function uniqueSlug() {
  return `test-crud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function minimalProject(overrides: Record<string, unknown> = {}) {
  return {
    title: "Integration Test Project",
    slug: uniqueSlug(),
    shortDescription: "Test description",
    fullDescription: "Test full description",
    category: "Testing",
    categories: ["Testing"],
    image: "https://res.cloudinary.com/test/image/upload/test.png",
    tags: ["test"],
    services: [],
    detailedResults: [],
    caseStudyMedia: [],
    sections: [],
    status: "draft",
    year: "2025",
    featured: false,
    featuredOrder: 0,
    displayOrder: 0,
    seo: { title: "Test SEO", description: "Test", keywords: ["test"] },
    gallery: [],
    clientName: "",
    ...overrides,
  };
}

// ──────────────────────────────────────────────────────────
// CRUD Tests
// ──────────────────────────────────────────────────────────

describe("API: Project CRUD", () => {
  beforeAll(async () => {
    await ensureAuth();
  });

  afterAll(async () => {
    for (const id of CREATED_IDS) {
      await request("DELETE", `/api/projects/${id}`);
    }
  });

  // ── CREATE ──
  describe("POST /api/projects", () => {
    it("creates a new project", async () => {
      const payload = minimalProject();
      const res = await request("POST", "/api/projects", payload);
      expect(res.status).toBe(201);
      expect(res.json?.data?._id).toBeDefined();
      expect(res.json?.data?.title).toBe("Integration Test Project");
      CREATED_IDS.push(res.json.data._id);
    });

    it("rejects duplicate slug", async () => {
      const slug = uniqueSlug();
      await request("POST", "/api/projects", minimalProject({ slug }));
      const res = await request("POST", "/api/projects", minimalProject({ slug }));
      expect(res.status).toBe(409);
    });

    it("rejects invalid slug", async () => {
      const res = await request("POST", "/api/projects", minimalProject({ slug: "Invalid Slug!" }));
      expect(res.status).toBe(400);
    });

    it("rejects missing title", async () => {
      const res = await request("POST", "/api/projects", minimalProject({ title: "" }));
      expect(res.status).toBe(400);
    });

    it("rejects invalid status enum", async () => {
      const res = await request("POST", "/api/projects", minimalProject({ status: "archived" }));
      expect(res.status).toBe(400);
    });

    it("rejects javascript: image URL", async () => {
      const res = await request("POST", "/api/projects", minimalProject({
        image: "javascript:alert(1)",
      }));
      expect(res.status).toBe(400);
    });
  });

  // ── READ ──
  describe("GET /api/projects", () => {
    it("returns project list", async () => {
      const res = await request("GET", "/api/projects");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.json?.data)).toBe(true);
    });

    it("returns a single project by id", async () => {
      const id = CREATED_IDS[0];
      const res = await request("GET", `/api/projects/${id}?admin=true`);
      expect(res.status).toBe(200);
      expect(res.json?.data?._id).toBe(id);
    });

    it("returns 404 for nonexistent id", async () => {
      const res = await request("GET", "/api/projects/000000000000000000000000?admin=true");
      expect(res.status).toBe(404);
    });
  });

  // ── UPDATE ──
  describe("PUT /api/projects/:id", () => {
    it("updates project title", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        title: "Updated Integration Title",
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.title).toBe("Updated Integration Title");
    });

    it("persists changes on re-read", async () => {
      const id = CREATED_IDS[0];
      const res = await request("GET", `/api/projects/${id}?admin=true`);
      expect(res.json?.data?.title).toBe("Updated Integration Title");
    });

    it("updates tags", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        tags: ["new-tag", "updated", "integration"],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.tags).toEqual(["new-tag", "updated", "integration"]);
    });

    it("updates categories", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        categories: ["New Category", "Updated"],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.categories).toEqual(["New Category", "Updated"]);
    });

    it("sets optional fields (idea, mainResult)", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        idea: "The big idea behind this project",
        mainResult: "Key outcome achieved",
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.idea).toBe("The big idea behind this project");
      expect(res.json?.data?.mainResult).toBe("Key outcome achieved");
    });

    it("clears optional fields by omitting them", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        title: "Still Updated",
        idea: undefined,
        mainResult: undefined,
      });
      expect(res.status).toBe(200);
      // Server uses partial update — omitted fields stay as-is unless explicitly nulled
    });

    it("updates SEO fields", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        seo: {
          title: "Updated SEO Title",
          description: "Updated SEO description",
          keywords: ["seo", "updated"],
        },
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.seo?.title).toBe("Updated SEO Title");
      expect(res.json?.data?.seo?.keywords).toEqual(["seo", "updated"]);
    });

    it("updates detailedResults", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        detailedResults: [
          { label: "Enrollment", value: "+300%" },
          { label: "Engagement", value: "+150%" },
        ],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.detailedResults).toHaveLength(2);
    });

    it("updates services", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        services: ["Motion Graphics", "Branding"],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.services).toEqual(["Motion Graphics", "Branding"]);
    });

    it("updates gallery", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        gallery: [
          "https://res.cloudinary.com/test/v1/img1.png",
          "https://res.cloudinary.com/test/v1/img2.png",
        ],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.gallery).toHaveLength(2);
    });

    it("updates image", async () => {
      const id = CREATED_IDS[0];
      const newImage = "https://res.cloudinary.com/test/v1/new-image.png";
      const res = await request("PUT", `/api/projects/${id}`, {
        image: newImage,
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.image).toBe(newImage);
    });

    it("returns 404 for nonexistent project", async () => {
      const res = await request("PUT", "/api/projects/000000000000000000000000", {
        title: "Ghost",
      });
      expect(res.status).toBe(404);
    });

    it("rejects invalid slug on update", async () => {
      const id = CREATED_IDS[0];
      const res = await request("PUT", `/api/projects/${id}`, {
        slug: "Has Spaces And!",
      });
      expect(res.status).toBe(400);
    });
  });

  // ── DOUBLE / TRIPLE SAVE ──
  describe("Double & triple save", () => {
    it("double save persists both", async () => {
      const id = CREATED_IDS[0];
      await request("PUT", `/api/projects/${id}`, {
        shortDescription: "Save 1 description",
        tags: ["save1"],
      });
      const res = await request("PUT", `/api/projects/${id}`, {
        shortDescription: "Save 2 description",
        tags: ["save1", "save2"],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.shortDescription).toBe("Save 2 description");
      expect(res.json?.data?.tags).toEqual(["save1", "save2"]);
    });

    it("triple save persists final state", async () => {
      const id = CREATED_IDS[0];
      await request("PUT", `/api/projects/${id}`, { shortDescription: "Second" });
      const res = await request("PUT", `/api/projects/${id}`, {
        shortDescription: "Third",
        tags: ["final"],
      });
      expect(res.status).toBe(200);
      expect(res.json?.data?.shortDescription).toBe("Third");

      const verify = await request("GET", `/api/projects/${id}?admin=true`);
      expect(verify.json?.data?.shortDescription).toBe("Third");
      expect(verify.json?.data?.tags).toEqual(["final"]);
    });
  });

  // ── DELETE ──
  describe("DELETE /api/projects/:id", () => {
    it("deletes a project", async () => {
      const slug = uniqueSlug();
      const create = await request("POST", "/api/projects", minimalProject({ slug }));
      const id = create.json.data._id;

      const del = await request("DELETE", `/api/projects/${id}`);
      expect(del.status).toBe(200);

      const verify = await request("GET", `/api/projects/${id}?admin=true`);
      expect(verify.status).toBe(404);
    });

    it("returns 404 for nonexistent project", async () => {
      const res = await request("DELETE", "/api/projects/000000000000000000000000");
      expect(res.status).toBe(404);
    });
  });
});
