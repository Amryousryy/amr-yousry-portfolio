"use client";

export default function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-accent focus:text-background focus:font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        Skip to main content
      </a>
      {children}
    </>
  );
}