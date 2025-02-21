import mongoose from 'mongoose';

export interface TransformationParameters {
  // Add specific parameters based on Fal API requirements
  model?: string;
  prompt?: string;
  negativePrompt?: string;
  numInferenceSteps?: number;
  guidance?: number;
  seed?: number;
  pro_mode?: boolean;
  aspect_ratio?: '16:9' | '9:16';
  resolution?: '480p' | '580p' | '720p';
  num_frames?: 129 | 85;
  enable_safety_checker?: boolean;
  strength?: number;
  requestId?: string;
}

export interface VideoProcessing {
  userId: string;
  sourceVideoUrl: string;
  sourceVideoName: string;
  transformedVideoUrl?: string;
  transformationParameters: TransformationParameters;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const videoProcessingSchema = new mongoose.Schema<VideoProcessing>(
  {
    userId: { type: String, required: true, index: true },
    sourceVideoUrl: { type: String, required: true },
    sourceVideoName: { type: String, required: true },
    transformedVideoUrl: { type: String },
    transformationParameters: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create an index on the requestId field for faster webhook lookups
videoProcessingSchema.index({ 'transformationParameters.requestId': 1 });

export const VideoProcessing = mongoose.models.VideoProcessing || 
  mongoose.model<VideoProcessing>('VideoProcessing', videoProcessingSchema);

export default VideoProcessing; 