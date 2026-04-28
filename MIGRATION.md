# Migration Notes - Phase 3 Refactor

## Overview
This document outlines changes that may require data migrations when deploying the Phase 3 refactor to an existing production environment.

## Breaking Changes Summary

### 1. Filter Model - Field Renaming
**Status**: Breaking change requires migration

| Old Field | New Field |
|-----------|----------|
| `active` | `isActive` |
| `order` | `displayOrder` |

**Affected**: All Filter documents in MongoDB

**Migration Strategy**:
```javascript
// Run in MongoDB shell or migration script
db.filters.updateMany(
  {},
  {
    $rename: {
      "active": "isActive",
      "order": "displayOrder"
    }
  }
)
```

**Rollback**: Reverse the rename operation if needed

---

### 2. Analytics Model - Timestamp Consolidation  
**Status**: Breaking change requires migration

| Old Field | New Field |
|-----------|----------|
| `timestamp` | (removed, use `createdAt`) |

**Affected**: All Analytics documents

**Migration Strategy**:
```javascript
// If you need the timestamp data, migrate it to createdAt first
db.analytics.find({ timestamp: { $exists: true } }).forEach(doc => {
  if (!doc.createdAt && doc.timestamp) {
    db.analytics.updateOne(
      { _id: doc._id },
      { $set: { createdAt: doc.timestamp }, $unset: { timestamp: "" } }
    );
  }
});
```

**Note**: If no historical timestamp data is critical, you can simply:
```javascript
db.analytics.updateMany({}, { $unset: { timestamp: "" } })
```

---

### 3. Lead Model - Email Uniqueness Removed
**Status**: Non-breaking (no migration needed)

The unique constraint on `email` was removed. Existing unique emails are unaffected, but new submissions from the same email are now allowed.

**No action required**.

---

### 4. Showreel Model - Pre-save Hook
**Status**: Non-breaking (no migration needed)

The pre-save hook behavior is unchanged logically. Code was only refactored for type safety.

**No action required**.

---

### 5. Settings Model - New Unified Model
**Status**: New model, no migration needed

A new `UnifiedSettings` model was created alongside the existing `Settings` model.

**Recommendation**: 
- Use existing `Settings` model during transition
- Plan migration to `UnifiedSettings` in a future phase

---

## Migration Checklist

- [ ] Backup MongoDB database before migration
- [ ] Run Filter field rename migration
- [ ] Handle Analytics timestamp migration (if data is critical)
- [ ] Verify application functionality after migration

---

## Testing Recommendations

1. **Filter Contract Test**
   - Query filters and verify `isActive` and `displayOrder` fields are accessible
   - Verify filter API returns correctly

2. **Slug Normalization Test**
   - Create a new project with uppercase title
   - Verify slug is automatically normalized to lowercase

3. **Lead Submission Test**
   - Submit multiple leads from the same email
   - Verify both submissions succeed

4. **Settings Test**
   - Verify existing settings load correctly with new types

---

## Rollback Plan

If issues occur:

1. **Filter**: Reverse the rename
2. **Analytics**: Restore the `timestamp` field if needed  
3. **Lead**: Re-add unique index if required:
   ```javascript
   db.leads.createIndex({ email: 1 }, { unique: true })
   ```

---

## Next Phase Recommendations

1. **Gradual Migration**: Consider migrating one model at a time with feature flags
2. **Monitoring**: Monitor error logs closely after deployment
3. **Admin UI**: Update admin interface to use new field names
4. **API Updates**: Ensure all API routes use new validation schemas

---

## Contact

For migration assistance or questions, refer to the canonical contracts in:
- `src/types/bilingual.ts` - Bilingual utilities
- `src/lib/validations.ts` - Zod schemas
- `src/models/` - Mongoose models