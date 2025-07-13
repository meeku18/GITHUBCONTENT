import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Skip database operations during build time or when DATABASE_URL is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Skip during build time to prevent static generation issues
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        entries: [],
        total: 0
      });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Dynamically import prisma to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Get user's journal entries from database
    const entries = await prisma.summary.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform entries to match frontend interface
    const transformedEntries = entries.map(entry => ({
      id: entry.id,
      type: entry.type as 'daily' | 'weekly',
      content: entry.content,
      aiGenerated: entry.aiGenerated,
      published: entry.published,
      publishedAt: entry.publishedAt?.toISOString(),
      createdAt: entry.createdAt.toISOString()
    }));

    return NextResponse.json({
      entries: transformedEntries,
      total: entries.length
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
} 