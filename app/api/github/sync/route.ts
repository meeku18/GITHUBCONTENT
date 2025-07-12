import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GitHubService } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const githubService = new GitHubService(session.accessToken, session.user.id);
    
    // Sync activities from GitHub
    const activities = await githubService.syncUserActivities();
    
    return NextResponse.json({
      success: true,
      message: `Synced ${activities.length} new activities`,
      activitiesCount: activities.length
    });

  } catch (error) {
    console.error('Error syncing GitHub activities:', error);
    return NextResponse.json(
      { error: 'Failed to sync activities' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const githubService = new GitHubService(session.accessToken, session.user.id);
    
    // Get user info and repositories
    const [userInfo, repositories] = await Promise.all([
      githubService.getUserInfo(),
      githubService.getUserRepositories()
    ]);
    
    return NextResponse.json({
      user: userInfo,
      repositories: repositories.slice(0, 10) // Return top 10 repos
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
} 