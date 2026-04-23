import { FALLBACK_MEDIA, isValidMediaUrl } from './config';

export class MediaFallback {
  private static instance: MediaFallback;
  
  private constructor() {}

  static getInstance(): MediaFallback {
    if (!MediaFallback.instance) {
      MediaFallback.instance = new MediaFallback();
    }
    return MediaFallback.instance;
  }

  getImageFallback(url?: string): string {
    if (url && isValidMediaUrl(url)) return url;
    return FALLBACK_MEDIA.image;
  }

  getVideoFallback(url?: string): string {
    if (url && isValidMediaUrl(url)) return url;
    return FALLBACK_MEDIA.video;
  }

  getThumbnailFallback(url?: string): string {
    if (url && isValidMediaUrl(url)) return url;
    return FALLBACK_MEDIA.thumbnail;
  }

  getMediaFallback(type: 'image' | 'video' | 'thumbnail', url?: string): string {
    switch (type) {
      case 'image':
        return this.getImageFallback(url);
      case 'video':
        return this.getVideoFallback(url);
      case 'thumbnail':
        return this.getThumbnailFallback(url);
      default:
        return FALLBACK_MEDIA.image;
    }
  }

  sanitizeMediaArray(media?: (string | null | undefined)[]): string[] {
    if (!Array.isArray(media)) return [];
    return media
      .filter((url): url is string => !!url && isValidMediaUrl(url));
  }

  getFirstValidMedia(media?: (string | null | undefined)[]): string | null {
    const valid = this.sanitizeMediaArray(media);
    return valid[0] || null;
  }
}

export const mediaFallback = MediaFallback.getInstance();