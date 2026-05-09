# Client Logo Guidelines

## How to Add Real Client Logos

1. **Place logo files** in this directory (`/public/images/brands/`)
   - Recommended formats: `.svg` (vector) or `.png` (transparent background)
   - Recommended size: 150-200px width, keep aspect ratio
   - Recommended filename: `client-name.svg` (lowercase, hyphenated)

2. **Update** `src/data/brands.ts`:
```typescript
export const BRAND_LOGOS: BrandLogo[] = [
  {
    id: "client-name",
    name: "Client Name",
    logoPath: "/images/brands/client-name.svg",
    website: "https://client-website.com", // optional
  },
  // Add more clients here...
];
```

3. **The BrandMarquee will automatically:**
   - Show only real logos (hides itself if array is empty)
   - Double the logos for seamless infinite scroll
   - Link to client website (if provided)
   - Show `brand.name` as fallback if no `logoPath` is set

## Example Logo Paths
- `/images/brands/nike.svg`
- `/images/brands/apple.svg`
- `/images/brands/spotify.svg`

## Notes
- Logos display at `h-8` (32px height) with auto width
- They appear with 80% opacity, transitioning to 100% on hover
- The marquee pauses on hover for easy clicking
- Respects `prefers-reduced-motion` accessibility setting
