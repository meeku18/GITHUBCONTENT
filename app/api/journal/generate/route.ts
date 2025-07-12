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

    const { type } = await request.json();

    if (!type || !['daily', 'weekly'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid summary type' },
        { status: 400 }
      );
    }

    // Get user's recent activities
    const activities = await prisma.gitHubActivity.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Get recent 100 activities
    });

    if (activities.length === 0) {
      return NextResponse.json(
        { error: 'No activities found. Please sync your GitHub data first.' },
        { status: 400 }
      );
    }

    // Filter activities based on type
    const now = new Date();
    let filteredActivities = activities;

    if (type === 'daily') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filteredActivities = activities.filter(activity => 
        new Date(activity.createdAt) >= yesterday
      );
    } else if (type === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredActivities = activities.filter(activity => 
        new Date(activity.createdAt) >= weekAgo
      );
    }

    if (filteredActivities.length === 0) {
      return NextResponse.json(
        { error: `No activities found for ${type} period.` },
        { status: 400 }
      );
    }

    // Generate AI summary (simplified for now - you can integrate with OpenAI later)
    const summary = generateAISummary(filteredActivities, type);

    // Save summary to database
    const savedSummary = await prisma.summary.create({
      data: {
        userId: session.user.id,
        type: type,
        content: summary,
        aiGenerated: true,
        published: false
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        id: savedSummary.id,
        type: savedSummary.type,
        content: savedSummary.content,
        aiGenerated: savedSummary.aiGenerated,
        published: savedSummary.published,
        createdAt: savedSummary.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

function generateAISummary(activities: any[], type: 'daily' | 'weekly'): string {
  // Group activities by type
  const commits = activities.filter(a => a.type === 'commit');
  const pullRequests = activities.filter(a => a.type === 'pull_request');
  const issues = activities.filter(a => a.type === 'issue');
  const stars = activities.filter(a => a.type === 'star');
  const comments = activities.filter(a => a.type === 'comment');

  // Get unique repositories
  const repositories = Array.from(new Set(activities.map(a => a.repository)));

  const period = type === 'daily' ? 'today' : 'this week';
  
  let summary = `## GitHub Activity Summary - ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
  
  summary += `Here's what you've been up to ${period}:\n\n`;

  if (commits.length > 0) {
    summary += `**Commits:** ${commits.length} commit${commits.length > 1 ? 's' : ''}\n`;
  }

  if (pullRequests.length > 0) {
    summary += `**Pull Requests:** ${pullRequests.length} PR${pullRequests.length > 1 ? 's' : ''}\n`;
  }

  if (issues.length > 0) {
    summary += `**Issues:** ${issues.length} issue${issues.length > 1 ? 's' : ''}\n`;
  }

  if (stars.length > 0) {
    summary += `**Stars:** ${stars.length} repository${stars.length > 1 ? 'ies' : 'y'} starred\n`;
  }

  if (comments.length > 0) {
    summary += `**Comments:** ${comments.length} comment${comments.length > 1 ? 's' : ''}\n`;
  }

  summary += `\n**Repositories worked on:** ${repositories.length}\n`;
  
  if (repositories.length > 0) {
    summary += `\n**Active repositories:**\n`;
    repositories.slice(0, 5).forEach(repo => {
      summary += `- ${repo}\n`;
    });
    if (repositories.length > 5) {
      summary += `- ... and ${repositories.length - 5} more\n`;
    }
  }

  summary += `\n**Total activities:** ${activities.length}\n\n`;
  summary += `Keep up the great work! 🚀`;

  return summary;
} 