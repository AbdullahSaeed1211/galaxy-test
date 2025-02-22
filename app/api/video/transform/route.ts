import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import { UserPreference } from '@/lib/models/UserPreference';
import connectDB from '@/lib/mongodb';
import type { Model } from 'mongoose';

interface IUserPreference {
  userId: string;
  quotaUsed: number;
  quotaLimit: number;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
}

interface IVideoTransformation {
  userId: string;
  originalVideo: {
    url: string;
    uploadcareId: string;
    cloudinaryId?: string;
    size?: number;
    format?: string;
  };
  parameters: {
    prompt: string;
    video_url: string;
    num_inference_steps?: number;
    seed?: number;
    strength?: number;
    aspect_ratio?: '16:9' | '9:16';
    resolution?: '480p' | '580p' | '720p';
    num_frames?: 85 | 129;
    pro_mode?: boolean;
    enable_safety_checker?: boolean;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
}

const transformRequestSchema = z.object({
  videoUrl: z.string().url(),
  uploadcareId: z.string(),
  transformationParameters: z.object({
    prompt: z.string().min(1),
    video_url: z.string().url(),
    num_inference_steps: z.number().min(10).max(50).default(30),
    seed: z.number().optional(),
    strength: z.number().min(0.1).max(1).default(0.85),
    aspect_ratio: z.enum(['16:9', '9:16']).default('16:9'),
    resolution: z.enum(['480p', '580p', '720p']).default('720p'),
    num_frames: z.enum(['85', '129']).default('129'),
    pro_mode: z.boolean().default(false),
    enable_safety_checker: z.boolean().default(true),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Validate request body
    const body = await req.json();
    const validatedData = transformRequestSchema.parse(body);

    // Check user quota
    const userPref = await (UserPreference as Model<IUserPreference>).findOne({ userId });
    if (!userPref) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      );
    }

    if (userPref.quotaUsed >= userPref.quotaLimit) {
      return NextResponse.json(
        { error: 'Transformation quota exceeded' },
        { status: 403 }
      );
    }

    // Create transformation record
    const transformation = await (VideoTransformation as Model<IVideoTransformation>).create({
      userId,
      originalVideo: {
        url: validatedData.videoUrl,
        uploadcareId: validatedData.uploadcareId,
      },
      parameters: validatedData.transformationParameters,
      status: 'pending',
      startedAt: new Date(),
    });

    // Increment quota used
    await (UserPreference as Model<IUserPreference>).updateOne(
      { userId },
      { $inc: { quotaUsed: 1 } }
    );

    return NextResponse.json({
      transformationId: transformation._id,
      status: 'pending',
      message: 'Transformation request accepted',
    });

  } catch (error) {
    console.error('Error in video transform:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 