import { v2 as cloudinary } from 'cloudinary';
import { config } from '@/lib/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface VideoMetadata {
  format: string;
  size: number;
  duration: number;
  width: number;
  height: number;
}

export const validateVideoFile = (file: File): boolean => {
  const maxSize = config.uploadcare.maxVideoSize;
  const allowedFormats = config.uploadcare.allowedFormats;
  const format = file.name.split('.').pop()?.toLowerCase() || '';

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  if (!allowedFormats.includes(format)) {
    throw new Error(`File format must be one of: ${allowedFormats.join(', ')}`);
  }

  return true;
};

export const uploadToCloudinary = async (url: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      folder: 'video-transformations',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
};

export const getVideoMetadata = async (url: string): Promise<VideoMetadata> => {
  try {
    const result = await cloudinary.api.resource(url, {
      resource_type: 'video',
    });

    return {
      format: result.format,
      size: result.bytes,
      duration: result.duration,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error getting video metadata:', error);
    throw new Error('Failed to get video metadata');
  }
};

export const generateThumbnail = async (url: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      folder: 'video-thumbnails',
      eager: [
        { width: 300, height: 300, crop: 'fill', format: 'jpg' }
      ],
    });

    return result.eager[0].secure_url;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error('Failed to generate video thumbnail');
  }
}; 