"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface ToastOptions {
  duration?: number;
}

export function useAdminToast() {
  const success = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration ?? 3000,
      style: {
        background: "#10b981",
        color: "#fff",
        border: "none",
      },
    });
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration ?? 5000,
      style: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
      },
    });
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration ?? 3000,
      style: {
        background: "#3b82f6",
        color: "#fff",
        border: "none",
      },
    });
  }, []);

  return { success, error, info };
}

export const toastMessages = {
  // Create operations
  created: (entity: string) => `${entity} created successfully`,
  createFailed: (entity: string) => `Failed to create ${entity}`,

  // Update operations  
  updated: (entity: string) => `${entity} updated successfully`,
  updateFailed: (entity: string) => `Failed to update ${entity}`,

  // Delete operations
  deleted: (entity: string) => `${entity} deleted`,
  deleteFailed: (entity: string) => `Failed to delete ${entity}`,

  // Generic
  saveFailed: "Failed to save changes",
  loadFailed: "Failed to load data",
  networkError: "Network error. Please check your connection.",
};