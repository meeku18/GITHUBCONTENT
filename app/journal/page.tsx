'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Share2, 
  RefreshCw,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface JournalEntry {
  id: string;
  type: 'daily' | 'weekly';
  content: string;
  aiGenerated: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function Journal() {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJournalEntries();
    }
  }, [status]);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      } else {
        throw new Error('Failed to fetch journal entries');
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (type: 'daily' | 'weekly') => {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch('/api/journal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh journal entries
        await fetchJournalEntries();
      } else {
        throw new Error('Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const publishEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/journal/${entryId}/publish`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh journal entries
        await fetchJournalEntries();
      } else {
        throw new Error('Failed to publish entry');
      }
    } catch (error) {
      console.error('Error publishing entry:', error);
      setError('Failed to publish entry');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your journal.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>AI-Generated Summaries</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => generateSummary('daily')}
                  disabled={generating}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                  {generating ? 'Generating...' : 'Generate Daily'}
                </button>
                <button
                  onClick={() => generateSummary('weekly')}
                  disabled={generating}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Weekly
                </button>
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

          {/* Journal Entries */}
          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
                <p className="text-gray-500 mb-6">Generate your first AI-powered summary of your GitHub activities</p>
                <div className="space-x-4">
                  <button
                    onClick={() => generateSummary('daily')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Generate Daily Summary
                  </button>
                  <button
                    onClick={() => generateSummary('weekly')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Generate Weekly Summary
                  </button>
                </div>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {entry.type === 'daily' ? (
                            <Calendar className="w-5 h-5 text-blue-600" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {entry.type} Summary
                          </span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {entry.aiGenerated ? 'AI Generated' : 'Manual'}
                        </span>
                        {entry.published && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.createdAt)}
                        </span>
                        {!entry.published && (
                          <button
                            onClick={() => publishEntry(entry.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 