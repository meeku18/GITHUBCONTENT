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
  Github,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface GitHubActivity {
  id: string;
  type: 'commit' | 'pull_request' | 'issue' | 'star' | 'comment';
  repository: string;
  title: string;
  description?: string;
  url: string;
  createdAt: string;
}

interface DashboardStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  weeklyActivity: number;
  monthlyActivity: number;
  totalRepositories: number;
}

interface GitHubUser {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalStars: 0,
    weeklyActivity: 0,
    monthlyActivity: 0,
    totalRepositories: 0,
  });
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch GitHub user info and repositories
      const githubResponse = await fetch('/api/github/sync');
      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        setGithubUser(githubData.user);
        setStats(prev => ({
          ...prev,
          totalRepositories: githubData.repositories.length
        }));
      }

      // Fetch user activities from database
      const activitiesResponse = await fetch('/api/activities');
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.activities);
        
        // Calculate stats from real activities
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const weeklyActivities = activitiesData.activities.filter((activity: GitHubActivity) => 
          new Date(activity.createdAt) >= weekAgo
        );
        const monthlyActivities = activitiesData.activities.filter((activity: GitHubActivity) => 
          new Date(activity.createdAt) >= monthAgo
        );

        setStats({
          totalCommits: activitiesData.activities.filter((a: GitHubActivity) => a.type === 'commit').length,
          totalPRs: activitiesData.activities.filter((a: GitHubActivity) => a.type === 'pull_request').length,
          totalIssues: activitiesData.activities.filter((a: GitHubActivity) => a.type === 'issue').length,
          totalStars: activitiesData.activities.filter((a: GitHubActivity) => a.type === 'star').length,
          weeklyActivity: weeklyActivities.length,
          monthlyActivity: monthlyActivities.length,
          totalRepositories: githubUser?.public_repos || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Sync GitHub activities
  const syncGitHubActivities = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/github/sync', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh dashboard data after sync
        await fetchDashboardData();
      } else {
        throw new Error('Failed to sync activities');
      }
    } catch (error) {
      console.error('Error syncing activities:', error);
      setError('Failed to sync GitHub activities');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const getActivityIcon = (type: string) => {
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
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'bg-blue-100 text-blue-800';
      case 'pull_request':
        return 'bg-green-100 text-green-800';
      case 'issue':
        return 'bg-yellow-100 text-yellow-800';
      case 'star':
        return 'bg-purple-100 text-purple-800';
      case 'comment':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

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
                  <span>{githubUser?.login || session?.user?.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={syncGitHubActivities}
                  disabled={syncing}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync GitHub'}
                </button>
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
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

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
                  <p className="text-sm font-medium text-gray-600">Repositories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRepositories}</p>
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
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No activities found</p>
                      <p className="text-sm text-gray-400 mt-2">Click "Sync GitHub" to load your activities</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {getActivityIcon(activity.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                                {activity.type}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{activity.repository}</span>
                              <span>{getTimeAgo(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="text-lg font-semibold text-gray-900">{stats.weeklyActivity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="text-lg font-semibold text-gray-900">{stats.monthlyActivity}</span>
                    </div>
                    <div className="pt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>
                          {stats.weeklyActivity > 0 ? 'Active this week' : 'No activity this week'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Profile */}
              {githubUser && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">GitHub Profile</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={githubUser.avatar_url} 
                        alt={githubUser.login}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{githubUser.name || githubUser.login}</p>
                        <p className="text-xs text-gray-500">@{githubUser.login}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repositories</span>
                        <span className="font-medium">{githubUser.public_repos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Followers</span>
                        <span className="font-medium">{githubUser.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Following</span>
                        <span className="font-medium">{githubUser.following}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 