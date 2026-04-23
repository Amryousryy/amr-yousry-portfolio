export const mediaConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpax6u61z',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  isConfigured: !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  isUploadConfigured: !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET),
};

export function getMediaUrls(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
}) {
  if (!publicId || !mediaConfig.cloudName) {
    return { original: '', optimized: '', thumbnail: '' };
  }

  const baseUrl = `https://res.cloudinary.com/${mediaConfig.cloudName}/image/upload`;
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.quality) transforms.push(`q_${options.quality || 'auto'}`);
  if (options?.format) transforms.push(`f_${options.format || 'auto'}`);

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  
  return {
    original: `${baseUrl}/${publicId}`,
    optimized: `${baseUrl}/${transformString}${publicId}`,
    thumbnail: `${baseUrl}/w_400,h_300,c_fill,q_auto,f_auto/${publicId}`,
  };
}

export function isValidMediaUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:')) return true;
  if (url.startsWith('blob:')) return true;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getMediaType(url: string): 'image' | 'video' | 'youtube' | 'vimeo' | 'unknown' {
  if (!url) return 'unknown';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('cloudinary.com') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) return 'image';
  if (url.includes('mp4') || url.includes('webm') || url.includes('.mov')) return 'video';
  
  return 'unknown';
}

export function normalizeMediaUrl(url: string, type: 'image' | 'video' = 'image'): string {
  if (!url) return '';
  if (!isValidMediaUrl(url)) return '';
  return url;
}

export const FALLBACK_MEDIA = {
  image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400',
};