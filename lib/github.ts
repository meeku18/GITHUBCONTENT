import { prisma } from './prisma';

export interface GitHubActivity {
  id: string;
  type: 'commit' | 'pull_request' | 'issue' | 'star' | 'comment';
  repository: string;
  title: string;
  description?: string;
  url: string;
  sha?: string;
  branch?: string;
  createdAt: string;
}

export class GitHubService {
  private accessToken: string;
  private userId: string;

  constructor(accessToken: string, userId: string) {
    this.accessToken = accessToken;
    this.userId = userId;
  }

  private async makeRequest(endpoint: string) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Journal-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserInfo() {
    return this.makeRequest('/user');
  }

  async getUserRepositories() {
    return this.makeRequest('/user/repos?sort=updated&per_page=100');
  }

  async getUserEvents() {
    return this.makeRequest('/users/me/events?per_page=100');
  }

  async getRepositoryActivity(owner: string, repo: string) {
    const [commits, pullRequests, issues] = await Promise.all([
      this.makeRequest(`/repos/${owner}/${repo}/commits?per_page=100`),
      this.makeRequest(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`),
      this.makeRequest(`/repos/${owner}/${repo}/issues?state=all&per_page=100`)
    ]);

    return { commits, pullRequests, issues };
  }

  async syncUserActivities() {
    try {
      // Dynamically import prisma
      const { prisma } = await import('./prisma');
      if (!prisma) throw new Error('Database connection not available');
      // Get user's tracked repositories
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: this.userId }
      });

      const trackedRepos = userSettings?.trackedRepositories || [];
      
      if (trackedRepos.length === 0) {
        // If no repositories are tracked, sync all user activities
        return await this.syncAllUserActivities();
      }

      // Sync activities for tracked repositories only
      const allActivities: GitHubActivity[] = [];
      
      for (const repoFullName of trackedRepos) {
        const [owner, repo] = repoFullName.split('/');
        if (owner && repo) {
          const repoActivities = await this.syncRepositoryActivities(owner, repo);
          allActivities.push(...repoActivities);
        }
      }
      
      return allActivities;
    } catch (error) {
      console.error('Error syncing user activities:', error);
      throw error;
    }
  }

  private async syncAllUserActivities() {
    try {
      // Get user's recent events
      const events = await this.getUserEvents();
      
      const activities: GitHubActivity[] = [];

      // Process events to extract activities
      for (const event of events) {
        let activity: Partial<GitHubActivity> = {
          type: 'commit',
          repository: event.repo?.name || 'unknown',
          title: event.type,
          url: event.url,
          createdAt: event.created_at,
        };

        switch (event.type) {
          case 'PushEvent':
            activity.type = 'commit';
            activity.title = `Pushed ${event.payload.commits?.length || 0} commits`;
            activity.description = event.payload.commits?.map((c: any) => c.message).join(', ');
            break;
          case 'PullRequestEvent':
            activity.type = 'pull_request';
            activity.title = event.payload.action === 'opened' ? 'Opened PR' : 'Updated PR';
            activity.description = event.payload.pull_request?.title;
            break;
          case 'IssuesEvent':
            activity.type = 'issue';
            activity.title = event.payload.action === 'opened' ? 'Opened issue' : 'Updated issue';
            activity.description = event.payload.issue?.title;
            break;
          case 'WatchEvent':
            activity.type = 'star';
            activity.title = 'Starred repository';
            activity.description = event.repo?.name;
            break;
          case 'IssueCommentEvent':
            activity.type = 'comment';
            activity.title = 'Commented on issue';
            activity.description = event.payload.comment?.body?.substring(0, 100);
            break;
        }

        if (activity.type && activity.repository) {
          activities.push(activity as GitHubActivity);
        }
      }

      // Store activities in database
      await this.storeActivities(activities);

      return activities;
    } catch (error) {
      console.error('Error syncing all user activities:', error);
      throw error;
    }
  }

  private async syncRepositoryActivities(owner: string, repo: string) {
    try {
      // Get repository events
      const events = await this.makeRequest(`/repos/${owner}/${repo}/events?per_page=50`);
      
      const activities: GitHubActivity[] = [];

      // Process events to extract activities
      for (const event of events) {
        let activity: Partial<GitHubActivity> = {
          type: 'commit',
          repository: `${owner}/${repo}`,
          title: event.type,
          url: event.url,
          createdAt: event.created_at,
        };

        switch (event.type) {
          case 'PushEvent':
            activity.type = 'commit';
            activity.title = `Pushed ${event.payload.commits?.length || 0} commits`;
            activity.description = event.payload.commits?.map((c: any) => c.message).join(', ');
            break;
          case 'PullRequestEvent':
            activity.type = 'pull_request';
            activity.title = event.payload.action === 'opened' ? 'Opened PR' : 'Updated PR';
            activity.description = event.payload.pull_request?.title;
            break;
          case 'IssuesEvent':
            activity.type = 'issue';
            activity.title = event.payload.action === 'opened' ? 'Opened issue' : 'Updated issue';
            activity.description = event.payload.issue?.title;
            break;
          case 'WatchEvent':
            activity.type = 'star';
            activity.title = 'Starred repository';
            activity.description = `${owner}/${repo}`;
            break;
          case 'IssueCommentEvent':
            activity.type = 'comment';
            activity.title = 'Commented on issue';
            activity.description = event.payload.comment?.body?.substring(0, 100);
            break;
        }

        if (activity.type && activity.repository) {
          activities.push(activity as GitHubActivity);
        }
      }

      // Store activities in database
      await this.storeActivities(activities);

      return activities;
    } catch (error) {
      console.error(`Error syncing repository activities for ${owner}/${repo}:`, error);
      return [];
    }
  }

  private async storeActivities(activities: GitHubActivity[]) {
    const { prisma } = await import('./prisma');
    if (!prisma) throw new Error('Database connection not available');
    const existingActivities = await prisma.gitHubActivity.findMany({
      where: { userId: this.userId },
      select: { url: true }
    });

    const existingUrls = new Set(existingActivities.map(a => a.url));

    const newActivities = activities.filter(activity => !existingUrls.has(activity.url));

    if (newActivities.length > 0) {
      await prisma.gitHubActivity.createMany({
        data: newActivities.map(activity => ({
          userId: this.userId,
          type: activity.type,
          repository: activity.repository,
          title: activity.title,
          description: activity.description,
          url: activity.url,
          sha: activity.sha,
          branch: activity.branch,
        }))
      });
    }

    return newActivities.length;
  }

  async generateSummary(activities: GitHubActivity[], period: 'daily' | 'weekly' = 'daily') {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'daily') {
      startDate.setDate(now.getDate() - 1);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const filteredActivities = activities.filter(activity => 
      new Date(activity.createdAt) >= startDate
    );

    const summary = {
      period,
      totalActivities: filteredActivities.length,
      commits: filteredActivities.filter(a => a.type === 'commit').length,
      pullRequests: filteredActivities.filter(a => a.type === 'pull_request').length,
      issues: filteredActivities.filter(a => a.type === 'issue').length,
      repositories: Array.from(new Set(filteredActivities.map(a => a.repository))),
      activities: filteredActivities
    };

    return summary;
  }
} 