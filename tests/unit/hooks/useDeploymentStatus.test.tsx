import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider, environmentManager } from "@tanstack/react-query";
import { useDeploymentStatus } from "@/hooks/useDeploymentStatus";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...actual,
    ProjectService: {
      ...actual.ProjectService,
      getDeployment: vi.fn(),
      retryDeployment: vi.fn(),
    },
  };
});

import { toast } from "sonner";
import { ProjectService } from "@/lib/api-client";

const getDeployment = vi.mocked(ProjectService.getDeployment);
const retryDeployment = vi.mocked(ProjectService.retryDeployment);

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, refetchOnWindowFocus: false },
    },
  });
}

function makeWrapper(client: QueryClient) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe("useDeploymentStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    environmentManager.setIsServer(() => false);
  });

  afterEach(() => {
    environmentManager.setIsServer(() => true);
    vi.useRealTimers();
  });

  it("fetches the status once on mount and exposes the resolved state", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "deploying" } } });
    const { result } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(getDeployment).toHaveBeenCalledTimes(1);
    expect(getDeployment).toHaveBeenCalledWith("p1");
    expect(result.current.state).toBe("deploying");
    expect(result.current.deployment?.state).toBe("deploying");
    expect(result.current.isPolling).toBe(true);
  });

  it("polls at the interval while deploying and stops once the status is live", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "deploying" } } });
    renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(getDeployment).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(getDeployment).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(getDeployment).toHaveBeenCalledTimes(3);

    getDeployment.mockResolvedValue({ data: { deployment: { state: "live" } } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });
    expect(getDeployment).toHaveBeenCalledTimes(4);
  });

  it("reflects the reconciled server state after polling returns live", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "deploying" } } });
    const { result } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.state).toBe("deploying");
    expect(result.current.isPolling).toBe(true);

    getDeployment.mockResolvedValue({ data: { deployment: { state: "live" } } });
    act(() => {
      result.current.refetch();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state).toBe("live");
    expect(result.current.isPolling).toBe(false);
  });

  it("does not poll after leaving the editor (unmount cleanup)", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "pending" } } });
    const { unmount } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(getDeployment).toHaveBeenCalledTimes(1);

    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20000);
    });
    expect(getDeployment).toHaveBeenCalledTimes(1);
  });

  it("does not fetch or poll when disabled, and falls back to initial data", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "live" } } });
    const { result } = renderHook(
      () =>
        useDeploymentStatus("p1", {
          enabled: false,
          initialDeployment: { state: "deploying" },
        }),
      { wrapper: makeWrapper(makeClient()) }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(getDeployment).not.toHaveBeenCalled();
    expect(result.current.deployment?.state).toBe("deploying");
    expect(result.current.isPolling).toBe(true);
  });

  it("does nothing when no project id is provided", async () => {
    renderHook(() => useDeploymentStatus(undefined), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(getDeployment).not.toHaveBeenCalled();
    expect(retryDeployment).not.toHaveBeenCalled();
  });

  it("surfaces the backend warning and reconciliation flags", async () => {
    getDeployment.mockResolvedValue({
      data: {
        deployment: { state: "deploying" },
        warning: "Vercel is READY but the canonical URL is not reachable",
        liveApplied: false,
      },
    });
    const { result } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.warning).toBe(
      "Vercel is READY but the canonical URL is not reachable"
    );
    expect(result.current.liveApplied).toBe(false);
  });

  it("retries the deployment and refetches status on success, guarding duplicate clicks", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "failed" } } });
    let resolveRetry!: (value: { data: { state: "deploying" } }) => void;
    retryDeployment.mockReturnValueOnce(
      new Promise<{ data: { state: "deploying" } }>((resolve) => {
        resolveRetry = resolve;
      })
    );

    const { result } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.state).toBe("failed");

    act(() => {
      result.current.retry();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.isRetrying).toBe(true);
    expect(retryDeployment).toHaveBeenCalledTimes(1);
    expect(retryDeployment).toHaveBeenCalledWith("p1");

    act(() => {
      result.current.retry();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(retryDeployment).toHaveBeenCalledTimes(1);

    act(() => {
      resolveRetry({ data: { state: "deploying" } });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.isRetrying).toBe(false);
    expect(getDeployment).toHaveBeenCalledTimes(2);
  });

  it("surfaces a 409 duplicate-build message from the safe error path", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "failed" } } });
    retryDeployment.mockResolvedValue({ error: "A deployment is already in progress" });

    const { result } = renderHook(() => useDeploymentStatus("p1"), {
      wrapper: makeWrapper(makeClient()),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    act(() => {
      result.current.retry();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(toast.error).toHaveBeenCalledWith("A deployment is already in progress");
    expect(retryDeployment).toHaveBeenCalledTimes(1);
  });

  it("never claims live from local state — the hook follows the server response", async () => {
    getDeployment.mockResolvedValue({ data: { deployment: { state: "deploying" } } });
    const { result } = renderHook(
      () => useDeploymentStatus("p1", { initialDeployment: { state: "deploying" } }),
      { wrapper: makeWrapper(makeClient()) }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.state).toBe("deploying");
    expect(result.current.isPolling).toBe(true);
    expect(result.current.deployment?.state).not.toBe("live");
  });
});