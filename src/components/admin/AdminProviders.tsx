"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          className: "font-[family-name:var(--font-modern)]",
        }}
      />
    </QueryClientProvider>
  );
}
