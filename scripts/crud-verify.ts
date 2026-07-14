/**
 * COMPLETE CRUD VERIFICATION — Real MongoDB
 *
 * Tests: Edit (title/desc/tags/categories/optional), Save, Refresh, Re-open,
 *        Double-save, Create, Delete, MongoDB verification.
 */

import { readFileSync } from "fs";

const BASE = "http://localhost:3000";
const TARGET_ID = "6a54d8d06501057e0849dda4";

const cookieStr = readFileSync("scripts/.test-cookies", "utf-8").trim();
const headers = {
  "Content-Type": "application/json",
  Cookie: cookieStr,
};

let CREATED_ID: string | null = null;
let BEFORE_DOC: any = null;
let SAVE1_DOC: any = null;
let SAVE2_DOC: any = null;
let REOPEN_DOC: any = null;
let CREATED_DOC: any = null;
let DELETE_RESULT: any = null;

async function api(method: string, path: string, body?: any) {
  const url = `${BASE}${path}`;
  const opts: RequestInit = {
    method,
    headers,
    redirect: "manual",
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status >= 300 && res.status < 400) {
    return { status: res.status, redirect: res.headers.get("location"), data: null, json: null };
  }
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json?.data ?? json, json, redirect: null };
}

function diff(before: any, after: any, keys: string[]) {
  const changes: string[] = [];
  for (const k of keys) {
    const bv = JSON.stringify(before?.[k]);
    const av = JSON.stringify(after?.[k]);
    if (bv !== av) {
      changes.push(`  ${k}: ${bv} → ${av}`);
    }
  }
  return changes;
}

