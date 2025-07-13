import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

    // Get user's current tracked repositories
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    const currentTrackedRepos = userSettings?.trackedRepositories || [];

    // Get all repositories from GitHub
    const githubService = new GitHubService(session.accessToken, session.user.id);
    const repositories = await githubService.getUserRepositories();

    // Mark which repositories are being tracked
    const reposWithTracking = repositories.map((repo: any) => ({
      ...repo,
      isTracked: currentTrackedRepos.includes(repo.full_name)
    }));

    return NextResponse.json(reposWithTracking);

  } catch (error) {
    console.error('Error syncing repositories:', error);
    return NextResponse.json(
      { error: 'Failed to sync repositories' },
      { status: 500 }
    );
  }
} 