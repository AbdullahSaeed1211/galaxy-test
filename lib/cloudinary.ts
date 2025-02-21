import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadVideo(videoUrl: string, publicId?: string): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      public_id: publicId,
      folder: 'galaxy-ai/videos',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
}

export async function deleteVideo(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    throw error;
  }
}

export default cloudinary; 