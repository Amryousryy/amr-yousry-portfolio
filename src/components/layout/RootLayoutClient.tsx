"use client";

import dynamic from "next/dynamic";

const LayoutWrapper = dynamic(() => import("@/components/layout/LayoutWrapper"), {
  ssr: false,
  loading: () => <div />,
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}