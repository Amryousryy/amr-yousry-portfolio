export { 
  projectCreateSchema, 
  projectUpdateSchema, 
  projectDefaultValues,
  createProjectFormValues,
  generateSlugFromTitle,
  shouldAutoGenerateSlug,
  mapProjectFormToPayload,
} from "./project";
export type { ProjectCreateInput, ProjectUpdateInput } from "./project";

export { 
  settingsCreateSchema, 
  settingsUpdateSchema, 
  siteContentSchema,
  contentCreateSchema,
  contentUpdateSchema,
  contentDefaultValues,
  createContentFormValues,
} from "./settings";
export type { SettingsCreateInput, SettingsUpdateInput, ContentCreateInput, ContentUpdateInput } from "./settings";

export { 
  contentStatusSchema,
  stringSchema,
  mediaItemSchema,
  mediaArraySchema,
  seoSchema,
  optionalUrlSchema,
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