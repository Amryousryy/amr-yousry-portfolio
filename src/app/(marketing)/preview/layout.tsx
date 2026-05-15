import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Mode",
  description: "Preview of unpublished content.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Preview Mode | Amr Yousry",
    description: "Preview of unpublished content.",
    url: "https://amr-yousry-portfolio.vercel.app/preview",
    siteName: "Amr Yousry Portfolio",
    images: [
      {
        url: "/images/meta/og-preview-v6.jpg",
        width: 1200,
        height: 630,
        alt: "Amr Yousry Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preview Mode | Amr Yousry",
    description: "Preview of unpublished content.",
    images: ["/images/meta/og-preview-v6.jpg"],
  },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}