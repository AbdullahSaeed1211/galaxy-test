import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { VideoProcessing, VideoProcessing as IVideoProcessing } from '@/lib/models/video';
import connectToDatabase from '@/lib/mongodb';
import type { Model } from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Webhook secret should be configured in Fal AI dashboard and stored in environment variables
const WEBHOOK_SECRET = process.env.FAL_AI_WEBHOOK_SECRET;

interface HunyuanWebhookBody {
  status: 'completed' | 'failed';
  request_id: string;
  error?: string;
  output?: {
    video: {
      url: string;
      content_type?: string;
      file_name?: string;
      file_size?: number;
    };
    seed?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const signature = req.headers.get('x-fal-signature');
    if (!signature || !WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Implement proper signature verification
    // This is a placeholder for the actual signature verification logic

    // Connect to database
    await connectToDatabase();

    // Get request ID from query params
    const url = new URL(req.url);
    const requestId = url.searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
    }

    // Parse webhook payload
    const webhookData = await req.json() as HunyuanWebhookBody;
    
    // Find the processing record
    const VideoProcessingModel = VideoProcessing as Model<IVideoProcessing>;
    const videoProcessing = await VideoProcessingModel.findOne({
      'transformationParameters.requestId': requestId
    });

    if (!videoProcessing) {
      return NextResponse.json(
        { error: 'Processing record not found' },
        { status: 404 }
      );
    }

    try {
      // Upload transformed video to Cloudinary
      const cloudinaryUpload = await cloudinary.uploader.upload(webhookData.output?.video.url || '', {
        resource_type: 'video',
        folder: 'transformed-videos',
      });

      // Update processing record
      const now = new Date();
      await VideoProcessingModel.findByIdAndUpdate(
        videoProcessing._id,
        {
          transformedVideoUrl: cloudinaryUpload.secure_url,
          transformedVideoSize: cloudinaryUpload.bytes,
          transformedVideoFormat: cloudinaryUpload.format,
          status: 'completed',
          processingCompletedAt: now,
          $set: {
            'transformationParameters.processingEndTime': now,
            'transformationParameters.totalProcessingTime': 
              now.getTime() - videoProcessing.processingStartedAt.getTime()
          }
        }
      );

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      // Update processing record with error
      await VideoProcessingModel.findByIdAndUpdate(
        videoProcessing._id,
        {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Failed to process video',
          processingCompletedAt: new Date()
        }
      );

      throw error;
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 