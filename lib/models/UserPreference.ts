import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  defaultTransformationType: {
    type: String,
    enum: ['anime', 'cartoon', 'other'],
    default: 'anime',
  },
  defaultParameters: {
    num_inference_steps: {
      type: Number,
      default: 30,
    },
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
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    transformationComplete: {
      type: Boolean,
      default: true,
    },
    transformationFailed: {
      type: Boolean,
      default: true,
    },
  },
  quotaUsed: {
    type: Number,
    default: 0,
  },
  quotaLimit: {
    type: Number,
    default: 10, // Free tier limit
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userPreferenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserPreference = mongoose.models.UserPreference || 
  mongoose.model('UserPreference', userPreferenceSchema); 