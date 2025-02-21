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
  transformationType: {
    type: String,
    enum: ['anime', 'cartoon', 'other'],
    required: true,
  },
  parameters: {
    intensity: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    style: String,
    additionalParams: mongoose.Schema.Types.Mixed,
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