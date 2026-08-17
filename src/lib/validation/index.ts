export { 
  projectCreateSchema, 
  projectUpdateSchema, 
  projectDefaultValues,
  generateSlugFromTitle,
} from "./project";
export type { ProjectCreateInput, ProjectUpdateInput } from "./project";

export { 
  contentCreateSchema,
  contentUpdateSchema,
  contentDefaultValues,
} from "./settings";
export type { ContentCreateInput } from "./settings";

export { 
  heroCreateSchema,
  heroUpdateSchema,
} from "./hero-settings";
export type { HeroCreateInput, HeroUpdateInput } from "./hero-settings";

export {
  contentStatusSchema,
  stringSchema,
  optionalStringSchema,
  mediaArraySchema,
  seoSchema,
  safeUrlSchema,
  optionalEmailSchema,
  normalizeSlug,
  createEmptyProjectSection,
  toEnglishOnly,
} from "./shared";
export type { MediaItem, MediaArray, SEO, ContentStatus } from "./shared";