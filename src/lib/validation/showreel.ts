import { z } from "zod";
import { stringSchema, optionalUrlSchema } from "./shared";

export const showreelCreateSchema = z.object({
  title: stringSchema,
  subtitle: stringSchema,
  videoUrl: z.string().url("Valid video URL is required"),
  thumbnailUrl: z.string().url("Valid thumbnail URL is required"),
  isActive: z.boolean().default(false),
  ctaText: stringSchema.optional(),
  ctaLink: z.string().default("/contact"),
});

export const showreelUpdateSchema = showreelCreateSchema.partial();

export type ShowreelCreateInput = z.infer<typeof showreelCreateSchema>;
export type ShowreelUpdateInput = z.infer<typeof showreelUpdateSchema>;

export const showreelDefaultValues: ShowreelCreateInput = {
  title: "",
  subtitle: "",
  videoUrl: "",
  thumbnailUrl: "",
  isActive: false,
  ctaText: undefined,
  ctaLink: "/contact",
};

export function createShowreelFormValues(existing?: Partial<ShowreelCreateInput>): ShowreelCreateInput {
  return {
    title: existing?.title || "",
    subtitle: existing?.subtitle || "",
    videoUrl: existing?.videoUrl || "",
    thumbnailUrl: existing?.thumbnailUrl || "",
    isActive: existing?.isActive || false,
    ctaText: existing?.ctaText,
    ctaLink: existing?.ctaLink || "/contact",
  };
}