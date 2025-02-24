import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '@/lib/mongodb';
import { fal } from "@fal-ai/client";
import { VideoProcessing, type VideoProcessing as IVideoProcessing } from '@/lib/models/video';
import { queueVideoTransformation } from '@/lib/services/falai';
import { Model } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/video';

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

    // Step 1: Upload source video to Cloudinary
    console.log('Step 1: Uploading source video from Uploadcare to Cloudinary:', {
      sourceVideoUrl,
      sourceVideoName
    });
    const cloudinarySourceUrl = await uploadToCloudinary(sourceVideoUrl);
    console.log('Step 1 Complete: Source video uploaded to Cloudinary:', cloudinarySourceUrl);

    // Step 2: Create video processing record
    console.log('Step 2: Creating processing record in MongoDB');
    const VideoProcessingModel = VideoProcessing as Model<IVideoProcessing>;
    const processing = await VideoProcessingModel.create({
      userId,
      sourceVideoUrl: cloudinarySourceUrl,
      sourceVideoName,
      transformationParameters: {
        ...transformationParameters,
        video_url: cloudinarySourceUrl,
      },
      status: 'pending',
      processingStartedAt: new Date(),
    });
    console.log('Step 2 Complete: Processing record created:', processing._id.toString());

    // Step 3: Queue transformation with Fal AI
    console.log('Step 3: Queueing transformation with Fal AI:', {
      processingId: processing._id.toString(),
      cloudinarySourceUrl
    });
    const requestId = await queueVideoTransformation(
      {
        ...transformationParameters,
        video_url: cloudinarySourceUrl,
      },
      processing._id.toString()
    );
    console.log('Step 3 Complete: Transformation queued with Fal AI:', {
      requestId,
      processingId: processing._id.toString()
    });

    // Step 4: Update record with request ID
    console.log('Step 4: Updating processing record with request ID');
    await VideoProcessingModel.findByIdAndUpdate(processing._id, {
      'transformationParameters.requestId': requestId,
      status: 'processing',
    });
    console.log('Step 4 Complete: Processing record updated');

    return NextResponse.json({
      message: 'Video processing queued successfully',
      processingId: processing._id,
    });

  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 