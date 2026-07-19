"use client";

import { type ReactNode } from "react";
import { EcosystemProvider } from "@/components/creative-engine/EcosystemProvider";

export function EcosystemRoot({ children }: { children: ReactNode }) {
  return <EcosystemProvider>{children}</EcosystemProvider>;
}
