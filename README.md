# Amr Yousry Portfolio

A premium creative portfolio built with Next.js 16, featuring high-converting multimedia showcases, editorial case studies, an immersive world-parallax environment, and a streamlined contact conversion flow.

**Version:** v1.0.0 — [Release Notes](https://github.com/Amryousryy/amr-yousry-portfolio/releases/tag/v1.0.0)
**Status:** Production Stable
**Production URL:** https://amr-yousry-portfolio.vercel.app
**Roadmap:** See [ROADMAP.md](ROADMAP.md) for planned releases and versioning strategy.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** NextAuth.js (Credentials)
- **Media Storage:** Cloudinary (images + videos)
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Animation:** Framer Motion, CSS custom properties
- **Deployment:** Vercel (ISR, SSG)

## Features

- **Editorial Project Pages:** Chapter-based case study layout with structured narrative flow (Outcome → Problem → Solution → Creative Process → Media Gallery → Related Projects), executive summary quick-facts, before/after comparisons, key decisions timeline, and social proof blocks.
- **Premium Media Gallery:** Full-screen lightbox with Cloudinary video support, thumbnail strip navigation, and hover-to-preview interaction.
- **Related Projects:** Context-aware editorial cards with typographic hierarchy, aspect-ratio thumbnails, and direct navigation.
- **Living Pixel World:** Full-screen parallax environment — dynamic sky layers, star fields, comets, mountain ranges, cityscapes, forests, energy grids, and observatory components that respond to scroll position.
- **Contact Conversion Flow:** Dedicated `/contact` page with hash-anchor navigation (`/contact#project-inquiry`) from all CTAs. Auto-focus on first form field. WhatsApp-integrated form submission.
- **Admin Dashboard:** Secure content management with project CRUD, analytics dashboard, hero/content settings, and activity logging.
- **Public Content APIs:** ISR-revalidated endpoints for hero, about, contact, and project content.
- **Responsive Design:** Fully responsive across mobile, tablet, and desktop breakpoints.
- **SEO:** Dynamic sitemap, Open Graph metadata, JSON-LD structured data, canonical URLs.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `NEXTAUTH_URL` | Production URL | ✅ |
| `NEXTAUTH_SECRET` | Generated secret (`openssl rand -base64 32`) | ✅ |
| `ADMIN_EMAIL` | Admin login email | ✅ |
| `ADMIN_PASSWORD` | Admin login password | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |

## Admin Access

1. Navigate to `/admin/login`
2. Use credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public routes (home, projects, contact, showreel)
│   │   ├── contact/       # Contact page with inquiry form
│   │   ├── projects/      # Project listing + [slug] case studies
│   │   ├── preview/       # Preview mode
│   │   ├── showreel/      # Showreel page
│   │   └── page.tsx       # Home page
│   ├── admin/             # Admin dashboard (login, projects, analytics, settings)
│   ├── api/               # API routes (projects, analytics, auth, settings)
│   └── sitemap.ts         # Dynamic sitemap generator
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── layout/            # Navbar, Footer
│   ├── projects/          # ProjectMediaGallery, case study components
│   ├── sections/          # Page sections (hero, projects, about, contact)
│   ├── ui/                # Reusable UI primitives (PixelButton, Section, Container)
│   └── world/             # Parallax world system (16 composable layers)
├── content/               # Static content defaults
├── data/                  # Project data
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, API clients, auth config, analytics
├── models/                # Mongoose models
├── styles/                # Global CSS, design tokens, world system styles
└── types/                 # TypeScript type definitions
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Or connect the GitHub repository to Vercel for automatic deployments.

## License

MIT
