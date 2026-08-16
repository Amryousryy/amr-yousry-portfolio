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
export type { ContentCreateInput, ContentUpdateInput } from "./settings";

export { 
  heroCreateSchema,
  heroUpdateSchema,
} from "./hero-settings";
export type { HeroCreateInput, HeroUpdateInput } from "./hero-settings";

export {
  contentStatusSchema,
  stringSchema,
  optionalStringSchema,
  mediaItemSchema,
  mediaArraySchema,
  seoSchema,
  optionalUrlSchema,
  safeUrlSchema,
  optionalEmailSchema,
  normalizeSlug,
  slugSchema,
  createEmptyMediaItem,
  createEmptyProjectSection,
  stringToStringArray,
  stringArrayToString,
  commaStringToArray,
  arrayToCommaString,
  toEnglishOnly,
  toEnglishOnlyArray,
} from "./shared";
export type { MediaItem, MediaArray, SEO, ContentStatus } from "./shared";