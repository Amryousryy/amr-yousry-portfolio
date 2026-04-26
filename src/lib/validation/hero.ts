import { z } from "zod";
import { stringSchema, contentStatusSchema, optionalUrlSchema, commaStringToArray, arrayToCommaString, createEmptyProjectSection } from "./shared";

export const heroCreateSchema = z.object({
  headline: stringSchema,
  subheadline: stringSchema,
  primaryCTA: stringSchema,
  primaryCTALink: z.string().default("/contact"),
  secondaryCTA: stringSchema,
  secondaryCTALink: z.string().default("/projects"),
  posterImage: optionalUrlSchema,
  showreelVideo: optionalUrlSchema,
  status: contentStatusSchema.default("draft"),
});

export const heroUpdateSchema = heroCreateSchema.partial();

export type HeroCreateInput = z.infer<typeof heroCreateSchema>;
export type HeroUpdateInput = z.infer<typeof heroUpdateSchema>;

export const heroDefaultValues: HeroCreateInput = {
  headline: "",
  subheadline: "",
  primaryCTA: "",
  primaryCTALink: "/contact",
  secondaryCTA: "",
  secondaryCTALink: "/projects",
  posterImage: undefined,
  showreelVideo: undefined,
  status: "draft",
};

export function createHeroFormValues(existing?: Partial<HeroCreateInput>): HeroCreateInput {
  return {
    headline: existing?.headline || "",
    subheadline: existing?.subheadline || "",
    primaryCTA: existing?.primaryCTA || "",
    primaryCTALink: existing?.primaryCTALink || "/contact",
    secondaryCTA: existing?.secondaryCTA || "",
    secondaryCTALink: existing?.secondaryCTALink || "/projects",
    posterImage: existing?.posterImage,
    showreelVideo: existing?.showreelVideo,
    status: existing?.status || "draft",
  };
}