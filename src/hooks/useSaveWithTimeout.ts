"use client";

import { useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

const SAVE_TIMEOUT_MS = 30_000;

interface UseSaveWithTimeoutOptions {
  onTimeout?: () => void;
}

interface UseSaveWithTimeoutReturn {
  saveTimeoutConfig: {
    onMutate: () => void;
    onSuccess: () => void;
    onError: () => void;
  };
  syncResetMutation: (reset: () => void) => void;
}

export function useSaveWithTimeout(
  options?: UseSaveWithTimeoutOptions,
): UseSaveWithTimeoutReturn {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const resetMutationRef = useRef<() => void>(() => {});

  const clearSaveTimeout = useCallback(() => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearSaveTimeout();
    };
  }, [clearSaveTimeout]);

  const syncResetMutation = useCallback(
    (reset: () => void) => {
      resetMutationRef.current = reset;
    },
    [],
  );

  const saveTimeoutConfig = {
    onMutate: () => {
      clearSaveTimeout();
      saveTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        saveTimeoutRef.current = null;
        resetMutationRef.current();
        options?.onTimeout?.();
        toast.error("Save timed out. Please try again.");
      }, SAVE_TIMEOUT_MS);
    },
    onSuccess: () => {
      clearSaveTimeout();
    },
    onError: () => {
      clearSaveTimeout();
    },
  };

  return {
    saveTimeoutConfig,
    syncResetMutation,
  };
}
