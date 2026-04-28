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
  filterCreateSchema, 
  filterUpdateSchema, 
  filterDefaultValues,
  createFilterFormValues,
} from "./filter";
export type { FilterCreateInput, FilterUpdateInput } from "./filter";

export { 
  heroCreateSchema, 
  heroUpdateSchema, 
  heroDefaultValues,
  createHeroFormValues,
} from "./hero";
export type { HeroCreateInput, HeroUpdateInput } from "./hero";

export { 
  showreelCreateSchema, 
  showreelUpdateSchema, 
  showreelDefaultValues,
  createShowreelFormValues,
} from "./showreel";
export type { ShowreelCreateInput, ShowreelUpdateInput } from "./showreel";

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
  leadCreateSchema, 
  leadPublicSchema, 
  leadUpdateSchema,
  leadDefaultValues,
} from "./lead";
export type { LeadCreateInput, LeadPublicInput, LeadUpdateInput } from "./lead";

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