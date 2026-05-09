import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "@/styles/globals.css";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
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
  icons: {
    icon: "/images/logo.svg",
  },
};

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${inter.variable}`}>
      <body className="pixel-grid min-h-screen flex flex-col">
        <Navbar />

        <main className="pt-20 flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
