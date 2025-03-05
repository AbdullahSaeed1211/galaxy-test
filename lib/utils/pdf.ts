import { v2 as cloudinary } from 'cloudinary';
import { MAX_PDF_SIZE } from '@/types/pdf';

export interface PdfMetadata {
  format: string;
  pages: number;
  size: number;
  secure_url: string;
  public_id: string;
}

export const validatePdfFile = (file: File): boolean => {
  // Check file type
  if (!file.type.includes('pdf')) {
    throw new Error('File must be a PDF');
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE) {
    throw new Error(`File size must be less than ${MAX_PDF_SIZE / (1024 * 1024)}MB`);
  }

  return true;
};

export const uploadPdfToCloudinary = async (fileUrl: string): Promise<string> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(fileUrl, {
      resource_type: 'raw',
      folder: 'pdf-processing',
      format: 'pdf',
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('Failed to upload PDF to Cloudinary');
  }
};

export const getPdfMetadata = async (url: string): Promise<PdfMetadata> => {
  try {
    const result = await cloudinary.api.resource(url, {
      resource_type: 'raw',
      image_metadata: true,
    });

    return {
      format: 'pdf',
      pages: result.pages || 0,
      size: result.bytes || 0,
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw new Error('Failed to get PDF metadata');
  }
};

export const generatePdfThumbnail = async (url: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'raw',
      folder: 'pdf-thumbnails',
      format: 'png',
      page: 1,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    throw new Error('Failed to generate PDF thumbnail');
  }
}; 