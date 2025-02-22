import mongoose from 'mongoose';

export interface TransformationParameters {
  // Core parameters
  prompt: string;
  video_url: string;
  num_inference_steps: number;
  seed?: number;
  strength: number;

  // Video settings
  aspect_ratio: '16:9' | '9:16';
  resolution: '480p' | '580p' | '720p';
  num_frames: 129 | 85;
  
  // Processing options
  pro_mode: boolean;
  enable_safety_checker: boolean;
  
  // Internal tracking
  requestId?: string;
  processingStartTime?: Date;
  processingEndTime?: Date;
  totalProcessingTime?: number;
}

export interface VideoProcessing {
  userId: string;
  sourceVideoUrl: string;
  sourceVideoName: string;
  transformedVideoUrl?: string;
  transformationParameters: TransformationParameters;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  
  // Additional metadata
  sourceVideoSize?: number;
  sourceVideoFormat?: string;
  transformedVideoSize?: number;
  transformedVideoFormat?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
}

const videoProcessingSchema = new mongoose.Schema<VideoProcessing>(
  {
    userId: { type: String, required: true, index: true },
    sourceVideoUrl: { type: String, required: true },
    sourceVideoName: { type: String, required: true },
    transformedVideoUrl: { type: String },
    transformationParameters: {
      type: {
        prompt: { type: String, required: true },
        video_url: { type: String, required: true },
        num_inference_steps: { type: Number, required: true },
        seed: Number,
        strength: { type: Number, required: true },
        aspect_ratio: { type: String, enum: ['16:9', '9:16'], required: true },
        resolution: { type: String, enum: ['480p', '580p', '720p'], required: true },
        num_frames: { type: Number, enum: [85, 129], required: true },
        pro_mode: { type: Boolean, default: false },
        enable_safety_checker: { type: Boolean, default: true },
        requestId: String,
        processingStartTime: Date,
        processingEndTime: Date,
        totalProcessingTime: Number
      },
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      required: true
    },
    error: { type: String },
    sourceVideoSize: { type: Number },
    sourceVideoFormat: { type: String },
    transformedVideoSize: { type: Number },
    transformedVideoFormat: { type: String },
    processingStartedAt: { type: Date },
    processingCompletedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
videoProcessingSchema.index({ userId: 1, createdAt: -1 });
videoProcessingSchema.index({ 'transformationParameters.requestId': 1 });
videoProcessingSchema.index({ status: 1 });

// Add a method to calculate processing time
videoProcessingSchema.methods.calculateProcessingTime = function() {
  if (this.processingStartedAt && this.processingCompletedAt) {
    return this.processingCompletedAt.getTime() - this.processingStartedAt.getTime();
  }
  return null;
};

export const VideoProcessing = mongoose.models.VideoProcessing || 
  mongoose.model<VideoProcessing>('VideoProcessing', videoProcessingSchema);

export default VideoProcessing; 