import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';
import { config, TransformationStyle } from '@/lib/config';
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import { UserPreference } from '@/lib/models/UserPreference';
import connectDB from '@/lib/mongodb';

const transformRequestSchema = z.object({
  videoUrl: z.string().url(),
  uploadcareId: z.string(),
  transformationType: z.enum(['anime', 'cartoon', 'other'] as const),
  parameters: z.object({
    intensity: z.number().min(0).max(100).default(50),
    style: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
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
    const userPref = await UserPreference.findOne({ userId });
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
    const transformation = await VideoTransformation.create({
      userId,
      originalVideo: {
        url: validatedData.videoUrl,
        uploadcareId: validatedData.uploadcareId,
      },
      transformationType: validatedData.transformationType,
      parameters: validatedData.parameters || { intensity: 50 },
      status: 'pending',
      startedAt: new Date(),
    });

    // Increment quota used
    await UserPreference.updateOne(
      { userId },
      { $inc: { quotaUsed: 1 } }
    );

    // Start transformation process (this would typically be handled by a background job)
    // For now, we'll just return the transformation ID
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