import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GitHubService } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's tracked repositories from database
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    const trackedRepos = userSettings?.trackedRepositories || [];

    // Get all user repositories from GitHub
    const githubService = new GitHubService(session.accessToken, session.user.id);
    const repositories = await githubService.getUserRepositories();

    // Mark which repositories are being tracked
    const reposWithTracking = repositories.map((repo: any) => ({
      ...repo,
      isTracked: trackedRepos.includes(repo.full_name)
    }));

    return NextResponse.json(reposWithTracking);

  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { repository, isTracked } = await request.json();

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      );
    }

    // Get or create user settings
    let userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          trackedRepositories: []
        }
      });
    }

    // Update tracked repositories
    let trackedRepos = userSettings.trackedRepositories;
    
    if (isTracked) {
      if (!trackedRepos.includes(repository)) {
        trackedRepos.push(repository);
      }
    } else {
      trackedRepos = trackedRepos.filter((repo: any) => repo !== repository);
    }

    // Update user settings
    await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: {
        trackedRepositories: trackedRepos
      }
    });

    return NextResponse.json({
      success: true,
      message: `Repository ${isTracked ? 'added to' : 'removed from'} tracking`,
      trackedRepositories: trackedRepos
    });

  } catch (error) {
    console.error('Error updating repository tracking:', error);
    return NextResponse.json(
      { error: 'Failed to update repository tracking' },
      { status: 500 }
    );
  }
} 