"use client";

import { createContext, useContext } from "react";
import type { WorldContextValue } from "@/types/world";

export const WorldContext = createContext<WorldContextValue | null>(null);

export function useWorld(): WorldContextValue {
  const ctx = useContext(WorldContext);
  if (!ctx) {
    throw new Error("useWorld must be used within a WorldRoot");
  }
  return ctx;
}
