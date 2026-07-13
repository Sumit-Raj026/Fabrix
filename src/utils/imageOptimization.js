/**
 * Optimizes an image URL by routing it through Cloudinary's Fetch API
 * if a Cloudinary Cloud Name is configured.
 * 
 * @param {string} url - The original image URL (e.g. from Supabase Storage)
 * @param {object} options - Optional transformation parameters
 * @returns {string} The optimized image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return '';
  
  // Skip if it's already a Cloudinary URL or data URI
  if (url.includes('cloudinary.com') || url.startsWith('data:')) {
    return url;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  // If no Cloudinary account is configured, just return the original URL
  if (!cloudName) {
    return url;
  }

  // Build Cloudinary transformation string (f_auto = format auto like webp/avif, q_auto = quality auto)
  const transforms = ['f_auto', 'q_auto'];
  
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  
  const transformString = transforms.join(',');

  // The Cloudinary Fetch API format:
  // https://res.cloudinary.com/<cloud_name>/image/fetch/<transformations>/<remote_url>
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformString}/${encodeURIComponent(url)}`;
}
