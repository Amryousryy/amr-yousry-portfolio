import { z } from "zod";

export const leadCreateSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Valid email is required").trim(),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  message: z.string().min(1, "Message is required").trim(),
  offerType: z.enum(["general", "free_audit"]).default("general"),
  status: z.enum(["new", "contacted", "qualified", "closed"]).default("new"),
});

export const leadPublicSchema = leadCreateSchema.omit({ offerType: true, status: true });

export const leadUpdateSchema = leadCreateSchema.partial();

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadPublicInput = z.infer<typeof leadPublicSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const leadDefaultValues: LeadPublicInput = {
  name: "",
  email: "",
  projectType: "Commercial / Ad",
  message: "",
};