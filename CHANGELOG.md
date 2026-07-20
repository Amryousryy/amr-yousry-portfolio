# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.0.0 — Official Production Release (July 20, 2026)

### Added

- **Living Pixel World**: Full-screen parallax environment with composable layer system — sky gradients, star fields, comets, mountain ranges, cityscapes, forests, energy grids, and observatory. Layers respond to scroll position across page sections.
- **Editorial Project Pages**: Restructured case study layout with chapter-based narrative (Outcome → Problem → Solution → Creative Process → Media Gallery → Related Projects). Includes executive summary quick-facts cards, before/after comparison, key decisions timeline, and social proof blocks.
- **Premium Media Gallery**: Cloudinary-hosted media with video support, full-screen lightbox overlay, thumbnail strip navigation, and hover-to-preview interaction.
- **Related Projects**: Dynamic project recommendations at the bottom of each case study with editorial card composition — aspect-ratio thumbnails, category labels, typographic hierarchy, and direct navigation.
- **Dedicated Contact Page**: New `/contact` route rendering the full contact section with communication channels and project inquiry form.
- **Contact Conversion Flow**: Hash-anchor navigation (`/contact#project-inquiry`) from all "Start Your Project" CTAs with auto-focus on the first form field.
- **Admin Dashboard**: Content management system with secure authentication (NextAuth), analytics dashboard, project CRUD, and content settings management.
- **Public Content APIs**: Server-side data fetching with ISR revalidation for hero, about, contact, and project content.

### Changed

- **Typography System**: Refined editorial rhythm across project case studies — optimized heading-to-body spacing, line-height hierarchy, and composition balance.
- **Project Card Composition**: Redesigned card layout with intentional whitespace distribution, horizontal text width expansion, and vertical rhythm that follows an editorial reading flow.
- **Contact Section Layout**: Removed redundant background class (`bg-brand-blue/95`) — gradient overlay now provides the full background.
- **Project Data Types**: Standardized TypeScript interfaces (`ProjectMediaItem`, `KeyDecision`, `SocialProofItem`, `BeforeAfter`, `QuickFacts`) for consistent data handling across the project layer.
- **Analytics Tracking**: Restructured event data with structured path and label parameters.

### Removed

- **Deprecated Creative Engine**: Removed the entire creative-engine ecosystem — `EcosystemProvider`, `EcosystemRoot`, all pixel components (`CreativeCorePixel`, `MaintenanceDronePixel`, `MemoryCrystalPixel`, `PortalPixel`, `SignalBeaconPixel`), `WorldInteraction`, state/event types, context, and 6 associated CSS files.
- **Dead Code**: Removed unused state guards, event handlers, and exports from the legacy ecosystem.

### Fixed

- **Layout Inconsistencies**: Fixed duplicate background rendering on the contact section, adjusted project page spacing, and resolved asymmetrical card proportions.
- **Media Presentation**: Unified image sizing with `object-contain` and `object-top` positioning across project thumbnails and gallery items.

### Performance

- Production build optimized with Next.js 16 (Turbopack)
- All public pages are statically generated (SSG) with ISR revalidation
- Dynamic component loading for section-level code splitting
- Image optimization via `next/image` and Cloudinary

### Architecture

- Route groups: `(marketing)` for public pages, `admin` for CMS routes
- World system with composable layer architecture (16 components + 12 CSS modules)
- Contact section with client-side form validation and WhatsApp integration
- Analytics pipeline with structured event tracking

## v0.x — Pre-release (Previous)

### Phase 6.0 — v1.0 Certification (July 19, 2026)

- Full 6-area certification audit (Visual/Behavioral/Runtime/Performance/Accessibility/UX)
- Fixed portal safety timeout (maxStateTime enforcement was missing)
- v1.0 APPROVED — certified for production use

### Phase 5.0 — Living World Expansion

- Sprint 05: Energy Visualization Layer (CSS-only cyan/purple streams)
- Sprint 06: Portal System (16x16px SVG ring, 7-state machine, 30s cooldown)
