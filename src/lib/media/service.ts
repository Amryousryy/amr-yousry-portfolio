import { mediaConfig, isValidMediaUrl, FALLBACK_MEDIA } from './config';
import type { MediaUploadResult, MediaState } from './types';
import { mediaFallback } from './fallback';

export class MediaService {
  private static instance: MediaService;
  
  private constructor() {}

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  isConfigured(): boolean {
    return mediaConfig.isUploadConfigured;
  }

  getConfig() {
    return {
      cloudName: mediaConfig.cloudName,
      uploadPreset: mediaConfig.uploadPreset,
      isConfigured: mediaConfig.isUploadConfigured,
    };
  }

  async uploadFromUrl(url: string): Promise<MediaUploadResult> {
    if (!url || !isValidMediaUrl(url)) {
      return { success: false, error: 'Invalid URL provided' };
    }
    return { success: true, url };
  }

  createUploadState(state: MediaState['status'], extra?: Partial<MediaState>): MediaState {
    return {
      status: state,
      ...extra,
    };
  }

  handleUploadSuccess(url: string, thumbnailUrl?: string): MediaState {
    return this.createUploadState('success', {
      url,
      thumbnailUrl,
    });
  }

  handleUploadError(error: string): MediaState {
    return this.createUploadState('error', { error });
  }

  handleNoConfig(): MediaState {
    return this.createUploadState('no-config', {
      error: 'Media service is not configured. You can still paste a media URL manually.',
    });
  }

  validateMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (isValidMediaUrl(url)) return url;
    return '';
  }

  getMediaWithFallback(url?: string | null, type: 'image' | 'video' | 'thumbnail' = 'image'): string {
    if (!url) return FALLBACK_MEDIA[type];
    return mediaFallback.getMediaFallback(type, url);
  }

  processMediaUrls(urls?: (string | null | undefined)[]): string[] {
    return mediaFallback.sanitizeMediaArray(urls);
  }

  formatUploadError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Upload failed. Please try again or use manual URL.';
  }

  getStateForValue(value?: string, thumbnailValue?: string): MediaState {
    if (!mediaConfig.isUploadConfigured) {
      return this.handleNoConfig();
    }
    
    if (value && isValidMediaUrl(value)) {
      return this.createUploadState('success', {
        url: value,
        thumbnailUrl: thumbnailValue,
      });
    }
    
    return this.createUploadState('idle');
  }
}

export const mediaService = MediaService.getInstance();