import mongoose from 'mongoose';

const videoTransformationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  originalVideo: {
    url: String,
    uploadcareId: String,
    cloudinaryId: String,
    size: Number,
    format: String,
  },
  transformedVideo: {
    url: String,
    cloudinaryId: String,
  },
  parameters: {
    prompt: {
      type: String,
      required: true,
    },
    video_url: String,
    num_inference_steps: {
      type: Number,
      default: 30,
    },
    seed: Number,
    strength: {
      type: Number,
      default: 0.85,
    },
    aspect_ratio: {
      type: String,
      enum: ['16:9', '9:16'],
      default: '16:9',
    },
    resolution: {
      type: String,
      enum: ['480p', '580p', '720p'],
      default: '720p',
    },
    num_frames: {
      type: Number,
      enum: [85, 129],
      default: 129,
    },
    pro_mode: {
      type: Boolean,
      default: false,
    },
    enable_safety_checker: {
      type: Boolean,
      default: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  error: String,
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

videoTransformationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const VideoTransformation = mongoose.models.VideoTransformation || 
  mongoose.model('VideoTransformation', videoTransformationSchema); 