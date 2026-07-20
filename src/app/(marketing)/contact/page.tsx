import type { Metadata } from "next";
import ContactSection from "@/components/sections/contact";
import { getPublishedContactContent } from "@/lib/public-contact-content";

export const metadata: Metadata = {
  title: "Contact — Amr Yousry",
  alternates: {
    canonical: "https://amr-yousry-portfolio.vercel.app/contact",
  },
};

export const revalidate = 60;

export default async function ContactPage() {
  const contactData = await getPublishedContactContent();
  return <ContactSection contactData={contactData} />;
}
