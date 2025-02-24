import { NextRequest, NextResponse } from 'next/server';
import { VideoProcessing, type VideoProcessing as IVideoProcessing } from '@/lib/models/video';
import connectDB from '@/lib/mongodb';
import { uploadToCloudinary } from '@/lib/utils/video';
import { Model } from 'mongoose';
import { FalWebhookPayload } from '@/lib/types/video';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_RETRIES = 3;

async function uploadToCloudinaryWithRetry(url: string, retries = 0): Promise<string> {
  try {
    return await uploadToCloudinary(url);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // Exponential backoff
      const delay = Math.pow(2, retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return uploadToCloudinaryWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log('Webhook received:', {
    headers: Object.fromEntries(req.headers.entries()),
    url: req.url,
  });

  try {
    // Step 1: Validate webhook request
    const url = new URL(req.url);
    const processingId = url.searchParams.get('transformationId');
    
    if (!processingId) {
      console.error('Step 1 Failed: Missing processingId in webhook request');
      return NextResponse.json({ error: 'Missing processingId' }, { status: 400 });
    }
    console.log('Step 1 Complete: Valid webhook request received for processingId:', processingId);

    // Step 2: Connect to database and get processing record
    await connectDB();
    const body = await req.json() as FalWebhookPayload;
    console.log('Step 2: Processing webhook payload:', {
      processingId,
      status: body.status,
      hasVideo: !!body.payload?.video?.url,
    });

    const VideoProcessingModel = VideoProcessing as Model<IVideoProcessing>;
    const processing = await VideoProcessingModel.findById(processingId);
    if (!processing) {
      console.error('Step 2 Failed: Processing record not found:', processingId);
      return NextResponse.json({ error: 'Processing record not found' }, { status: 404 });
    }
    console.log('Step 2 Complete: Found processing record');

    if (body.status === 'OK' && body.payload?.video?.url) {
      try {
        // Step 3: Upload transformed video to Cloudinary
        console.log('Step 3: Uploading transformed video to Cloudinary:', {
          processingId,
          sourceUrl: body.payload.video.url
        });
        const cloudinaryUrl = await uploadToCloudinaryWithRetry(body.payload.video.url);
        console.log('Step 3 Complete: Video uploaded to Cloudinary:', cloudinaryUrl);
        
        // Step 4: Update processing record
        console.log('Step 4: Updating processing record with transformed video URL');
        await VideoProcessingModel.findByIdAndUpdate(processingId, {
          transformedVideoUrl: cloudinaryUrl,
          status: 'completed',
          processingCompletedAt: new Date(),
          'transformationParameters.seed': body.payload.seed,
        });
        console.log('Step 4 Complete: Processing record updated');

        console.log('Webhook processing completed successfully:', processingId);
        return NextResponse.json({ status: 'success' });
      } catch (error) {
        console.error('Failed to process webhook:', {
          processingId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Update record with error
        await VideoProcessingModel.findByIdAndUpdate(processingId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Failed to upload video to Cloudinary',
          processingCompletedAt: new Date(),
        });

        return NextResponse.json(
          { error: 'Failed to process video' },
          { status: 500 }
        );
      }
    } else {
      // Handle error case
      const errorMessage = body.error || body.payload_error || 'Failed to process video';
      console.error('Transformation failed:', {
        processingId,
        error: errorMessage,
        status: body.status,
      });
      
      await VideoProcessingModel.findByIdAndUpdate(processingId, {
        status: 'failed',
        error: errorMessage,
        processingCompletedAt: new Date(),
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 