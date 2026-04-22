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
    let remainingParts = parts.slice(uploadIndex + 1);
    
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
