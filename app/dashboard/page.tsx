'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  Calendar, 
  GitBranch, 
  Star, 
  MessageCircle, 
  TrendingUp,
  BookOpen,
  Settings,
  Bell,
  Share2,
  BarChart3,
  Activity,
  Clock,
  User,
  Github
} from 'lucide-react';

interface ActivitySummary {
  id: string;
  type: 'commit' | 'pull_request' | 'issue' | 'star' | 'comment';
  title: string;
  description: string;
  repository: string;
  timestamp: string;
  impact: 'low' | 'medium' | 'high';
}

interface Stats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  weeklyActivity: number;
  monthlyActivity: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalStars: 0,
    weeklyActivity: 0,
    monthlyActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      setTimeout(() => {
        setActivities([
          {
            id: '1',
            type: 'commit',
            title: 'Added new authentication features',
            description: 'Implemented OAuth2 flow with GitHub integration',
            repository: 'github-journal-app',
            timestamp: '2024-01-15T10:30:00Z',
            impact: 'high',
          },
          {
            id: '2',
            type: 'pull_request',
            title: 'Fix dashboard responsive design',
            description: 'Improved mobile layout and accessibility',
            repository: 'github-journal-app',
            timestamp: '2024-01-14T15:45:00Z',
            impact: 'medium',
          },
          {
            id: '3',
            type: 'issue',
            title: 'Add dark mode support',
            description: 'Request for dark theme implementation',
            repository: 'github-journal-app',
            timestamp: '2024-01-13T09:20:00Z',
            impact: 'medium',
          },
          {
            id: '4',
            type: 'star',
            title: 'Repository starred',
            description: 'Your repository received a star',
            repository: 'awesome-project',
            timestamp: '2024-01-12T14:15:00Z',
            impact: 'low',
          },
          {
            id: '5',
            type: 'comment',
            title: 'Code review comment',
            description: 'Helpful feedback on PR #123',
            repository: 'github-journal-app',
            timestamp: '2024-01-11T11:30:00Z',
            impact: 'medium',
          },
        ]);
        setStats({
          totalCommits: 47,
          totalPRs: 12,
          totalIssues: 8,
          totalStars: 23,
          weeklyActivity: 15,
          monthlyActivity: 67,
        });
        setLoading(false);
      }, 1000);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  function getActivityIcon(type: string) {
    switch (type) {
      case 'commit':
        return <GitBranch className="w-4 h-4" />;
      case 'pull_request':
        return <GitBranch className="w-4 h-4" />;
      case 'issue':
        return <MessageCircle className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  }

  function getImpactColor(impact: string) {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {status === 'loading' ? 'Checking authentication...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your dashboard.</p>
          <Link 
            href="/api/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Github className="w-4 h-4" />
                  <span>{session?.user?.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/notifications" className="p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                </Link>
                <Link href="/settings" className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Commits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCommits}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GitBranch className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pull Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPRs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stars</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStars}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                    <Link href="/activities" className="text-sm text-blue-600 hover:text-blue-700">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(activity.impact)}`}>
                              {activity.impact}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{activity.repository}</span>
                            <span>{formatDate(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <Link href="/journal" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">View Journal</span>
                    </Link>
                    <Link href="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Analytics</span>
                    </Link>
                    <Link href="/share" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Share Progress</span>
                    </Link>
                    <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Settings</span>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Weekly Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Activities</span>
                      <span className="text-lg font-semibold text-gray-900">{stats.weeklyActivity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="text-lg font-semibold text-gray-900">{stats.monthlyActivity}</span>
                    </div>
                    <div className="pt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>Trending up 12% from last week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Recent Repositories */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Repositories</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">github-journal-app</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">awesome-project</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">react-components</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 