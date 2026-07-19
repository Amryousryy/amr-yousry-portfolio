/**
 * Creative Engine — Ecosystem Provider
 * 
 * Wraps the application with the reactive ecosystem.
 * The ecosystem runs continuously, regardless of user interaction.
 */

"use client";

import { type ReactNode } from "react";
import { EcosystemContext } from "@/lib/creative-engine/context";
import { useCreativeEngine } from "@/lib/creative-engine/ecosystem";

export function EcosystemProvider({ children }: { children: ReactNode }) {
  const ecosystem = useCreativeEngine();

  return (
    <EcosystemContext.Provider value={ecosystem}>
      {children}
    </EcosystemContext.Provider>
  );
}
