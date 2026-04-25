"use client";

import dynamic from "next/dynamic";
import AccessibilityWrapper from "@/components/layout/AccessibilityWrapper";

const LayoutWrapper = dynamic(() => import("@/components/layout/LayoutWrapper"), {
  ssr: false,
  loading: () => <div />,
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityWrapper>
      <LayoutWrapper>{children}</LayoutWrapper>
    </AccessibilityWrapper>
  );
}