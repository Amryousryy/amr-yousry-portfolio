# BEHAVIOR ENFORCEMENT FRAMEWORK

**Version:** 1.0  
**Status:** Active  
**Sprint:** 06  
**Last Updated:** 2026-07-19

---

## Overview

The Behavior Enforcement Framework transforms behavioral governance into enforceable engineering standards. It ensures all future implementations comply with the approved Motion Platform.

---

## Enforcement Mechanisms

### 1. ESLint Plugin (`eslint-plugin-behavior`)

Located at `eslint-plugin/`, this plugin provides four rules:

| Rule | Severity | Description |
|---|---|---|
| `behavior/no-direct-animate` | warn | Detects direct `.animate()` calls outside Behavior API hooks |
| `behavior/no-inline-animation` | warn | Detects inline `animation:` styles on elements |
| `behavior/no-unauthorized-animation-lib` | error | Detects unauthorized animation library imports |
| `behavior/no-behavior-api-bypass` | error | Detects Behavior API bypasses |

**Note:** The plugin is local (not published to npm). Configure in `eslint.config.mjs` or `.eslintrc.js` as needed.

### 2. Validation Script (`scripts/validate-behavior.js`)

Run manually or in CI to scan the entire `src/` directory:

```bash
npm run validate:behavior
```

**Exit codes:**
- `0` — All checks passed
- `1` — Violations found

**Output:** Lists all violations with file, line, rule, and message.

### 3. Exception Registry (`docs/behavior-exceptions.json`)

Documents all approved exceptions to the enforcement rules. Every exception must include:

| Field | Required | Description |
|---|---|---|
| `id` | ✓ | Unique identifier (EX-XXX) |
| `file` | ✓ | Relative path to the file |
| `reason` | ✓ | Why this exception exists |
| `evidence` | ✓ | Technical justification |
| `scope` | ✓ | What specifically is exempt |
| `owner` | ✓ | Team or individual responsible |
| `reviewStatus` | ✓ | `approved`, `pending`, `expired` |
| `approvedBy` | ✓ | Who approved it |
| `approvedDate` | ✓ | When it was approved |
| `expirationDate` | — | When it expires (null = permanent) |
| `reviewCycle` | ✓ | `quarterly`, `annually`, `none` |
| `notes` | — | Additional context |

---

## Workflow Integration

### Development

1. ESLint rules run in real-time in supported editors
2. Violations appear as warnings or errors
3. Developers fix violations before committing

### Pull Request Review

1. CI runs `npm run validate:behavior`
2. Any violations block the PR
3. Exceptions must be documented in `behavior-exceptions.json`

### Continuous Integration

Add to CI pipeline:

```yaml
- name: Validate Behavior API
  run: npm run validate:behavior
```

### Release Verification

1. Run full validation before release
2. Verify no new violations introduced
3. Confirm all exceptions are documented

---

## Adding a New Exception

To add a new approved exception:

1. **Document the exception** in `docs/behavior-exceptions.json`:
   - Provide a unique ID (EX-XXX)
   - Document the reason, evidence, and scope
   - Assign an owner
   - Set review status to `approved`

2. **Update the ESLint rules** if needed (e.g., add file to exclusion list)

3. **Request approval** from the Platform Architecture owner

4. **Set review cycle** (quarterly recommended)

---

## Violation Response

| Violation Type | Response |
|---|---|
| Direct `.animate()` call | Refactor to use Behavior API hook |
| Inline animation style | Refactor to use Behavior API hook |
| Unauthorized library import | Remove dependency, use Behavior API |
| Behavior API bypass | Refactor to use approved hook |

---

## Exceptions Registry (Current)

| ID | File | Reason | Status |
|---|---|---|---|
| EX-001 | `Marquee.tsx` | No scroll/translate primitive in Behavior API | Approved |
| EX-002 | `loading.tsx` | Deterministic progress fill optimal in CSS | Approved |
| EX-003 | `(marketing)/loading.tsx` | Deterministic progress fill optimal in CSS | Approved |
| EX-004 | `pixel-button.tsx` | Simple hover/press optimal in CSS | Approved |

---

## Quality Gates

Before accepting new code:

- [ ] Behavior API usage verified
- [ ] No direct `.animate()` calls
- [ ] No unauthorized animation libraries
- [ ] No inline animation styles (unless exception documented)
- [ ] Accessibility compliance maintained
- [ ] Performance compliance maintained
- [ ] All exceptions documented in registry

---

## Success Criteria

Sprint 06 is complete when:

- ✅ ESLint plugin detects violations
- ✅ Validation script runs in CI
- ✅ Exception registry is operational
- ✅ All current exceptions are documented
- ✅ Future divergence is prevented
- ✅ Enforcement is automatic

---

## Maintenance

- **Review cycle:** Quarterly
- **Owner:** Platform Architecture
- **Escalation:** CTO for exception approvals
- **Documentation:** Updated with each exception change
