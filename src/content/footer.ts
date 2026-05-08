import { socialLinksArray } from "@/data/social-links";

export const footerContent = {
  wordmark: "AMR YOUSRY",
  tagline: "Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.",
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/projects" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  socials: socialLinksArray,
  copyright: `© ${new Date().getFullYear()} Amr Yousry. All rights reserved.`,
};
