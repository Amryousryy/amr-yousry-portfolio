import { z } from "zod";
import { stringSchema, contentStatusSchema } from "./shared";

export const heroCreateSchema = z.object({
  headline: stringSchema,
  subheadline: stringSchema,
  primaryCTA: stringSchema,
  primaryCTALink: z.string().min(1, "Primary CTA link is required"),
  secondaryCTA: stringSchema,
  secondaryCTALink: z.string().min(1, "Secondary CTA link is required"),
  posterImage: z.string().optional().default(""),
  showreelVideo: z.string().optional().default(""),
  status: contentStatusSchema.default("draft"),
});

export const heroUpdateSchema = heroCreateSchema.partial();

export type HeroCreateInput = z.infer<typeof heroCreateSchema>;
export type HeroUpdateInput = z.infer<typeof heroUpdateSchema>;

export const heroDefaultValues: HeroCreateInput = {
  headline: "",
  subheadline: "",
  primaryCTA: "",
  primaryCTALink: "",
  secondaryCTA: "",
  secondaryCTALink: "",
  posterImage: "",
  showreelVideo: "",
  status: "draft",
};
