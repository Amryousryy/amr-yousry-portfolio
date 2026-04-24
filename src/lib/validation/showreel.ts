import { z } from "zod";
import { bilingualStringSchema, optionalBilingualStringSchema, optionalUrlSchema, emptyBilingual } from "./shared";

export const showreelCreateSchema = z.object({
  title: bilingualStringSchema,
  subtitle: bilingualStringSchema,
  videoUrl: z.string().url("Valid video URL is required"),
  thumbnailUrl: z.string().url("Valid thumbnail URL is required"),
  isActive: z.boolean().default(false),
  ctaText: optionalBilingualStringSchema,
  ctaLink: z.string().default("/contact"),
});

export const showreelUpdateSchema = showreelCreateSchema.partial();

export type ShowreelCreateInput = z.infer<typeof showreelCreateSchema>;
export type ShowreelUpdateInput = z.infer<typeof showreelUpdateSchema>;

export const showreelDefaultValues: ShowreelCreateInput = {
  title: emptyBilingual(),
  subtitle: emptyBilingual(),
  videoUrl: "",
  thumbnailUrl: "",
  isActive: false,
  ctaText: undefined,
  ctaLink: "/contact",
};

// Factory for creating initial form values from existing showreel data
export function createShowreelFormValues(existing?: Partial<ShowreelCreateInput>): ShowreelCreateInput {
  return {
    title: existing?.title || emptyBilingual(),
    subtitle: existing?.subtitle || emptyBilingual(),
    videoUrl: existing?.videoUrl || "",
    thumbnailUrl: existing?.thumbnailUrl || "",
    isActive: existing?.isActive || false,
    ctaText: existing?.ctaText,
    ctaLink: existing?.ctaLink || "/contact",
  };
}