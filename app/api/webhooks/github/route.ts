import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    
    // Verify webhook signature (optional but recommended)
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
        .update(body)
        .digest('hex')}`;
      
      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(body);
    const eventType = request.headers.get('x-github-event');

    // Dynamically import prisma to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Process different GitHub events
    switch (eventType) {
      case 'push':
        await handlePushEvent(event, prisma);
        break;
      case 'pull_request':
        await handlePullRequestEvent(event, prisma);
        break;
      case 'issues':
        await handleIssuesEvent(event, prisma);
        break;
      case 'issue_comment':
        await handleIssueCommentEvent(event, prisma);
        break;
      case 'create':
        await handleCreateEvent(event, prisma);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePushEvent(event: any, prisma: any) {
  const repository = event.repository.full_name;
  const commits = event.commits || [];
  const sender = event.sender;

  // Find users tracking this repository
  const usersTrackingRepo = await prisma.userSettings.findMany({
    where: {
      trackedRepositories: {
        has: repository
      }
    },
    include: {
      user: true
    }
  });

  for (const userSetting of usersTrackingRepo) {
    for (const commit of commits) {
      // Check if activity already exists
      const existingActivity = await prisma.gitHubActivity.findFirst({
        where: {
          userId: userSetting.userId,
          url: commit.url,
          type: 'commit'
        }
      });

      if (!existingActivity) {
        await prisma.gitHubActivity.create({
          data: {
            userId: userSetting.userId,
            type: 'commit',
            repository: repository,
            title: `Pushed commit: ${commit.message.split('\n')[0]}`,
            description: commit.message,
            url: commit.url,
            sha: commit.id,
            branch: event.ref.replace('refs/heads/', '')
          }
        });
      }
    }
  }
}

async function handlePullRequestEvent(event: any, prisma: any) {
  const repository = event.repository.full_name;
  const pullRequest = event.pull_request;
  const action = event.action;

  // Find users tracking this repository
  const usersTrackingRepo = await prisma.userSettings.findMany({
    where: {
      trackedRepositories: {
        has: repository
      }
    }
  });

  for (const userSetting of usersTrackingRepo) {
    // Check if activity already exists
    const existingActivity = await prisma.gitHubActivity.findFirst({
      where: {
        userId: userSetting.userId,
        url: pullRequest.html_url,
        type: 'pull_request'
      }
    });

    if (!existingActivity) {
      await prisma.gitHubActivity.create({
        data: {
          userId: userSetting.userId,
          type: 'pull_request',
          repository: repository,
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} pull request`,
          description: pullRequest.title,
          url: pullRequest.html_url,
          branch: pullRequest.head.ref
        }
      });
    }
  }
}

async function handleIssuesEvent(event: any, prisma: any) {
  const repository = event.repository.full_name;
  const issue = event.issue;
  const action = event.action;

  // Find users tracking this repository
  const usersTrackingRepo = await prisma.userSettings.findMany({
    where: {
      trackedRepositories: {
        has: repository
      }
    }
  });

  for (const userSetting of usersTrackingRepo) {
    // Check if activity already exists
    const existingActivity = await prisma.gitHubActivity.findFirst({
      where: {
        userId: userSetting.userId,
        url: issue.html_url,
        type: 'issue'
      }
    });

    if (!existingActivity) {
      await prisma.gitHubActivity.create({
        data: {
          userId: userSetting.userId,
          type: 'issue',
          repository: repository,
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} issue`,
          description: issue.title,
          url: issue.html_url
        }
      });
    }
  }
}

async function handleIssueCommentEvent(event: any, prisma: any) {
  const repository = event.repository.full_name;
  const comment = event.comment;
  const action = event.action;

  // Find users tracking this repository
  const usersTrackingRepo = await prisma.userSettings.findMany({
    where: {
      trackedRepositories: {
        has: repository
      }
    }
  });

  for (const userSetting of usersTrackingRepo) {
    // Check if activity already exists
    const existingActivity = await prisma.gitHubActivity.findFirst({
      where: {
        userId: userSetting.userId,
        url: comment.html_url,
        type: 'comment'
      }
    });

    if (!existingActivity) {
      await prisma.gitHubActivity.create({
        data: {
          userId: userSetting.userId,
          type: 'comment',
          repository: repository,
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} comment on issue`,
          description: comment.body?.substring(0, 200),
          url: comment.html_url
        }
      });
    }
  }
}

async function handleCreateEvent(event: any, prisma: any) {
  const repository = event.repository.full_name;
  const refType = event.ref_type; // branch, tag, etc.

  if (refType === 'branch') {
    // Find users tracking this repository
    const usersTrackingRepo = await prisma.userSettings.findMany({
      where: {
        trackedRepositories: {
          has: repository
        }
      }
    });

    for (const userSetting of usersTrackingRepo) {
      await prisma.gitHubActivity.create({
        data: {
          userId: userSetting.userId,
          type: 'commit',
          repository: repository,
          title: `Created branch: ${event.ref}`,
          description: `New branch created: ${event.ref}`,
          url: `${event.repository.html_url}/tree/${event.ref}`,
          branch: event.ref
        }
      });
    }
  }
} 