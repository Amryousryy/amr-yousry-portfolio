# Showreel Configuration Guide

## Quick Setup

Edit `src/data/showreel.ts` when your compiled reel is ready:

### Option 1: Local Video File
```typescript
export const showreelConfig: ShowreelConfig = {
  src: "/videos/showreel-2026.mp4",
  title: "Watch Showreel",
  type: "local",
  thumbnail: "/images/showreel-cover.jpg",
  description: "A 2-minute showcase of cinematic brand stories and creative direction work.",
  duration: "2:45",
};
```
Place video in `public/videos/` and thumbnail in `public/images/`.

### Option 2: YouTube
```typescript
export const showreelConfig: ShowreelConfig = {
  src: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  title: "Watch Showreel",
  type: "youtube",
  thumbnail: "/images/showreel-cover.jpg",
  description: "A 2-minute showcase of cinematic brand stories and creative direction work.",
  duration: "2:45",
};
```

### Option 3: Vimeo
```typescript
export const showreelConfig: ShowreelConfig = {
  src: "https://vimeo.com/YOUR_VIDEO_ID",
  title: "Watch Showreel",
  type: "vimeo",
  thumbnail: "/images/showreel-cover.jpg",
  description: "A 2-minute showcase of cinematic brand stories and creative direction work.",
  duration: "2:45",
};
```

## Architecture Notes

- The Hero CTA (`src/content/hero.ts`) automatically reads from `showreelConfig`
- The `/showreel` page (`src/app/showreel/page.tsx`) supports all video types
- `hasRealShowreel()` function returns `true` when you've updated the config from the placeholder
- No structural rework needed when switching from placeholder to real reel
