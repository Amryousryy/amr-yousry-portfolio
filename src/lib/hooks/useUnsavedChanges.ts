"use client";

import { useEffect, useRef, useCallback } from "react";
import { UseFormWatch, UseFormReset, FieldValues } from "react-hook-form";

interface UseUnsavedChangesOptions<T extends FieldValues> {
  watch: UseFormWatch<T>;
  reset: UseFormReset<T>;
  defaultValues: T;
  enabled?: boolean;
}

export function useUnsavedChanges<T extends FieldValues>({
  watch,
  reset,
  defaultValues,
  enabled = true,
}: UseUnsavedChangesOptions<T>) {
  const isSubmittingRef = useRef(false);
  const initialValuesRef = useRef<T>(defaultValues);
  const isEnabledRef = useRef(enabled);

  useEffect(() => {
    initialValuesRef.current = defaultValues;
  }, [defaultValues]);

  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);

  const markAsSaved = useCallback(() => {
    const currentValues = watch();
    initialValuesRef.current = currentValues;
    isSubmittingRef.current = false;
  }, [watch]);

  const setSubmitting = useCallback((value: boolean) => {
    if (value) {
      initialValuesRef.current = watch();
    }
    isSubmittingRef.current = value;
  }, [watch]);

  useEffect(() => {
    if (!isEnabledRef.current) return;

    const unsubscribe = watch((values) => {
      if (isSubmittingRef.current) return;
      
      const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
      
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (hasChanges) {
          e.preventDefault();
          e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
          return "You have unsaved changes. Are you sure you want to leave?";
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    });

    return () => {
      unsubscribe.unsubscribe();
      window.removeEventListener("beforeunload", () => {});
    };
  }, [watch]);

  return {
    setSubmitting,
    markAsSaved,
    isSubmittingRef,
  };
}