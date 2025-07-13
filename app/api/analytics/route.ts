import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Skip database operations during build time
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';

    // Dynamically import prisma to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');

    // Get user's activities
    const activities = await prisma.gitHubActivity.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (activities.length === 0) {
      return NextResponse.json({
        productivityScore: 0,
        streakDays: 0,
        totalContributions: 0,
        topLanguages: [],
        activityHeatmap: [],
        repositoryStats: [],
        weeklyTrends: [],
        achievements: [],
        recommendations: []
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredActivities = activities.filter(activity => 
      new Date(activity.createdAt) >= startDate
    );

    // Calculate productivity score
    const productivityScore = calculateProductivityScore(filteredActivities);

    // Calculate streak days
    const streakDays = calculateStreakDays(activities);

    // Get top languages (simulated - in real app, you'd analyze commit messages)
    const topLanguages = [
      { language: 'JavaScript', commits: Math.floor(Math.random() * 50) + 20 },
      { language: 'TypeScript', commits: Math.floor(Math.random() * 30) + 15 },
      { language: 'Python', commits: Math.floor(Math.random() * 25) + 10 },
      { language: 'React', commits: Math.floor(Math.random() * 20) + 8 },
      { language: 'Node.js', commits: Math.floor(Math.random() * 15) + 5 }
    ].sort((a, b) => b.commits - a.commits);

    // Repository stats
    const repositoryStats = [
      { name: 'github-journal-app', commits: 47, stars: 12 },
      { name: 'awesome-project', commits: 23, stars: 8 },
      { name: 'react-components', commits: 15, stars: 5 },
      { name: 'api-backend', commits: 12, stars: 3 },
      { name: 'mobile-app', commits: 8, stars: 2 }
    ];

    // Weekly trends
    const weeklyTrends = generateWeeklyTrends(filteredActivities);

    // Achievements
    const achievements = generateAchievements(activities);

    // Recommendations
    const recommendations = generateRecommendations(filteredActivities, productivityScore);

    return NextResponse.json({
      productivityScore,
      streakDays,
      totalContributions: filteredActivities.length,
      topLanguages,
      activityHeatmap: generateActivityHeatmap(filteredActivities),
      repositoryStats,
      weeklyTrends,
      achievements,
      recommendations
    });

  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}

function calculateProductivityScore(activities: any[]): number {
  if (activities.length === 0) return 0;

  const commits = activities.filter(a => a.type === 'commit').length;
  const prs = activities.filter(a => a.type === 'pull_request').length;
  const issues = activities.filter(a => a.type === 'issue').length;
  
  // Weight different activities
  const score = (commits * 2 + prs * 3 + issues * 2) / activities.length * 10;
  return Math.min(Math.round(score), 100);
}

function calculateStreakDays(activities: any[]): number {
  if (activities.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate.toDateString() === currentDate.toDateString();
    });

    if (dayActivities.length > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function generateWeeklyTrends(activities: any[]): Array<{ week: string; commits: number; prs: number; issues: number }> {
  const trends = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekActivities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate >= weekStart && activityDate <= weekEnd;
    });

    trends.push({
      week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: weekActivities.filter(a => a.type === 'commit').length,
      prs: weekActivities.filter(a => a.type === 'pull_request').length,
      issues: weekActivities.filter(a => a.type === 'issue').length
    });
  }

  return trends;
}

function generateAchievements(activities: any[]): Array<{ id: string; name: string; description: string; earnedAt: string; icon: string }> {
  const achievements = [];
  const totalActivities = activities.length;
  const commits = activities.filter(a => a.type === 'commit').length;
  const prs = activities.filter(a => a.type === 'pull_request').length;

  if (totalActivities >= 100) {
    achievements.push({
      id: '1',
      name: 'Century Club',
      description: 'Completed 100+ activities',
      earnedAt: new Date().toISOString(),
      icon: '🏆'
    });
  }

  if (commits >= 50) {
    achievements.push({
      id: '2',
      name: 'Code Master',
      description: 'Made 50+ commits',
      earnedAt: new Date().toISOString(),
      icon: '💻'
    });
  }

  if (prs >= 10) {
    achievements.push({
      id: '3',
      name: 'Collaborator',
      description: 'Created 10+ pull requests',
      earnedAt: new Date().toISOString(),
      icon: '🤝'
    });
  }

  if (activities.length > 0) {
    achievements.push({
      id: '4',
      name: 'First Steps',
      description: 'Started your GitHub journey',
      earnedAt: activities[activities.length - 1].createdAt,
      icon: '🚀'
    });
  }

  return achievements;
}

function generateRecommendations(activities: any[], productivityScore: number): Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }> {
  const recommendations: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];

  if (productivityScore < 60) {
    recommendations.push({
      type: 'productivity',
      title: 'Boost Your Productivity',
      description: 'Try to make at least one commit daily to improve your productivity score.',
      priority: 'high'
    });
  }

  const commits = activities.filter(a => a.type === 'commit').length;
  const prs = activities.filter(a => a.type === 'pull_request').length;

  if (commits > 0 && prs === 0) {
    recommendations.push({
      type: 'collaboration',
      title: 'Start Collaborating',
      description: 'Try creating pull requests to collaborate with other developers.',
      priority: 'medium'
    });
  }

  if (activities.length < 10) {
    recommendations.push({
      type: 'activity',
      title: 'Stay Active',
      description: 'Regular activity helps build your developer profile and skills.',
      priority: 'medium'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'maintenance',
      title: 'Keep Up the Great Work!',
      description: 'You\'re doing excellent! Consider exploring new technologies or contributing to open source.',
      priority: 'low'
    });
  }

  return recommendations;
}

function generateActivityHeatmap(activities: any[]): Array<{ date: string; count: number }> {
  const heatmap = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate.toDateString() === date.toDateString();
    });

    heatmap.push({
      date: date.toISOString().split('T')[0],
      count: dayActivities.length
    });
  }

  return heatmap;
} 