import { NextResponse } from 'next/server';

export function handleBuildTime() {
  // Check if we're in build mode or production without database
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
  
  return null; // Continue with normal execution
}

export function isBuildTime(): boolean {
  return process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;
} 