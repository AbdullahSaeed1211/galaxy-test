import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Webhook secret should be configured in Fal AI dashboard and stored in environment variables
const WEBHOOK_SECRET = process.env.FAL_AI_WEBHOOK_SECRET;

interface UpdateData {
  status: 'completed' | 'failed';
  transformedVideo?: {
    url: string;
  };
  completedAt?: Date;
  error?: string;
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
    // You should implement this based on Fal AI's webhook signature verification requirements

    await connectDB();

    const body = await req.json();
    const {
      transformation_id,
      status,
      output_url,
      error,
    } = body;

    if (!transformation_id) {
      return NextResponse.json(
        { error: 'Missing transformation ID' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const transformation = await db.models.VideoTransformation.findOne({ _id: transformation_id });
    if (!transformation) {
      return NextResponse.json(
        { error: 'Transformation not found' },
        { status: 404 }
      );
    }

    // Update transformation status
    const updateData: UpdateData = {
      status: status === 'completed' ? 'completed' : 'failed',
    };

    if (status === 'completed' && output_url) {
      updateData.transformedVideo = {
        url: output_url,
      };
      updateData.completedAt = new Date();
    } else if (error) {
      updateData.error = error;
    }

    await db.models.VideoTransformation.updateOne(
      { _id: transformation_id },
      { $set: updateData }
    );

    // TODO: Implement notification sending (email, push, etc.)
    // This would be handled by a separate notification service

    return NextResponse.json({
      message: 'Webhook processed successfully',
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
} 