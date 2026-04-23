export type MediaType = 'image' | 'video' | 'youtube' | 'vimeo';

export type MediaLayout = 'full' | 'grid' | 'split' | 'carousel';

export type AspectRatio = '16:9' | '1:1' | '4:5' | '9:16' | 'auto';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  alt?: string;
  order: number;
  layout?: MediaLayout;
  aspectRatio?: AspectRatio;
}

export interface MediaSection {
  id: string;
  title?: string;
  media: MediaItem[];
  layout: MediaLayout;
}

export interface MediaUploadResult {
  success: boolean;
  url?: string;
  thumbnailUrl?: string;
  publicId?: string;
  error?: string;
}

export interface MediaState {
  status: 'idle' | 'uploading' | 'success' | 'error' | 'no-config';
  url?: string;
  thumbnailUrl?: string;
  publicId?: string;
  error?: string;
  progress?: number;
}

export interface MediaUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  resourceType?: 'image' | 'video' | 'auto';
  maxFileSize?: number;
  accept?: string;
  label?: string;
  placeholder?: string;
  thumbnailValue?: string;
  onThumbnailChange?: (url: string) => void;
}