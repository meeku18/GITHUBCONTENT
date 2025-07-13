import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleBuildTime } from '@/lib/build-utils';

export async function GET(request: NextRequest) {
  try {
    // Handle build-time scenarios
    const buildTimeResponse = handleBuildTime();
    if (buildTimeResponse) return buildTimeResponse;

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Dynamically import prisma to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');

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