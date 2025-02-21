import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fal } from '@fal-ai/client';
import { uploadVideo } from '@/lib/cloudinary';
import { VideoProcessing } from '@/lib/models/video';
import connectToDatabase from '@/lib/mongodb';

if (!process.env.FAL_KEY) {
  throw new Error('Missing Fal.ai credentials');
}

interface HunyuanVideoRequest {
  prompt: string;
  num_inference_steps?: number;
  seed?: number;
  pro_mode?: boolean;
  aspect_ratio?: '16:9' | '9:16';
  resolution?: '480p' | '580p' | '720p';
  num_frames?: 129 | 85;
  enable_safety_checker?: boolean;
  video_url: string;
  strength?: number;
}

interface HunyuanVideoResult {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sourceVideoUrl, sourceVideoName, transformationParameters } = await req.json();

    if (!sourceVideoUrl || !transformationParameters) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary
    const cloudinaryUrl = await uploadVideo(sourceVideoUrl);

    // Connect to database
    await connectToDatabase();

    // Create processing record
    const videoProcessing = await VideoProcessing.create({
      userId,
      sourceVideoUrl: cloudinaryUrl,
      sourceVideoName,
      transformationParameters,
      status: 'pending',
    });

    // Submit to Fal.ai queue
    const { request_id } = await fal.queue.submit('fal-ai/hunyuan-video/video-to-video', {
      input: {
        video_url: cloudinaryUrl,
        ...transformationParameters,
      } as HunyuanVideoRequest,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/video/webhook`,
    });

    // Update processing record with request ID
    await VideoProcessing.findByIdAndUpdate(
      videoProcessing._id,
      {
        $set: {
          'transformationParameters.requestId': request_id,
          status: 'processing',
        },
      }
    );

    return NextResponse.json({
      processingId: videoProcessing._id,
      requestId: request_id,
      status: 'processing',
    });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
  }
} 