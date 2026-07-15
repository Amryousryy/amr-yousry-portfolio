/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Database Persistence Tests
 *
 * Verifies that every mutation flows through:
 *   Before → API Mutation → MongoDB → API Response → Final Read
 *
 * Requires running dev server + MongoDB.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let cookieJar = "";

async function req(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookieJar) headers["Cookie"] = cookieJar;

  const init: RequestInit = { method, headers, redirect: "manual" };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, init);

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
    cookieJar = Object.entries(pairs).map(([k, v]) => `${k}=${v}`).join("; ");
  }

  let json: any = null;
  try { json = JSON.parse(await res.text()); } catch {}
  return { status: res.status, json };
}

async function ensureAuth() {
  const csrf = await req("GET", "/api/auth/csrf");
  const token = csrf.json?.csrfToken;
  if (!token) throw new Error("No CSRF token — is dev server running?");

  const params = new URLSearchParams({ csrfToken: token, email: "amryousryy@gmail.com", password: "1937468250Aa@" });
  const url = `${BASE_URL}/api/auth/callback/credentials`;
  const h: Record<string, string> = {};
  if (cookieJar) h["Cookie"] = cookieJar;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...h },
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
    cookieJar = Object.entries(pairs).map(([k, v]) => `${k}=${v}`).join("; ");
  }

  const session = await req("GET", "/api/auth/session");
  if (session.json?.user?.email !== "amryousryy@gmail.com") throw new Error("Auth failed");
}

const CLEANUP: string[] = [];

function slug() { return `db-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

describe("Database Persistence", () => {
  beforeAll(async () => { await ensureAuth(); });
  afterAll(async () => { for (const id of CLEANUP) await req("DELETE", `/api/projects/${id}`); });

  it("full create → read cycle matches", async () => {
    const s = slug();
    const payload = {
      title: "DB Persistence Test",
      slug: s,
      shortDescription: "Short desc",
      fullDescription: "Full desc",
      category: "Testing",
      categories: ["Testing", "QA"],
      image: "https://res.cloudinary.com/test/img.png",
      tags: ["db", "persistence"],
      services: ["Testing"],
      detailedResults: [{ label: "Coverage", value: "100%" }],
      caseStudyMedia: [],
      sections: [],
      status: "draft",
      year: "2025",
      featured: false,
      featuredOrder: 0,
      displayOrder: 0,
      seo: { title: "SEO", description: "Desc", keywords: ["test"] },
      gallery: ["https://res.cloudinary.com/test/g1.png"],
      clientName: "Test Client",
    };

    const create = await req("POST", "/api/projects", payload);
    expect(create.status).toBe(201);
    const id = create.json.data._id;
    CLEANUP.push(id);

    const read = await req("GET", `/api/projects/${id}?admin=true`);
    expect(read.status).toBe(200);
    const doc = read.json.data;

    // Every field must round-trip
    expect(doc.title).toBe(payload.title);
    expect(doc.slug).toBe(s);
    expect(doc.shortDescription).toBe(payload.shortDescription);
    expect(doc.fullDescription).toBe(payload.fullDescription);
    expect(doc.category).toBe(payload.category);
    expect(doc.categories).toEqual(payload.categories);
    expect(doc.image).toBe(payload.image);
    expect(doc.tags).toEqual(payload.tags);
    expect(doc.services).toEqual(payload.services);
    expect(doc.detailedResults).toEqual(payload.detailedResults);
    expect(doc.status).toBe(payload.status);
    expect(doc.year).toBe(payload.year);
    expect(doc.featured).toBe(payload.featured);
    expect(doc.seo).toEqual(payload.seo);
    expect(doc.gallery).toEqual(payload.gallery);
    expect(doc.clientName).toBe(payload.clientName);
  });

  it("update → read matches mutated values", async () => {
    const s = slug();
    const create = await req("POST", "/api/projects", {
      title: "Pre-Update",
      slug: s,
      image: "https://res.cloudinary.com/test/old.png",
      tags: ["old"],
      categories: ["Old"],
      seo: { title: "Old SEO", description: "Old", keywords: ["old"] },
      detailedResults: [{ label: "Old", value: "1" }],
      services: ["Old"],
      gallery: ["https://res.cloudinary.com/test/old.png"],
      status: "draft",
    });
    const id = create.json.data._id;
    CLEANUP.push(id);

    const mutations = {
      title: "Post-Update",
      image: "https://res.cloudinary.com/test/new.png",
      tags: ["new", "updated"],
      categories: ["New Cat"],
      idea: "The idea",
      mainResult: "The result",
      seo: { title: "New SEO", description: "New", keywords: ["new"] },
      detailedResults: [{ label: "New", value: "2" }, { label: "Extra", value: "3" }],
      services: ["New Service"],
      gallery: ["https://res.cloudinary.com/test/new1.png", "https://res.cloudinary.com/test/new2.png"],
    };

    const update = await req("PUT", `/api/projects/${id}`, mutations);
    expect(update.status).toBe(200);

    const read = await req("GET", `/api/projects/${id}?admin=true`);
    const doc = read.json.data;

    expect(doc.title).toBe("Post-Update");
    expect(doc.image).toBe("https://res.cloudinary.com/test/new.png");
    expect(doc.tags).toEqual(["new", "updated"]);
    expect(doc.categories).toEqual(["New Cat"]);
    expect(doc.idea).toBe("The idea");
    expect(doc.mainResult).toBe("The result");
    expect(doc.seo).toEqual({ title: "New SEO", description: "New", keywords: ["new"] });
    expect(doc.detailedResults).toEqual([{ label: "New", value: "2" }, { label: "Extra", value: "3" }]);
    expect(doc.services).toEqual(["New Service"]);
    expect(doc.gallery).toEqual(["https://res.cloudinary.com/test/new1.png", "https://res.cloudinary.com/test/new2.png"]);
  });

  it("consecutive saves persist final state", async () => {
    const s = slug();
    const create = await req("POST", "/api/projects", {
      title: "Triple Save Test",
      slug: s,
      tags: ["v1"],
      status: "draft",
    });
    const id = create.json.data._id;
    CLEANUP.push(id);

    await req("PUT", `/api/projects/${id}`, { tags: ["v2"], shortDescription: "Second" });
    await req("PUT", `/api/projects/${id}`, { tags: ["v3"], shortDescription: "Third" });

    const read = await req("GET", `/api/projects/${id}?admin=true`);
    expect(read.json.data.tags).toEqual(["v3"]);
    expect(read.json.data.shortDescription).toBe("Third");
  });

  it("delete removes from database", async () => {
    const s = slug();
    const create = await req("POST", "/api/projects", {
      title: "Delete Test",
      slug: s,
      image: "https://res.cloudinary.com/test/del.png",
      status: "draft",
    });
    const id = create.json.data._id;

    const del = await req("DELETE", `/api/projects/${id}`);
    expect(del.status).toBe(200);

    const read = await req("GET", `/api/projects/${id}?admin=true`);
    expect(read.status).toBe(404);
  });
});
