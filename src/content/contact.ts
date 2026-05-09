import { socialLinks, socialLinksArray } from "@/data/social-links";

export const contactContent = {
  heading: "START YOUR\nPROJECT.",
  subheading: "Have a project, campaign, brand, video, or digital product in mind? Send the mission brief and I'll help you shape the right creative direction.",
  form: {
    labels: {
      name: "Full Name",
      email: "Email Address",
      service: "Service Required",
      message: "Project Brief",
      submit: "Start Project",
    },
    placeholders: {
      name: "Your name",
      email: "your@email.com",
      message: "Tell me about your vision and goals...",
    },
    services: [
      "Creative Direction",
      "Brand Identity",
      "Video Editing",
      "Motion Graphics",
      "UX/UI Design",
      "AI Ads",
      "Other",
    ],
  },
  socials: socialLinksArray,
  whatsapp: {
    label: "DIRECT MESSAGE",
    number: "201021213533",
  },
};
