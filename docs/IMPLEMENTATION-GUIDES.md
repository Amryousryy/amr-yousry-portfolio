# IMPLEMENTATION GUIDES

**Version:** 1.0  
**Audience:** Developers  
**Status:** Active

---

> This document explains how to build the system.  
> It is not about theory. It is about practice.  
> It inherits from the Motion Platform.

---

## IMPLEMENTATION PURPOSE

The Implementation Guides exist to:

1. Explain how to implement features
2. Provide code examples
3. Document architecture decisions
4. Share patterns and best practices
5. Guide developer workflow

---

## IMPLEMENTATION PRINCIPLES

### Code Quality

1. **TypeScript:** Always use TypeScript
2. **Strict Mode:** Always use strict mode
3. **ESLint:** Always pass lint checks
4. **Testing:** Always write tests
5. **Documentation:** Always document code

### Component Architecture

1. **Single Responsibility:** One component, one purpose
2. **Composition:** Compose from small components
3. **Props Interface:** Define clear props interfaces
4. **State Management:** Minimize state, use hooks
5. **Performance:** Optimize renders, memoize

### File Organization

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── sections/    # Page sections
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── styles/          # CSS and tokens
└── types/           # TypeScript types
```

---

## COMPONENT PATTERNS

### Pattern 1: Server Component

```typescript
// ServerComponent.tsx
export async function ServerComponent() {
  const data = await fetchData()
  
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  )
}
```

**Usage:** Data fetching, static content, SEO.

---

### Pattern 2: Client Component

```typescript
'use client'

import { useState } from 'react'

export function ClientComponent() {
  const [state, setState] = useState(null)
  
  return (
    <div>
      <button onClick={() => setState('clicked')}>
        Click me
      </button>
    </div>
  )
}
```

**Usage:** Interactivity, state, effects.

---

### Pattern 3: Composite Component

```typescript
// Parent.tsx
export function Parent({ children }) {
  return <div className="parent">{children}</div>
}

// Child.tsx
export function Child({ title }) {
  return <div className="child">{title}</div>
}

// Usage
<Parent>
  <Child title="Hello" />
</Parent>
```

**Usage:** Flexible composition, layout components.

---

### Pattern 4: Hook Pattern

```typescript
// useCustomHook.ts
export function useCustomHook() {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Effect logic
  }, [])
  
  return { state, setState }
}

// Component.tsx
export function Component() {
  const { state, setState } = useCustomHook()
  
  return <div>{state}</div>
}
```

**Usage:** Reusable logic, state management.

---

### Pattern 5: Token Pattern

```typescript
// tokens.ts
export const tokens = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
  },
  spacing: {
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
  }
}

// Component.tsx
export function Component() {
  return (
    <div style={{ color: tokens.colors.primary }}>
      Hello
    </div>
  )
}
```

**Usage:** Design tokens, theme consistency.

---

## IMPLEMENTATION EXAMPLES

### Example 1: Button Component

```typescript
// pixel-button.tsx
'use client'

import { motion } from 'framer-motion'

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function PixelButton({ 
  children, 
  onClick, 
  variant = 'primary' 
}: PixelButtonProps) {
  return (
    <motion.button
      className={`pixel-button pixel-button--${variant}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
```

**Pattern:** Client Component + Motion Token + Composition.

---

### Example 2: Hero Section

```typescript
// hero/index.tsx
import { ServerComponent } from './ServerComponent'
import { ClientComponent } from './ClientComponent'

export function HeroSection() {
  return (
    <section className="hero">
      <ServerComponent />
      <ClientComponent />
    </section>
  )
}
```

**Pattern:** Server + Client Composition.

---

### Example 3: Token Migration

```typescript
// Before
<div style={{ padding: '16px' }}>

// After
<div style={{ padding: 'var(--spacing-md)' }}>
```

**Pattern:** Token Replacement.

---

## ARCHITECTURE DECISIONS

### Decision 1: Server vs Client

**Rule:** Use Server Components by default. Use Client Components only when necessary.

**When to use Client:**
- Interactivity (onClick, onChange)
- State (useState, useReducer)
- Effects (useEffect, useRef)
- Browser APIs (window, document)

**When to use Server:**
- Data fetching
- Static content
- SEO
- Performance

---

### Decision 2: Component Size

**Rule:** Keep components small. One component, one purpose.

**Small:** < 100 lines
**Medium:** 100-200 lines
**Large:** > 200 lines (split)

---

### Decision 3: State Management

**Rule:** Minimize state. Use local state by default. Use global state only when necessary.

**Local State:** useState, useReducer
**Global State:** Context, Zustand
**Server State:** React Query

---

### Decision 4: Styling

**Rule:** Use Tailwind CSS by default. Use CSS Modules for complex components. Use inline styles for dynamic values.

**Tailwind:** Layout, spacing, colors
**CSS Modules:** Complex animations, custom styles
**Inline Styles:** Dynamic values, tokens

---

## BEST PRACTICES

### Performance

1. **Memoize:** Use React.memo for expensive components
2. **Lazy Load:** Use dynamic imports for heavy components
3. **Virtualize:** Use virtualization for long lists
4. **Optimize Images:** Use Next.js Image component
5. **Code Split:** Split code by routes

### Accessibility

1. **Semantic HTML:** Use proper HTML elements
2. **ARIA Labels:** Add ARIA labels for interactive elements
3. **Keyboard Navigation:** Ensure keyboard navigation
4. **Color Contrast:** Ensure sufficient contrast
5. **Screen Readers:** Test with screen readers

### Testing

1. **Unit Tests:** Test individual components
2. **Integration Tests:** Test component interactions
3. **E2E Tests:** Test user flows
4. **Visual Tests:** Test visual appearance
5. **Performance Tests:** Test performance metrics

---

## QUALITY CHECKLIST

### Before Commit

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] All tests pass
- [ ] No console errors
- [ ] No performance regressions
- [ ] Accessibility checked
- [ ] Code reviewed

### Before Merge

- [ ] All CI checks pass
- [ ] Code reviewed by 2 developers
- [ ] Documentation updated
- [ ] Tests added for new features
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed

---

*This document is active. It should be reviewed quarterly. It is the implementation framework upon which all development decisions are made.*