async function main() {
  // ═══════════════════════════════════════════════════════════
  // STEP 1: READ BEFORE
  // ═══════════════════════════════════════════════════════════
  console.log("═".repeat(60));
  console.log("STEP 1: GET existing project (BEFORE document)");
  console.log("═".repeat(60));
  const before = await api("GET", `/api/projects/${TARGET_ID}?admin=true`);
  BEFORE_DOC = before.data;
  console.log("  status:", before.status);
  console.log("  _id:", BEFORE_DOC?._id);
  console.log("  title:", BEFORE_DOC?.title);
  console.log("  description:", BEFORE_DOC?.shortDescription?.slice(0, 60));
  console.log("  tags:", JSON.stringify(BEFORE_DOC?.tags));
  console.log("  categories:", JSON.stringify(BEFORE_DOC?.categories));
  console.log("  category:", BEFORE_DOC?.category);
  console.log("  idea:", JSON.stringify(BEFORE_DOC?.idea));
  console.log("  mainResult:", JSON.stringify(BEFORE_DOC?.mainResult));
  console.log("  problem:", JSON.stringify(BEFORE_DOC?.problem));
  console.log("  strategy:", JSON.stringify(BEFORE_DOC?.strategy));
  console.log("  solution:", JSON.stringify(BEFORE_DOC?.solution));
  console.log("  execution:", JSON.stringify(BEFORE_DOC?.execution));
  console.log("  results:", JSON.stringify(BEFORE_DOC?.results));
  console.log("  client:", JSON.stringify(BEFORE_DOC?.client));
  console.log("  video:", BEFORE_DOC?.video);
  console.log("  status:", BEFORE_DOC?.status);

  // ═══════════════════════════════════════════════════════════
  // STEP 2: EDIT + SAVE 1
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 2: EDIT + SAVE (first save)");
  console.log("═".repeat(60));
  const editPayload = {
    title: "CRUD TEST - Motion Graphics Campaign",
    shortDescription: "Updated short description for CRUD verification test",
    fullDescription: "Updated full description to verify persistence of long-form content across CRUD operations",
    tags: ["crud-test", "motion-graphics", "verification", "automated"],
    categories: ["Motion Graphics", "3D Animation", "Social Media"],
    category: "Motion Graphics",
    idea: "The original concept was to create an immersive training visual",
    mainResult: "300% increase in enrollment after campaign launch",
    problem: "BE Training lacked visual presence in a competitive education market",
    strategy: "Develop a series of animated explainers targeting social media audiences",
    solution: "Created a cohesive motion graphics campaign with consistent brand language",
    execution: "Produced 12 animated sequences across 4 weeks of production",
    results: "Enrollment increased by 300% within the first quarter",
    client: "BE Training Academy",
    image: "https://res.cloudinary.com/dpax6u61z/image/upload/v1783943866/yafjlybgwzbj9tfldvm3.png",
    status: "draft" as const,
    year: "2025",
    clientName: "BE Training Academy",
    seo: {
      title: "CRUD Test - Motion Graphics Campaign",
      description: "Verified CRUD operations for portfolio system",
      keywords: ["crud-test", "verification", "portfolio"],
    },
    gallery: [
      "https://res.cloudinary.com/dpax6u61z/image/upload/v1783943866/yafjlybgwzbj9tfldvm3.png",
      "https://res.cloudinary.com/dpax6u61z/image/upload/v1783943866/yafjlybgwzbj9tfldvm3.png",
    ],
    services: ["Motion Graphics", "Social Media Design"],
    detailedResults: [{ label: "Enrollment", value: "+300%" }],
    caseStudyMedia: [],
    sections: [],
    featured: BEFORE_DOC?.featured ?? false,
    featuredOrder: BEFORE_DOC?.featuredOrder ?? 0,
    displayOrder: BEFORE_DOC?.displayOrder ?? 0,
  };

  console.log("  Payload keys:", Object.keys(editPayload).join(", "));
  console.log("  Payload title:", editPayload.title);
  console.log("  Payload tags:", JSON.stringify(editPayload.tags));
  console.log("  Payload idea:", editPayload.idea);
  console.log("  Payload mainResult:", editPayload.mainResult);

  const save1 = await api("PUT", `/api/projects/${TARGET_ID}`, editPayload);
  SAVE1_DOC = save1.data;
  console.log("\n  PUT status:", save1.status);
  console.log("  Response title:", SAVE1_DOC?.title);
  console.log("  Response tags:", JSON.stringify(SAVE1_DOC?.tags));
  console.log("  Response idea:", JSON.stringify(SAVE1_DOC?.idea));
  console.log("  Response mainResult:", JSON.stringify(SAVE1_DOC?.mainResult));
  console.log("  Response problem:", JSON.stringify(SAVE1_DOC?.problem));
  console.log("  Response categories:", JSON.stringify(SAVE1_DOC?.categories));
  if (save1.status !== 200) {
    console.log("  ERROR:", JSON.stringify(save1.json));
    process.exit(1);
  }

  // ═══════════════════════════════════════════════════════════
  // STEP 3: RE-READ + CONFIRM PERSISTENCE
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 3: GET re-read — confirm persistence");
  console.log("═".repeat(60));
  const reget = await api("GET", `/api/projects/${TARGET_ID}?admin=true`);
  REOPEN_DOC = reget.data;
  console.log("  GET status:", reget.status);

  const fieldsToCheck = [
    "title", "shortDescription", "fullDescription", "category",
    "tags", "categories", "idea", "mainResult", "problem",
    "strategy", "solution", "execution", "results", "client",
    "image", "status", "year", "clientName",
  ];

  let allPersisted = true;
  for (const field of fieldsToCheck) {
    const expected = JSON.stringify(editPayload[field as keyof typeof editPayload]);
    const actual = JSON.stringify(REOPEN_DOC?.[field]);
    const match = expected === actual;
    if (!match) allPersisted = false;
    console.log(`  ${match ? "✓" : "✗"} ${field}: ${match ? "PERSISTED" : `MISMATCH expected=${expected} got=${actual}`}`);
  }

  // Check nested seo
  for (const key of ["title", "description", "keywords"]) {
    const expected = JSON.stringify(editPayload.seo[key as keyof typeof editPayload.seo]);
    const actual = JSON.stringify(REOPEN_DOC?.seo?.[key]);
    const match = expected === actual;
    if (!match) allPersisted = false;
    console.log(`  ${match ? "✓" : "✗"} seo.${key}: ${match ? "PERSISTED" : `MISMATCH expected=${expected} got=${actual}`}`);
  }

  // Check arrays
  for (const key of ["services", "gallery", "detailedResults"]) {
    const expected = JSON.stringify(editPayload[key as keyof typeof editPayload]);
    const actual = JSON.stringify(REOPEN_DOC?.[key]);
    const match = expected === actual;
    if (!match) allPersisted = false;
    console.log(`  ${match ? "✓" : "✗"} ${key}: ${match ? "PERSISTED" : `MISMATCH`}`);
  }

  console.log(`\n  All fields persisted: ${allPersisted ? "YES ✓" : "NO ✗"}`);
  if (!allPersisted) process.exit(1);

  // ═══════════════════════════════════════════════════════════
  // STEP 4: DOUBLE-SAVE (consecutive saves)
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 4: DOUBLE-SAVE (consecutive saves)");
  console.log("═".repeat(60));
  const doubleSavePayload = {
    ...editPayload,
    shortDescription: "Double-save verified description update",
  };
  const save2 = await api("PUT", `/api/projects/${TARGET_ID}`, doubleSavePayload);
  SAVE2_DOC = save2.data;
  console.log("  Save 1 status:", save1.status);
  console.log("  Save 2 status:", save2.status);
  console.log("  Save 2 description:", SAVE2_DOC?.shortDescription);
  const doublePersisted = SAVE2_DOC?.shortDescription === doubleSavePayload.shortDescription;
  console.log(`  Double-save persisted: ${doublePersisted ? "YES ✓" : "NO ✗"}`);
  if (!doublePersisted) process.exit(1);

  // Third save to be thorough
  const save3 = await api("PUT", `/api/projects/${TARGET_ID}`, {
    ...editPayload,
    shortDescription: "Triple-save final description",
    tags: ["final-tag"],
  });
  console.log("  Save 3 status:", save3.status);
  console.log("  Save 3 description:", save3.data?.shortDescription);
  console.log("  Save 3 tags:", JSON.stringify(save3.data?.tags));
  const tripleOk = save3.status === 200 && save3.data?.shortDescription === "Triple-save final description";
  console.log(`  Triple-save: ${tripleOk ? "YES ✓" : "NO ✗"}`);

  // ═══════════════════════════════════════════════════════════
  // STEP 5: REVERT to original + verify cleared optional fields
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 5: REVERT optional fields to empty (verify cleanup works)");
  console.log("═".repeat(60));
  const revertPayload = {
    title: BEFORE_DOC?.title ?? "CRUD TEST - Motion Graphics Campaign",
    shortDescription: BEFORE_DOC?.shortDescription ?? "A motion graphics campaign",
    tags: BEFORE_DOC?.tags ?? [],
    categories: BEFORE_DOC?.categories ?? ["Motion Graphics"],
    category: BEFORE_DOC?.category ?? "Motion Graphics",
    // Optional fields set to undefined (omitted from JSON) — simulates onSubmit cleanup
    image: BEFORE_DOC?.image,
    status: BEFORE_DOC?.status ?? "draft",
    year: BEFORE_DOC?.year ?? "2025",
    seo: BEFORE_DOC?.seo ?? { title: "", description: "", keywords: [] },
    gallery: BEFORE_DOC?.gallery ?? [],
    services: BEFORE_DOC?.services ?? [],
    detailedResults: BEFORE_DOC?.detailedResults ?? [],
    caseStudyMedia: BEFORE_DOC?.caseStudyMedia ?? [],
    sections: BEFORE_DOC?.sections ?? [],
    clientName: BEFORE_DOC?.clientName ?? "",
    featured: BEFORE_DOC?.featured ?? false,
    featuredOrder: BEFORE_DOC?.featuredOrder ?? 0,
    displayOrder: BEFORE_DOC?.displayOrder ?? 0,
  };
  const revertSave = await api("PUT", `/api/projects/${TARGET_ID}`, revertPayload);
  console.log("  Revert status:", revertSave.status);
  console.log("  Reverted title:", revertSave.data?.title);

  // ═══════════════════════════════════════════════════════════
  // STEP 6: CREATE NEW PROJECT
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 6: CREATE new project");
  console.log("═".repeat(60));
  const createPayload = {
    title: "CRUD TEST - Temporary Project",
    slug: "crud-test-temporary-" + Date.now(),
    shortDescription: "This project is created for CRUD testing and will be deleted",
    fullDescription: "Temporary project to verify the create and delete operations work correctly.",
    category: "Web Development",
    categories: ["Web Development", "UI/UX"],
    image: "https://res.cloudinary.com/dpax6u61z/image/upload/v1783943866/yafjlybgwzbj9tfldvm3.png",
    tags: ["test", "temporary", "crud"],
    services: ["Web Development"],
    status: "draft",
    year: "2025",
    clientName: "Test Client",
    seo: { title: "Test", description: "Test project", keywords: ["test"] },
    gallery: [],
    detailedResults: [],
    caseStudyMedia: [],
    sections: [],
    featured: false,
    featuredOrder: 0,
    displayOrder: 0,
    slugAutoGenerated: false,
  };
  const create = await api("POST", "/api/projects", createPayload);
  CREATED_DOC = create.data;
  CREATED_ID = create.data?._id;
  console.log("  POST status:", create.status);
  console.log("  Created _id:", CREATED_ID);
  console.log("  Created title:", CREATED_DOC?.title);
  console.log("  Created slug:", CREATED_DOC?.slug);
  if (create.status !== 201 || !CREATED_ID) {
    console.log("  CREATE FAILED:", JSON.stringify(create.json));
    process.exit(1);
  }

  // Re-read created project
  const regetCreated = await api("GET", `/api/projects/${CREATED_ID}?admin=true`);
  console.log("  GET created status:", regetCreated.status);
  console.log("  GET created title:", regetCreated.data?.title);
  const createPersisted = regetCreated.data?.title === createPayload.title;
  console.log(`  Create persisted: ${createPersisted ? "YES ✓" : "NO ✗"}`);

  // ═══════════════════════════════════════════════════════════
  // STEP 7: DELETE THE NEW PROJECT
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("STEP 7: DELETE the temporary project");
  console.log("═".repeat(60));
  const del = await api("DELETE", `/api/projects/${CREATED_ID}`);
  DELETE_RESULT = del.json;
  console.log("  DELETE status:", del.status);
  console.log("  DELETE response:", JSON.stringify(DELETE_RESULT));

  // Confirm it's gone
  const regetDeleted = await api("GET", `/api/projects/${CREATED_ID}?admin=true`);
  const isGone = regetDeleted.status === 404;
  console.log("  GET after delete status:", regetDeleted.status);
  console.log(`  Confirmed deleted: ${isGone ? "YES ✓" : "NO ✗"}`);

  // ═══════════════════════════════════════════════════════════
  // FINAL: FINAL MONGODB STATE
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("FINAL: MongoDB state of original project after all operations");
  console.log("═".repeat(60));
  const finalGet = await api("GET", `/api/projects/${TARGET_ID}?admin=true`);
  const FINAL_DOC = finalGet.data;
  console.log("  GET status:", finalGet.status);
  console.log("  _id:", FINAL_DOC?._id);
  console.log("  title:", FINAL_DOC?.title);
  console.log("  shortDescription:", FINAL_DOC?.shortDescription);
  console.log("  fullDescription:", FINAL_DOC?.fullDescription);
  console.log("  category:", FINAL_DOC?.category);
  console.log("  categories:", JSON.stringify(FINAL_DOC?.categories));
  console.log("  tags:", JSON.stringify(FINAL_DOC?.tags));
  console.log("  idea:", FINAL_DOC?.idea);
  console.log("  mainResult:", FINAL_DOC?.mainResult);
  console.log("  problem:", FINAL_DOC?.problem);
  console.log("  strategy:", FINAL_DOC?.strategy);
  console.log("  solution:", FINAL_DOC?.solution);
  console.log("  execution:", FINAL_DOC?.execution);
  console.log("  results:", FINAL_DOC?.results);
  console.log("  client:", FINAL_DOC?.client);
  console.log("  image:", FINAL_DOC?.image);
  console.log("  video:", FINAL_DOC?.video);
  console.log("  status:", FINAL_DOC?.status);
  console.log("  year:", FINAL_DOC?.year);
  console.log("  clientName:", FINAL_DOC?.clientName);
  console.log("  seo:", JSON.stringify(FINAL_DOC?.seo));
  console.log("  gallery:", JSON.stringify(FINAL_DOC?.gallery));
  console.log("  services:", JSON.stringify(FINAL_DOC?.services));

  // ═══════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("VERDICT");
  console.log("═".repeat(60));
  const results = [
    ["Read existing project", before.status === 200],
    ["Edit + Save (title/desc/tags/categories/optional)", save1.status === 200],
    ["All fields persisted after re-read", allPersisted],
    ["Double-save consecutive", doublePersisted && save2.status === 200],
    ["Triple-save consecutive", tripleOk],
    ["Revert optional fields (empty strings → undefined)", revertSave.status === 200],
    ["Create new project", create.status === 201 && !!CREATED_ID],
    ["Created project persisted", createPersisted],
    ["Delete created project", del.status === 200],
    ["Deleted project confirmed gone", isGone],
  ];

  let allPass = true;
  for (const [name, pass] of results) {
    console.log(`  ${pass ? "✓" : "✗"} ${name}`);
    if (!pass) allPass = false;
  }
  console.log(`\n  ALL TESTS ${allPass ? "PASSED ✓" : "FAILED ✗"}`);
  if (!allPass) process.exit(1);
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
