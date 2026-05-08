export interface ShowreelConfig {
  /** Video source URL (local path or external like YouTube/Vimeo) */
  src: string;
  /** Title displayed on the hero CTA or showreel page */
  title: string;
  /** Type of video source */
  type: "local" | "youtube" | "vimeo" | "custom";
  /** Optional: Thumbnail image for video preview */
  thumbnail?: string;
  /** Optional: Short description for showreel page */
  description?: string;
  /** Optional: Duration string (e.g., "2:45") */
  duration?: string;
}

/**
 * Configure your showreel here when ready.
 * 
 * Examples:
 * - Local file: { src: "/videos/showreel-2026.mp4", type: "local", thumbnail: "/images/showreel-cover.jpg" }
 * - YouTube:  { src: "https://www.youtube.com/watch?v=YOUR_ID", type: "youtube" }
 * - Vimeo:   { src: "https://vimeo.com/YOUR_ID", type: "vimeo" }
 */
export const showreelConfig: ShowreelConfig = {
  src: "/projects/retro-arcade-concept", // Current placeholder - update when real reel is ready
  title: "View Showreel",
  type: "custom", // Will become "local" or "youtube" when real reel is added
  // thumbnail: "/images/showreel-thumbnail.jpg", // Uncomment when ready
  // description: "A 2-minute showcase of cinematic brand stories and creative direction work.",
  // duration: "2:45",
};

/**
 * Call this function to check if a real showreel is configured.
 * Returns true when src is not the placeholder path.
 */
export function hasRealShowreel(): boolean {
  return showreelConfig.src !== "/projects/retro-arcade-concept";
}
