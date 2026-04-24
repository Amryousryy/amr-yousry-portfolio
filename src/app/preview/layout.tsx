import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Mode",
  robots: "noindex, nofollow",
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}