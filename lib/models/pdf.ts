import mongoose, { Document } from 'mongoose';
import { PdfProcessingParams } from '@/types/pdf';

export interface PdfProcessing extends Document {
  userId: string;
  sourcePdfUrl: string;
  sourcePdfName: string;
  processedPdfUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingParameters: PdfProcessingParams;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  sourcePdfSize?: number;
  sourcePdfPages?: number;
  processedPdfSize?: number;
  processedPdfPages?: number;
  calculateProcessingTime: () => number | null;
}

const pdfProcessingSchema = new mongoose.Schema<PdfProcessing>(
  {
    userId: { type: String, required: true },
    sourcePdfUrl: { type: String, required: true },
    sourcePdfName: { type: String, required: true },
    processedPdfUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    processingParameters: {
      operation: { type: String, required: true },
      quality: { type: Number },
      password: { type: String },
      targetFormat: { type: String },
      pageRange: { type: String },
      enableOcr: { type: Boolean },
    },
    error: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    sourcePdfSize: { type: Number },
    sourcePdfPages: { type: Number },
    processedPdfSize: { type: Number },
    processedPdfPages: { type: Number },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
pdfProcessingSchema.index({ userId: 1, createdAt: -1 });
pdfProcessingSchema.index({ status: 1 });

// Method to calculate processing time in seconds
pdfProcessingSchema.methods.calculateProcessingTime = function() {
  if (this.completedAt && this.createdAt) {
    return (this.completedAt.getTime() - this.createdAt.getTime()) / 1000;
  }
  return null;
};

export const PdfProcessing = mongoose.models.PdfProcessing ||
  mongoose.model<PdfProcessing>('PdfProcessing', pdfProcessingSchema);

export default PdfProcessing; 