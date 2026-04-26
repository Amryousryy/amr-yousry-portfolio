import { z } from "zod";
import { normalizeSlug } from "./shared";

export const testimonialCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  company: z.string().min(1, "Company is required").max(100),
  quote: z.string().min(10, "Quote must be at least 10 characters").max(500),
  projectSlug: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).default(5),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  displayOrder: z.number().int().default(0),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

export const testimonialDefaultValues = {
  name: "",
  role: "",
  company: "",
  quote: "",
  projectSlug: "",
  avatar: "",
  rating: 5,
  isFeatured: false,
  status: "draft" as "draft" | "published",
  displayOrder: 0,
};