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

export async function uploadPdf(pdfUrl: string, publicId?: string): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(pdfUrl, {
      resource_type: 'raw',
      public_id: publicId,
      folder: 'galaxy-pdf/documents',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading PDF to Cloudinary:', error);
    throw error;
  }
}

export async function deletePdf(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Error deleting PDF from Cloudinary:', error);
    throw error;
  }
}

export async function generatePdfPreview(pdfUrl: string, page: number = 1): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(pdfUrl, {
      resource_type: 'image',
      format: 'png',
      page,
      folder: 'galaxy-pdf/previews',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    throw error;
  }
}

export default cloudinary; 