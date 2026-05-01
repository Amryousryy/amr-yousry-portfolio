import type { Metadata } from "next";
import { Pixelify_Sans, Inter } from "next/font/google";
import "@/styles/globals.css";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-modern",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amr Yousry | Cinematic Stories & Creative Direction",
  description: "A premium creative portfolio focused on high-impact video production, cinematic storytelling, and design results.",
};

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelify.variable} ${inter.variable}`}>
      <body className="pixel-grid min-h-screen flex flex-col">
        <Navbar />
        
        {/* Placeholder for Custom Cursor */}
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]" />

        <main className="pt-20 flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
