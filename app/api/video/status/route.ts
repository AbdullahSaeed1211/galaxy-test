import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { VideoTransformation } from '@/lib/models/VideoTransformation';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
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

    const transformation = await VideoTransformation.findOne({
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
      transformationType: transformation.transformationType,
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
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { page = 1, limit = 10, status } = body;

    const query = { userId } as any;
    if (status) {
      query.status = status;
    }

    const transformations = await VideoTransformation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await VideoTransformation.countDocuments(query);

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