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
    intensity: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    style: String,
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