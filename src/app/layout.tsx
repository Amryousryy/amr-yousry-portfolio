import type { Metadata } from "next";
import { Inter, Sora, VT323 } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Footer from "@/components/ui/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

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
    <html lang="en" className={`${inter.variable} ${sora.variable} ${vt323.variable} selection:bg-accent selection:text-background`}>
      <body className="antialiased bg-background text-foreground">
        <SessionProviderWrapper>
          <QueryProvider>
            <Toaster richColors theme="dark" position="top-right" />
            <LayoutWrapper>{children}</LayoutWrapper>
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}