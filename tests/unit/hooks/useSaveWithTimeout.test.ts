import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSaveWithTimeout } from "@/hooks/useSaveWithTimeout";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

describe("useSaveWithTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns saveTimeoutConfig and syncResetMutation", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    expect(result.current.saveTimeoutConfig).toBeDefined();
    expect(result.current.saveTimeoutConfig.onMutate).toBeInstanceOf(Function);
    expect(result.current.saveTimeoutConfig.onSuccess).toBeInstanceOf(Function);
    expect(result.current.saveTimeoutConfig.onError).toBeInstanceOf(Function);
    expect(result.current.syncResetMutation).toBeInstanceOf(Function);
  });

  it("schedules a timeout on onMutate", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    act(() => {
      result.current.syncResetMutation(vi.fn());
      result.current.saveTimeoutConfig.onMutate();
    });
    expect(toast.error).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(29_999);
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("triggers timeout after 30 seconds and calls toast.error", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(resetFn).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Save timed out. Please try again.");
  });

  it("calls onTimeout callback when timeout fires", () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useSaveWithTimeout({ onTimeout }));
    act(() => {
      result.current.syncResetMutation(vi.fn());
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("clears timeout on onSuccess", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      result.current.saveTimeoutConfig.onSuccess();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(resetFn).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("clears timeout on onError", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      result.current.saveTimeoutConfig.onError();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(resetFn).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("clears previous timeout when onMutate is called again", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    act(() => {
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(resetFn).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(resetFn).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Save timed out. Please try again.");
  });

  it("cleans up timeout on unmount", () => {
    const { result, unmount } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(resetFn).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("does not fire timeout callback after unmount (mounted protection)", () => {
    const onTimeout = vi.fn();
    const { result, unmount } = renderHook(() => useSaveWithTimeout({ onTimeout }));
    act(() => {
      result.current.syncResetMutation(vi.fn());
      result.current.saveTimeoutConfig.onMutate();
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(onTimeout).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("works without onTimeout option", () => {
    const { result } = renderHook(() => useSaveWithTimeout());
    const resetFn = vi.fn();
    act(() => {
      result.current.syncResetMutation(resetFn);
      result.current.saveTimeoutConfig.onMutate();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(resetFn).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Save timed out. Please try again.");
  });
});
