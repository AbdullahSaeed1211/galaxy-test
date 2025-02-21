import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { VideoProcessing } from '@/lib/models/video';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Get processing history for user
    const history = await VideoProcessing.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
} 