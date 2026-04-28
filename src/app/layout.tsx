import type { Metadata } from "next";
import { Inter, Sora, VT323, Cairo, Press_Start_2P } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "700"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amr Yousry | Creative Strategist & Video Editor",
  description: "I turn content into clients for brands. Creative strategist & video editor helping brands grow through high-converting content.",
  keywords: ["Video Editing", "Content Strategy", "UGC Ads", "Brand Growth", "Amr Yousry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${vt323.variable} ${cairo.variable} ${pressStart2P.variable} selection:bg-accent selection:text-background`}>
      <body className="antialiased bg-background text-foreground">
        <SessionProviderWrapper>
          <QueryProvider>
            <Toaster richColors theme="dark" position="top-right" />
            <RootLayoutClient>{children}</RootLayoutClient>
            <AnalyticsProvider />
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}