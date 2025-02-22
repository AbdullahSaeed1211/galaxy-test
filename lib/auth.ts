import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function requireAuth() {
  const session = await auth();
  if (!session.userId) {
    throw new Error('Unauthorized');
  }
  return session.userId;
}

type ApiHandler = (userId: string) => Promise<NextResponse>;

export async function protectApiRoute(handler: ApiHandler) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(session.userId);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 