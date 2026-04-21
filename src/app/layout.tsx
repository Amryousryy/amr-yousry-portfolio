import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "Amr Yousry | Full-Stack Developer & AI Integrator",
  description: "Full-Stack Developer & AI Integration Specialist | Content Creator | Digital Marketer. Building creative digital experiences in Egypt.",
  keywords: ["Full-Stack Developer", "AI Integration", "React", "Next.js", "Three.js", "GSAP", "Portfolio", "Amr Yousry", "Egypt"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500,600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-satoshi: 'Satoshi', sans-serif;
            --font-general-sans: 'General Sans', sans-serif;
          }
        `}} />
      </head>
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-background focus:px-4 focus:py-2 rounded-full">
          Skip to content
        </a>
        <div className="noise-bg" aria-hidden="true" />
        <LoadingScreen />
        <SmoothScroll />
        <CustomCursor />
        <Navbar />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
