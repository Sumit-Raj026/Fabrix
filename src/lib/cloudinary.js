// Cloudinary configuration for Fabrix
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zqmafknh';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Fabrix';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a File object or Base64 data URL to Cloudinary.
 * Returns the secure HTTPS URL of the uploaded image.
 * @param {File|string} fileOrBase64 - File object from input OR base64 data URL string
 * @param {function} onProgress - optional callback (0–100)
 * @returns {Promise<string>} Cloudinary secure URL
 */
export async function uploadToCloudinary(fileOrBase64, onProgress = null) {
  const formData = new FormData();
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'fabrix');

  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
    // It's a Base64 data URL — convert to Blob then upload
    const blob = dataURLtoBlob(fileOrBase64);
    formData.append('file', blob, 'upload.jpg');
  } else if (fileOrBase64 instanceof File) {
    formData.append('file', fileOrBase64);
  } else {
    throw new Error('Invalid input: expected File or Base64 string');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        let msg = `Cloudinary upload failed (${xhr.status})`;
        try {
          const err = JSON.parse(xhr.responseText);
          msg = err?.error?.message || msg;
        } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.open('POST', CLOUDINARY_URL);
    xhr.send(formData);
  });
}

/**
 * Convert a Base64 data URL to a Blob object.
 */
function dataURLtoBlob(dataURL) {
  const [header, base64Data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}
