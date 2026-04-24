import { z } from "zod";
import { bilingualStringSchema, contentStatusSchema, optionalUrlSchema, emptyBilingual, commaStringToArray, arrayToCommaString } from "./shared";

export const heroCreateSchema = z.object({
  headline: bilingualStringSchema,
  subheadline: bilingualStringSchema,
  primaryCTA: bilingualStringSchema,
  primaryCTALink: z.string().default("/contact"),
  secondaryCTA: bilingualStringSchema,
  secondaryCTALink: z.string().default("/projects"),
  posterImage: optionalUrlSchema,
  showreelVideo: optionalUrlSchema,
  status: contentStatusSchema.default("draft"),
});

export const heroUpdateSchema = heroCreateSchema.partial();

export type HeroCreateInput = z.infer<typeof heroCreateSchema>;
export type HeroUpdateInput = z.infer<typeof heroUpdateSchema>;

export const heroDefaultValues: HeroCreateInput = {
  headline: emptyBilingual(),
  subheadline: emptyBilingual(),
  primaryCTA: emptyBilingual(),
  primaryCTALink: "/contact",
  secondaryCTA: emptyBilingual(),
  secondaryCTALink: "/projects",
  posterImage: undefined,
  showreelVideo: undefined,
  status: "draft",
};

// Factory for creating initial form values from existing hero data
export function createHeroFormValues(existing?: Partial<HeroCreateInput>): HeroCreateInput {
  return {
    headline: existing?.headline || emptyBilingual(),
    subheadline: existing?.subheadline || emptyBilingual(),
    primaryCTA: existing?.primaryCTA || emptyBilingual(),
    primaryCTALink: existing?.primaryCTALink || "/contact",
    secondaryCTA: existing?.secondaryCTA || emptyBilingual(),
    secondaryCTALink: existing?.secondaryCTALink || "/projects",
    posterImage: existing?.posterImage,
    showreelVideo: existing?.showreelVideo,
    status: existing?.status || "draft",
  };
}