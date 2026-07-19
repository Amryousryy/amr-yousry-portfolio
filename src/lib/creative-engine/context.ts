/**
 * Creative Engine — Ecosystem Context
 * 
 * Provides ecosystem state to all Creative Engine components.
 * Components read state; only the orchestrator writes it.
 */

"use client";

import { createContext, useContext } from "react";
import type { useCreativeEngine } from "./ecosystem";

type EcosystemContextValue = ReturnType<typeof useCreativeEngine>;

export const EcosystemContext = createContext<EcosystemContextValue | null>(null);

export function useEcosystem(): EcosystemContextValue {
  const ctx = useContext(EcosystemContext);
  if (!ctx) {
    throw new Error("useEcosystem must be used within <EcosystemProvider>");
  }
  return ctx;
}
