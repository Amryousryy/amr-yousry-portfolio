"use client";

import { useCallback, useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      setTimer(setTimeout(() => callback(...args), delay));
    },
    [callback, delay, timer]
  ) as T;
}
