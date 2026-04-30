import { v2 as cloudinary } from 'cloudinary';

/**
 * Initialize Cloudinary with environment variables.
 * Call once at server startup.
 */
export function initCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a buffer to Cloudinary.
 * Returns the secure URL with f_auto,q_auto transformations.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'portfolio'
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No result from Cloudinary'));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export { cloudinary };
