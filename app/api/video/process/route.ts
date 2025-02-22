import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import VideoProcessing from '@/lib/models/video';
import connectToDatabase from '@/lib/mongodb';
import { fal } from "@fal-ai/client";

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

export const maxDuration = 60; // This function can run for a maximu

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const { sourceVideoUrl, sourceVideoName, transformationParameters } = await req.json();

    // Validate required fields
    if (!sourceVideoUrl || !sourceVideoName || !transformationParameters) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(sourceVideoUrl, {
      resource_type: 'video',
      folder: 'source-videos',
    });

    // Generate unique request ID for webhook
    const requestId = `${userId}-${Date.now()}`;

    // Create video processing record
    const videoProcessing = new VideoProcessing({
      userId,
      sourceVideoUrl: cloudinaryUpload.secure_url,
      sourceVideoName,
      sourceVideoSize: cloudinaryUpload.bytes,
      sourceVideoFormat: cloudinaryUpload.format,
      transformationParameters: {
        ...transformationParameters,
        video_url: cloudinaryUpload.secure_url,
        requestId,
      },
      status: 'pending',
      processingStartedAt: new Date(),
    });
    await videoProcessing.save();

    // Call Fal API using their client
    const falResult = await fal.subscribe("fal-ai/hunyuan-video/video-to-video", {
      input: {
        prompt: transformationParameters.prompt,
        video_url: cloudinaryUpload.secure_url,
        num_inference_steps: transformationParameters.num_inference_steps,
        seed: transformationParameters.seed,
        strength: transformationParameters.strength,
        aspect_ratio: transformationParameters.aspect_ratio,
        resolution: transformationParameters.resolution,
        num_frames: transformationParameters.num_frames,
        pro_mode: transformationParameters.pro_mode,
        enable_safety_checker: transformationParameters.enable_safety_checker,
      },
      logs: true,
      onQueueUpdate: async (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing:", update.logs.map((log) => log.message));
        }
      },
    });

    if (!falResult?.data?.video?.url) {
      throw new Error('Failed to process video');
    }

    // Update status to processing
    videoProcessing.status = 'processing';
    videoProcessing.transformedVideoUrl = falResult.data.video.url;
    await videoProcessing.save();

    return NextResponse.json({
      message: 'Video processing started',
      requestId: falResult.requestId,
      videoProcessingId: videoProcessing._id,
    });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 