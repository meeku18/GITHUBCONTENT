'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  GitBranch, 
  Star, 
  MessageCircle,
  Award,
  Target,
  Zap,
  Activity,
  Clock,
  Users,
  Globe,
  Trophy,
  Flame,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface AnalyticsData {
  productivityScore: number;
  streakDays: number;
  totalContributions: number;
  topLanguages: Array<{ language: string; commits: number }>;
  activityHeatmap: Array<{ date: string; count: number }>;
  repositoryStats: Array<{ name: string; commits: number; stars: number }>;
  weeklyTrends: Array<{ week: string; commits: number; prs: number; issues: number }>;
  achievements: Array<{ id: string; name: string; description: string; earnedAt: string; icon: string }>;
  recommendations: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
}

export default function Analytics() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics();
    }
  }, [status, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProductivityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your analytics.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4" />
                  <span>Developer Insights</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
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

          {analytics ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                      <p className={`text-2xl font-bold ${getProductivityColor(analytics.productivityScore)}`}>
                        {analytics.productivityScore}%
                      </p>
                      <p className="text-xs text-gray-500">{getProductivityLabel(analytics.productivityScore)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Flame className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Streak Days</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.streakDays}</p>
                      <p className="text-xs text-gray-500">Keep it up! 🔥</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GitBranch className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalContributions}</p>
                      <p className="text-xs text-gray-500">This {timeRange}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Achievements</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.achievements.length}</p>
                      <p className="text-xs text-gray-500">Unlocked</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Languages */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Top Programming Languages</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analytics.topLanguages.map((lang, index) => (
                      <div key={lang.language} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                          <span className="text-sm text-gray-600">{lang.language}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(lang.commits / analytics.topLanguages[0].commits) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{lang.commits}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Repository Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Repository Performance</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analytics.repositoryStats.slice(0, 5).map((repo) => (
                        <div key={repo.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{repo.name}</p>
                            <p className="text-xs text-gray-500">{repo.commits} commits</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{repo.stars}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Weekly Trends</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analytics.weeklyTrends.slice(-4).map((week) => (
                        <div key={week.week} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{week.week}</span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-gray-600">{week.commits}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-gray-600">{week.prs}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{week.issues}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.achievements.slice(0, 6).map((achievement) => (
                      <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(achievement.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analytics.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          rec.priority === 'high' ? 'bg-red-100' : 
                          rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Target className={`w-4 h-4 ${
                            rec.priority === 'high' ? 'text-red-600' : 
                            rec.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{rec.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data yet</h3>
              <p className="text-gray-500">Sync your GitHub data to see detailed analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 