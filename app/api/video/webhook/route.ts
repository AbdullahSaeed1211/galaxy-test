import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/cloudinary';
import { VideoProcessing } from '@/lib/models/video';
import connectToDatabase from '@/lib/mongodb';

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

    const body: HunyuanWebhookBody = await req.json();

    // Find the processing record by request ID
    await connectToDatabase();
    const videoProcessing = await VideoProcessing.findOne({
      'transformationParameters.requestId': body.request_id,
    });

    if (!videoProcessing) {
      return NextResponse.json(
        { error: 'Processing record not found' },
        { status: 404 }
      );
    }

    if (body.status === 'failed' || body.error) {
      // Update record with error
      videoProcessing.status = 'failed';
      videoProcessing.error = body.error || 'Unknown error occurred';
      await videoProcessing.save();

      return NextResponse.json({ status: 'failed', error: body.error });
    }

    if (!body.output?.video?.url) {
      return NextResponse.json(
        { error: 'Missing transformed video URL' },
        { status: 400 }
      );
    }

    // Upload transformed video to Cloudinary
    const cloudinaryUrl = await uploadVideo(
      body.output.video.url,
      `transformed-${videoProcessing._id}`
    );

    // Update processing record
    videoProcessing.transformedVideoUrl = cloudinaryUrl;
    videoProcessing.status = 'completed';
    await videoProcessing.save();

    return NextResponse.json({
      status: 'completed',
      transformedVideoUrl: cloudinaryUrl,
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
} 