import { contactContent } from "./contact";

export const footerContent = {
  wordmark: "AMR YOUSRY",
  tagline: "High-impact visual storytelling and cinematic design for brands that demand more than just aesthetics.",
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/projects" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  socials: contactContent.socials,
  copyright: `© ${new Date().getFullYear()} Amr Yousry. All rights reserved.`,
};
