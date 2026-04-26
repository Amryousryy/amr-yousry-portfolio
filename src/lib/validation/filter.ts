import { z } from "zod";
import { stringSchema, normalizeSlug } from "./shared";

export const filterCreateSchema = z.object({
  name: stringSchema,
  slug: z.string().min(1, "Slug is required").transform(normalizeSlug),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const filterUpdateSchema = filterCreateSchema.partial();

export type FilterCreateInput = z.infer<typeof filterCreateSchema>;
export type FilterUpdateInput = z.infer<typeof filterUpdateSchema>;

export const filterDefaultValues: FilterCreateInput = {
  name: "",
  slug: "",
  displayOrder: 0,
  isActive: true,
};

export function createFilterFormValues(existing?: Partial<FilterCreateInput>): FilterCreateInput {
  return {
    name: existing?.name || "",
    slug: existing?.slug || "",
    displayOrder: existing?.displayOrder || 0,
    isActive: existing?.isActive ?? true,
  };
}