import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), updateOne: vi.fn(), findOne: vi.fn() } }));
vi.mock("@/lib/activity", () => ({ logActivity: vi.fn() }));
vi.mock("@/lib/deployment/lifecycle", () => ({
  applyDeploymentForPublish: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import { PUT } from "@/app/api/projects/[id]/route";
import { applyDeploymentForPublish } from "@/lib/deployment/lifecycle";
import Project from "@/models/Project";

const mockGetServerSession = vi.mocked(getServerSession);
const mockDbConnect = vi.mocked(dbConnect);
const mockApplyDeployment = vi.mocked(applyDeploymentForPublish);
const mockFindById = vi.mocked(Project.findById);
const mockFindByIdAndUpdate = vi.mocked(Project.findByIdAndUpdate);
const mockUpdateOne = vi.mocked(Project.updateOne);
const mockFindOne = vi.mocked(Project.findOne);

const PROJECT_ID = "507f1f77bcf86cd799439011";

function validPublishBody(overrides: Record<string, unknown> = {}) {
  return {
    title: "New CMS Project",
    slug: "new-cms-project",
    shortDescription: "A concise project description",
    category: "Web",
    categories: ["Web"],
    image: "https://res.cloudinary.com/demo/image.png",
    status: "published",
    ...overrides,
  };
}

function makeCurrentProject(overrides: Record<string, unknown> = {}) {
  return {
    _id: PROJECT_ID,
    title: "New CMS Project",
    slug: "new-cms-project",
    shortDescription: "A concise project description",
    category: "Web",
    categories: ["Web"],
    image: "https://res.cloudinary.com/demo/image.png",
    services: ["Web Dev"],
    status: "draft",
    featured: false,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } } as never);
  mockDbConnect.mockResolvedValue({} as never);
  mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(makeCurrentProject()) } as never);
  mockFindByIdAndUpdate.mockImplementation((() => makeCurrentProject({ status: "published" })) as never);
  mockUpdateOne.mockResolvedValue({ matchedCount: 1 } as never);
});

function putJson(body: unknown) {
  return new Request(`http://localhost/api/projects/${PROJECT_ID}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("PUT /api/projects/[id] — deployment lifecycle integration", () => {
  it("requires authentication before touching deployment", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await PUT(putJson(validPublishBody()), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(401);
    expect(mockApplyDeployment).not.toHaveBeenCalled();
  });

  it("publishes a brand-new slug by starting a deployment (rebuild required)", async () => {
    mockApplyDeployment.mockResolvedValue({ state: "deploying", attemptId: "job_publish_1" });

    const response = await PUT(putJson(validPublishBody()), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.deployment).toEqual({ state: "deploying", attemptId: "job_publish_1" });
    expect(mockApplyDeployment).toHaveBeenCalledWith(PROJECT_ID, {
      slug: "new-cms-project",
      deployment: null,
    });
  });

  it("passes the existing live deployment through on a re-publish (no rebuild)", async () => {
    const deployment = { state: "live", deploymentId: "dpl_1", attemptId: "job_1" };
    mockFindById.mockReturnValue({
      lean: vi.fn().mockResolvedValue(makeCurrentProject({ status: "published", deployment })),
    } as never);
    mockFindByIdAndUpdate.mockImplementation((() =>
      makeCurrentProject({ status: "published", deployment })
    ) as never);
    mockApplyDeployment.mockResolvedValue({ state: "live", deploymentId: "dpl_1" });

    const response = await PUT(putJson(validPublishBody()), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.deployment).toEqual({ state: "live", deploymentId: "dpl_1" });
    expect(mockApplyDeployment).toHaveBeenCalledWith(PROJECT_ID, {
      slug: "new-cms-project",
      deployment,
    });
  });

  it("resets deployment to not_required when saving as draft/unpublishing an active project", async () => {
    const deployment = { state: "deploying", attemptId: "job_inflight", deploymentId: "dpl_1" };
    mockFindById.mockReturnValue({
      lean: vi.fn().mockResolvedValue(makeCurrentProject({ status: "published", deployment })),
    } as never);
    mockFindByIdAndUpdate.mockImplementation((() =>
      makeCurrentProject({ status: "draft", deployment })
    ) as never);

    const response = await PUT(
      putJson({ title: "Save draft", slug: "new-cms-project", status: "draft" }),
      { params: Promise.resolve({ id: PROJECT_ID }) }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.deployment).toEqual({ state: "not_required" });
    expect(mockApplyDeployment).not.toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: PROJECT_ID },
      { $set: { deployment: { state: "not_required" } } }
    );
  });

  it("does not trigger a deployment when readiness validation blocks publishing", async () => {
    const response = await PUT(
      putJson(validPublishBody({ category: "", categories: [] })),
      { params: Promise.resolve({ id: PROJECT_ID }) }
    );

    expect(response.status).toBe(422);
    expect(mockApplyDeployment).not.toHaveBeenCalled();
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("allows Save Changes on an already-published project even when readiness items would block", async () => {
    // The current project is published but incomplete; re-saving it persists
    // valid edits WITHOUT re-running the strict publish gate (Phase D: the
    // gate belongs to the draft→published transition only).
    mockFindById.mockReturnValue({
      lean: vi.fn().mockResolvedValue(makeCurrentProject({ status: "published", category: "", categories: [] })),
    } as never);
    mockFindByIdAndUpdate.mockImplementation((() =>
      makeCurrentProject({ status: "published" })
    ) as never);
    mockApplyDeployment.mockResolvedValue({ state: "live", deploymentId: "dpl_1" });

    const response = await PUT(
      putJson({ title: "New CMS Project", slug: "new-cms-project", status: "published" }),
      { params: Promise.resolve({ id: PROJECT_ID }) }
    );

    expect(response.status).toBe(200);
    expect(mockFindByIdAndUpdate).toHaveBeenCalled();
  });

  it("appends a newly-featured project to the tail of the homepage order", async () => {
    mockFindOne.mockReturnValue({
      sort: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue({ featuredOrder: 1 }) }) }),
    } as never);
    mockFindByIdAndUpdate.mockImplementation(((...args: unknown[]) => {
      const updateArg = args[1] as Record<string, unknown>;
      return makeCurrentProject({ status: "published", featured: true, featuredOrder: updateArg.featuredOrder });
    }) as never);

    const response = await PUT(
      putJson({ title: "New CMS Project", slug: "new-cms-project", featured: true }),
      { params: Promise.resolve({ id: PROJECT_ID }) }
    );

    expect(response.status).toBe(200);
    expect(mockFindOne).toHaveBeenCalledWith({ status: "published", featured: true });
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      PROJECT_ID,
      expect.objectContaining({ featured: true, featuredOrder: 2 }),
      expect.anything()
    );
  });

  it("clears the order when a project is demoted from the homepage", async () => {
    mockFindById.mockReturnValue({
      lean: vi.fn().mockResolvedValue(makeCurrentProject({ status: "published", featured: true, featuredOrder: 3 })),
    } as never);
    mockFindByIdAndUpdate.mockImplementation(((...args: unknown[]) => {
      const updateArg = args[1] as Record<string, unknown>;
      return makeCurrentProject({ status: "published", featured: false, featuredOrder: updateArg.featuredOrder });
    }) as never);

    const response = await PUT(
      putJson({ title: "New CMS Project", slug: "new-cms-project", featured: false }),
      { params: Promise.resolve({ id: PROJECT_ID }) }
    );

    expect(response.status).toBe(200);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      PROJECT_ID,
      expect.objectContaining({ featured: false, featuredOrder: 0 }),
      expect.anything()
    );
  });
});