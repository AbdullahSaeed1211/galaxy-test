import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import connectDB from '@/lib/mongodb';
import { FilterQuery, Model } from 'mongoose';

interface IVideoTransformation {
  _id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalVideo: {
    url: string;
    uploadcareId: string;
  };
  transformedVideo?: {
    url: string;
    cloudinaryId: string;
  };
  parameters: {
    prompt: string;
    video_url: string;
    num_inference_steps: number;
    seed: number;
    strength: number;
    aspect_ratio: '16:9' | '9:16';
    resolution: '480p' | '580p' | '720p';
    num_frames: '85' | '129';
    pro_mode: boolean;
    enable_safety_checker: boolean;
  };
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const transformationId = req.nextUrl.searchParams.get('id');
    if (!transformationId) {
      return NextResponse.json(
        { error: 'Transformation ID is required' },
        { status: 400 }
      );
    }

    const VideoTransformationModel = VideoTransformation as Model<IVideoTransformation>;
    const transformation = await VideoTransformationModel.findOne({
      _id: transformationId,
      userId,
    });

    if (!transformation) {
      return NextResponse.json(
        { error: 'Transformation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: transformation.status,
      originalVideo: transformation.originalVideo,
      transformedVideo: transformation.transformedVideo,
      parameters: transformation.parameters,
      error: transformation.error,
      startedAt: transformation.startedAt,
      completedAt: transformation.completedAt,
    });

  } catch (error) {
    console.error('Error in video status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all transformations for the user
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { page = 1, limit = 10, status } = body;

    const query: FilterQuery<IVideoTransformation> = { userId };
    if (status) {
      query.status = status;
    }

    const VideoTransformationModel = VideoTransformation as Model<IVideoTransformation>;
    const transformations = await VideoTransformationModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await VideoTransformationModel.countDocuments(query);

    return NextResponse.json({
      transformations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error in video history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 