'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { 
  Settings as SettingsIcon, 
  Github, 
  Twitter, 
  Linkedin, 
  BookOpen,
  Bell,
  Shield,
  User,
  Database,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Globe,
  Calendar,
  Mail
} from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string;
  language: string;
  stargazers_count: number;
  isTracked: boolean;
}

interface Integration {
  id: string;
  provider: 'twitter' | 'linkedin' | 'notion' | 'medium';
  name: string;
  isConnected: boolean;
  lastSync?: string;
}

interface UserSettings {
  autoPostToTwitter: boolean;
  autoPostToLinkedIn: boolean;
  autoPostToNotion: boolean;
  summaryFrequency: 'daily' | 'weekly' | 'monthly';
  emailDigestEnabled: boolean;
  emailDigestFrequency: 'daily' | 'weekly';
  aiPromptStyle: 'developer' | 'tweet' | 'narrative';
  isPublic: boolean;
  trackedRepositories: string[];
}

export default function Settings() {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    autoPostToTwitter: false,
    autoPostToLinkedIn: false,
    autoPostToNotion: false,
    summaryFrequency: 'weekly',
    emailDigestEnabled: false,
    emailDigestFrequency: 'weekly',
    aiPromptStyle: 'developer',
    isPublic: false,
    trackedRepositories: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'repositories' | 'integrations' | 'preferences' | 'security'>('repositories');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const [reposResponse, integrationsResponse, settingsResponse] = await Promise.all([
        fetch('/api/settings/repositories'),
        fetch('/api/settings/integrations'),
        fetch('/api/settings/preferences')
      ]);

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepositories(reposData);
      }

      if (integrationsResponse.ok) {
        const integrationsData = await integrationsResponse.json();
        setIntegrations(integrationsData);
      }

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRepositoryTracking = async (repoName: string, isTracked: boolean) => {
    try {
      const response = await fetch('/api/settings/repositories/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: repoName,
          isTracked: !isTracked
        })
      });

      if (response.ok) {
        setRepositories(prev => 
          prev.map(repo => 
            repo.name === repoName 
              ? { ...repo, isTracked: !isTracked }
              : repo
          )
        );
      }
    } catch (error) {
      console.error('Error toggling repository tracking:', error);
    }
  };

  const syncRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/repositories/sync', {
        method: 'POST'
      });

      if (response.ok) {
        const reposData = await response.json();
        setRepositories(reposData);
      }
    } catch (error) {
      console.error('Error syncing repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const connectIntegration = async (provider: string) => {
    try {
      const response = await fetch(`/api/settings/integrations/${provider}/connect`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        }
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
    }
  };

  const disconnectIntegration = async (provider: string) => {
    try {
      const response = await fetch(`/api/settings/integrations/${provider}/disconnect`, {
        method: 'POST'
      });

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.provider === provider 
              ? { ...integration, isConnected: false }
              : integration
          )
        );
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to access settings.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <SettingsIcon className="w-4 h-4" />
                  <span>Manage your preferences</span>
                </div>
              </div>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('repositories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'repositories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Repositories
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'integrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Integrations
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'repositories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">GitHub Repositories</h2>
                  <p className="text-sm text-gray-600">Choose which repositories to track for analytics and journaling</p>
                </div>
                <button
                  onClick={syncRepositories}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Sync Repositories
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repositories.map((repo) => (
                  <div key={repo.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{repo.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{repo.language}</span>
                          <span>{repo.stargazers_count} stars</span>
                          {repo.private && (
                            <span className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRepositoryTracking(repo.name, repo.isTracked)}
                        className={`ml-2 p-2 rounded-full ${
                          repo.isTracked 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-400 bg-gray-100'
                        }`}
                      >
                        {repo.isTracked ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                <p className="text-sm text-gray-600">Connect your accounts to automatically share your journal entries</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {integration.provider === 'twitter' && <Twitter className="w-6 h-6 text-blue-600" />}
                          {integration.provider === 'linkedin' && <Linkedin className="w-6 h-6 text-blue-600" />}
                          {integration.provider === 'notion' && <BookOpen className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{integration.name}</h3>
                          <p className="text-xs text-gray-500">
                            {integration.isConnected ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => 
                          integration.isConnected 
                            ? disconnectIntegration(integration.provider)
                            : connectIntegration(integration.provider)
                        }
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          integration.isConnected
                            ? 'text-red-600 bg-red-100 hover:bg-red-200'
                            : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                        {integration.isConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                <p className="text-sm text-gray-600">Customize your journaling and sharing preferences</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Summary Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary Frequency
                  </label>
                  <select
                    value={settings.summaryFrequency}
                    onChange={(e) => setSettings(prev => ({ ...prev, summaryFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* AI Prompt Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Writing Style
                  </label>
                  <select
                    value={settings.aiPromptStyle}
                    onChange={(e) => setSettings(prev => ({ ...prev, aiPromptStyle: e.target.value as 'developer' | 'tweet' | 'narrative' }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="developer">Developer-focused</option>
                    <option value="tweet">Tweet-friendly</option>
                    <option value="narrative">Narrative</option>
                  </select>
                </div>

                {/* Auto-posting toggles */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Auto-posting</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto-post to Twitter</p>
                        <p className="text-xs text-gray-500">Share summaries automatically</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoPostToTwitter: !prev.autoPostToTwitter }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.autoPostToTwitter ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.autoPostToTwitter ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto-post to LinkedIn</p>
                        <p className="text-xs text-gray-500">Share summaries automatically</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoPostToLinkedIn: !prev.autoPostToLinkedIn }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.autoPostToLinkedIn ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.autoPostToLinkedIn ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Email Digest */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Email Digest</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Digest</p>
                        <p className="text-xs text-gray-500">Receive summaries via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, emailDigestEnabled: !prev.emailDigestEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.emailDigestEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.emailDigestEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Privacy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Privacy</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Public Profile</p>
                        <p className="text-xs text-gray-500">Allow others to see your profile</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-600">Manage your account security and data</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* GitHub Connection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="w-6 h-6 text-gray-900" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">GitHub Account</p>
                      <p className="text-xs text-gray-500">Connected to GitHub</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>

                {/* Data Export */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Export Data</p>
                      <p className="text-xs text-gray-500">Download your data</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Export
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delete Account</p>
                      <p className="text-xs text-gray-500">Permanently delete your account</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 