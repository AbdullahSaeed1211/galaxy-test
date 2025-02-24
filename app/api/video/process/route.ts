import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '@/lib/mongodb';
import { fal } from "@fal-ai/client";
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import { queueVideoTransformation } from '@/lib/services/falai';
import { Model } from 'mongoose';
import { IVideoTransformation } from '@/lib/types/video';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_API_KEY
});

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { sourceVideoUrl, sourceVideoName, transformationParameters } = await req.json();

    // Create transformation record
    const VideoTransformationModel = VideoTransformation as Model<IVideoTransformation>;
    const transformation = await VideoTransformationModel.create({
      userId,
      originalVideo: {
        url: sourceVideoUrl,
        uploadcareId: sourceVideoName,
      },
      parameters: transformationParameters,
      status: 'pending',
      startedAt: new Date(),
    });

    // Queue the transformation with Fal AI
    const requestId = await queueVideoTransformation(
      transformationParameters,
      transformation._id.toString()
    );

    // Update record with request ID
    await VideoTransformationModel.findByIdAndUpdate(transformation._id, {
      'parameters.requestId': requestId,
      status: 'processing',
    });

    return NextResponse.json({
      message: 'Video processing queued successfully',
      transformationId: transformation._id,
    });

  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 