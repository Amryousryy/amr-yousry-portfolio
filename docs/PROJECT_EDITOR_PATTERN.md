# ProjectEditor - Canonical Admin Form Pattern

## Overview
This document describes the behavior rules for the canonical ProjectEditor form implementation. All subsequent admin forms should follow this pattern.

## Files
- Form: `src/components/admin/ProjectEditor.tsx`
- Schema: `src/lib/validation/project.ts`
- Shared: `src/lib/validation/shared.ts`
- Index: `src/lib/validation/index.ts`

## Behavior Rules

### 1. Create Mode Defaults
```typescript
const projectDefaultValues: ProjectCreateInput = {
  slug: "",
  title: { en: "", ar: "" },
  shortDescription: { en: "", ar: "" },
  fullDescription: { en: "", ar: "" },
  category: "",
  image: "",
  video: undefined,
  featured: false,
  status: "draft",
  displayOrder: 0,
  year: "2024",
  clientName: "",
  seo: { title: "", description: "", keywords: [] },
  gallery: [],
  tags: [],
  sections: [],
};
```

### 2. Edit Mode Initialization
```typescript
// Use createProjectFormValues factory
const formValues = createProjectFormValues(existingProject);
reset(formValues);
```

### 3. Slug Auto-Generation Behavior

**Create Mode:**
- Auto-generates from `title.en` when title changes AND slug is empty
- Uses `generateSlugFromTitle()` function
```typescript
useEffect(() => {
  if (!isEditMode && watchedTitleEn && !watchedSlug) {
    const newSlug = generateSlugFromTitle(watchedTitleEn);
    setValue("slug", newSlug);
  }
}, [watchedTitleEn, isEditMode, watchedSlug, setValue]);
```

**Edit Mode:**
- Never auto-generates slug
- Preserves existing slug value
- Only allows manual edit

### 4. Section/Media Default Creation
```typescript
// createEmptyProjectSection() factory
{
  id: crypto.randomUUID(),
  title: { en: "", ar: "" },
  content: { en: "", ar: "" },
  media: [],
}
```

### 5. Array Handling

| Array | Implementation | Transformation |
|-------|--------------|---------------|
| sections | useFieldArray | Full CRUD with nested media |
| tags | Simple input + Controller | `commaStringToArray()` / `arrayToCommaString()` |
| gallery | Cloudinary + Controller | Direct append to array |

### 6. Payload Mapping
```typescript
// mapProjectFormToPayload() - single source of truth
function mapProjectFormToPayload(formData: Partial<ProjectCreateInput>): Partial<ProjectCreateInput> {
  return {
    ...formData,
    // Tags/gallery already transformed by Controller
    // Sections already properly formatted by useFieldArray
  };
}
```

## Shared Factories (Reusable)

All schemas share these factories from `shared.ts`:

```typescript
// Value factories
emptyBilingual()                          // { en: "", ar: "" }
createEmptyMediaItem()                     // { type: "image", url: "" }
createEmptyProjectSection()                // Section with id, title, content, media

// Array helpers
commaStringToArray(input: string): string[]
arrayToCommaString(values: string[]): string

// Slug helpers
normalizeSlug(input: string): string
generateSlugFromTitle(title: string): string
```

## Form Factory Pattern

Each entity should have:

1. **Create Schema** - Full validation
2. **Update Schema** - `.partial()` of create schema
3. **Default Values** - For useForm defaultValues
4. **Form Values Factory** - `create{Entity}FormValues(existing?)`
5. **Payload Mapper** - If shape differs from API

Example:
```typescript
// hero.ts
heroCreateSchema
heroUpdateSchema  
heroDefaultValues
createHeroFormValues()  // NEW - factory for edit mode init
```

## Error Display Pattern

```typescript
function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

// Usage
{getFieldError(errors, "title.en") && (
  <p className="text-[10px] text-red-500">{getFieldError(errors, "title.en")}</p>
)}
```

## Subsequent Forms to Implement

Apply same pattern to:
1. Settings form
2. Hero form
3. Showreel form
4. Filter form