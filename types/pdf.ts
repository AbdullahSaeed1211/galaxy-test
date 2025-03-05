export interface PdfProcessingParams {
  operation: string;
  quality?: number;
  password?: string;
  targetFormat?: string;
  pageRange?: string;
  enableOcr?: boolean;
}

export interface UploadInfo {
  uuid: string;
  cdnUrl?: string;
}

export const DEFAULT_PARAMS: PdfProcessingParams = {
  operation: "compress",
  quality: 80,
  password: "",
  targetFormat: "pdf",
  pageRange: "all",
  enableOcr: false,
};

export const MAX_PDF_SIZE = 100 * 1024 * 1024; // 100MB 