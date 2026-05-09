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
  metadataBase: new URL("https://amr-yousry-portfolio.vercel.app"),
  title: {
    default: "Amr Yousry | Senior Multimedia Designer",
    template: "%s | Amr Yousry",
  },
  description:
    "Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.",
  openGraph: {
    type: "website",
    url: "https://amr-yousry-portfolio.vercel.app",
    siteName: "Amr Yousry Portfolio",
    title: "Amr Yousry | Senior Multimedia Designer",
    description:
      "Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.",
    images: [
      {
        url: "/images/meta/og-preview-v6.jpg",
        width: 1200,
        height: 630,
        alt: "Amr Yousry | Senior Multimedia Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amr Yousry | Senior Multimedia Designer",
    description:
      "Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.",
    images: ["/images/meta/og-preview-v6.jpg"],
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
