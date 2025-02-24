import { NextRequest, NextResponse } from 'next/server';
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import connectDB from '@/lib/mongodb';
import { uploadToCloudinary } from '@/lib/utils/video';
import { Model } from 'mongoose';
import { IVideoTransformation, FalWebhookPayload } from '@/lib/types/video';

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
  try {
    // Get transformation ID from query params
    const url = new URL(req.url);
    const transformationId = url.searchParams.get('transformationId');
    
    if (!transformationId) {
      console.error('Missing transformationId in webhook request');
      return NextResponse.json({ error: 'Missing transformationId' }, { status: 400 });
    }

    await connectDB();

    const body = await req.json() as FalWebhookPayload;
    console.log('Received webhook for transformation:', transformationId, 'Status:', body.status);

    const VideoTransformationModel = VideoTransformation as Model<IVideoTransformation>;
    const transformation = await VideoTransformationModel.findById(transformationId);
    if (!transformation) {
      console.error('Transformation not found:', transformationId);
      return NextResponse.json({ error: 'Transformation not found' }, { status: 404 });
    }

    if (body.status === 'OK' && body.payload?.video?.url) {
      try {
        // Upload to Cloudinary for permanent storage with retry logic
        console.log('Uploading video to Cloudinary for transformation:', transformationId);
        const cloudinaryUrl = await uploadToCloudinaryWithRetry(body.payload.video.url);
        
        // Update transformation record
        await VideoTransformationModel.findByIdAndUpdate(transformationId, {
          status: 'completed',
          'transformedVideo.url': cloudinaryUrl,
          completedAt: new Date(),
          'parameters.seed': body.payload.seed,
        });

        console.log('Successfully processed transformation:', transformationId);
        return NextResponse.json({ status: 'success' });
      } catch (error) {
        console.error('Failed to process transformation:', transformationId, error);
        
        // Handle Cloudinary upload failure
        await VideoTransformationModel.findByIdAndUpdate(transformationId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Failed to upload video to Cloudinary',
          completedAt: new Date(),
        });

        return NextResponse.json(
          { error: 'Failed to process video' },
          { status: 500 }
        );
      }
    } else {
      // Handle error case
      const errorMessage = body.error || body.payload_error || 'Failed to process video';
      console.error('Transformation failed:', transformationId, errorMessage);
      
      await VideoTransformationModel.findByIdAndUpdate(transformationId, {
        status: 'failed',
        error: errorMessage,
        completedAt: new Date(),
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