"use client";

import { useEffect, useRef, useCallback } from "react";
import { UseFormWatch, FieldValues } from "react-hook-form";

interface UseUnsavedChangesOptions<T extends FieldValues> {
  watch: UseFormWatch<T>;
  defaultValues: T;
  enabled?: boolean;
}

export function useUnsavedChanges<T extends FieldValues>({
  watch,
  defaultValues,
  enabled = true,
}: UseUnsavedChangesOptions<T>) {
  const isSubmittingRef = useRef(false);
  const initialValuesRef = useRef<T>(defaultValues);
  const hasChangesRef = useRef(false);
  const handleBeforeUnloadRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);

  useEffect(() => {
    initialValuesRef.current = defaultValues;
  }, [defaultValues]);

  const markAsSaved = useCallback(() => {
    const currentValues = watch();
    initialValuesRef.current = currentValues;
    hasChangesRef.current = false;
    isSubmittingRef.current = false;
    if (handleBeforeUnloadRef.current) {
      window.removeEventListener("beforeunload", handleBeforeUnloadRef.current);
      handleBeforeUnloadRef.current = null;
    }
  }, [watch]);

  const setSubmitting = useCallback((value: boolean) => {
    if (value) {
      initialValuesRef.current = watch();
    }
    isSubmittingRef.current = value;
  }, [watch]);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = watch((values) => {
      if (isSubmittingRef.current) return;

      const changed = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
      hasChangesRef.current = changed;

      if (changed && !handleBeforeUnloadRef.current) {
        const handler = (e: BeforeUnloadEvent) => {
          e.preventDefault();
          e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
          return "You have unsaved changes. Are you sure you want to leave?";
        };
        handleBeforeUnloadRef.current = handler;
        window.addEventListener("beforeunload", handler);
      } else if (!changed && handleBeforeUnloadRef.current) {
        window.removeEventListener("beforeunload", handleBeforeUnloadRef.current);
        handleBeforeUnloadRef.current = null;
      }
    });

    return () => {
      unsubscribe.unsubscribe();
      if (handleBeforeUnloadRef.current) {
        window.removeEventListener("beforeunload", handleBeforeUnloadRef.current);
        handleBeforeUnloadRef.current = null;
      }
    };
  }, [watch, enabled]);

  return {
    setSubmitting,
    markAsSaved,
    isSubmittingRef,
  };
}