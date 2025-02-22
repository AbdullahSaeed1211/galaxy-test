import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FORMATS = ['mp4', 'mov', 'avi', 'wmv'];

export interface VideoMetadata {
  format: string;
  size: number;
  duration: number;
  width: number;
  height: number;
}

export const validateVideoFile = (file: File): boolean => {
  const format = file.name.split('.').pop()?.toLowerCase() || '';

  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`File size must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
  }

  if (!ALLOWED_FORMATS.includes(format)) {
    throw new Error(`File format must be one of: ${ALLOWED_FORMATS.join(', ')}`);
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