import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

const isConfigured =
  config.cloudinary.cloudName &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiSecret;

if (isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = 'ems-avatars'
): Promise<{ url: string; publicId: string }> => {
  if (!isConfigured) {
    console.warn('Cloudinary not configured. Using placeholder avatar.');
    return {
      url: `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200`,
      publicId: '',
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, transformation: [{ width: 300, height: 300, crop: 'fill' }] }, (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(fileBuffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  if (!isConfigured || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
};
