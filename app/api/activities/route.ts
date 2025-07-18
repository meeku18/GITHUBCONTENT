import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleBuildTime } from '@/lib/build-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    // Get user's activities from database
    const activities = await prisma.gitHubActivity.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 activities
    });

    // Transform activities to match frontend interface
    const transformedActivities = activities.map((activity: any) => ({
      id: activity.id,
      type: activity.type as 'commit' | 'pull_request' | 'issue' | 'star' | 'comment',
      repository: activity.repository,
      title: activity.title || 'Activity',
      description: activity.description,
      url: activity.url,
      createdAt: activity.createdAt.toISOString()
    }));

    return NextResponse.json({
      activities: transformedActivities,
      total: activities.length
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
} 