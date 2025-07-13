import { NextResponse } from 'next/server';

export function handleBuildTime() {
  // Check if we're in build mode or production without database
  // Also check for Vercel build environment
  if (
    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL ||
    process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL ||
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    return NextResponse.json(
      { activities: [], total: 0 },
      { status: 200 }
    );
  }
  
  return null; // Continue with normal execution
}

export function isBuildTime(): boolean {
  return (
    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL ||
    process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL ||
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  );
} 