import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public ID from a Cloudinary URL.
 * Handles nested folders and versions.
 */
export function getPublicIdFromUrl(url: string) {
  if (!url || !url.includes('cloudinary.com')) return null;

  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // The part after 'upload' could be 'v12345678' or the start of the public ID
    const remainingParts = parts.slice(uploadIndex + 1);
    
    // Remove version if present (e.g., v1, v12345678)
    if (remainingParts[0].match(/^v\d+$/)) {
      remainingParts.shift();
    }
    
    // Join remaining parts and remove the file extension
    const fullPath = remainingParts.join('/');
    const publicId = fullPath.substring(0, fullPath.lastIndexOf('.'));
    
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", url, error);
    return null;
  }
}

/**
 * Single source of truth for every Cloudinary URL a Project document owns.
 * Used by the project DELETE handler so no project-owned asset is orphaned
 * (image, video, gallery, section media, and caseStudyMedia all included).
 * Missing/invalid entries are skipped and duplicates are collapsed.
 */
export interface CloudinaryProjectMediaShape {
  image?: string | null;
  video?: string | null;
  gallery?: Array<string | null> | null;
  sections?: Array<{ media?: Array<{ url?: string | null } | null> | null } | null> | null;
  caseStudyMedia?: Array<{ src?: string | null } | null> | null;
}

export function collectProjectMediaUrls(project: CloudinaryProjectMediaShape): string[] {
  const urls: string[] = [];
  const add = (value?: string | null) => {
    if (value && value.trim()) urls.push(value.trim());
  };

  add(project?.image);
  add(project?.video);

  for (const url of project?.gallery ?? []) add(url);

  for (const section of project?.sections ?? []) {
    for (const media of section?.media ?? []) add(media?.url);
  }

  for (const item of project?.caseStudyMedia ?? []) add(item?.src);

  return Array.from(new Set(urls));
}

/**
 * Deletes multiple resources from Cloudinary by their URLs.
 */
export async function deleteCloudinaryResources(urls: string[]) {
  const publicIds = urls
    .map(getPublicIdFromUrl)
    .filter((id): id is string => !!id);
    
  if (publicIds.length === 0) return { success: true, message: "No Cloudinary resources to delete" };
  
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return { success: true, result };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return { success: false, error };
  }
}
