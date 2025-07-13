import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user settings from database
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    // Get user profile for public setting
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPublic: true }
    });

    if (!userSettings) {
      // Return default settings if none exist
      return NextResponse.json({
        autoPostToTwitter: false,
        autoPostToLinkedIn: false,
        autoPostToNotion: false,
        summaryFrequency: 'weekly',
        emailDigestEnabled: false,
        emailDigestFrequency: 'weekly',
        aiPromptStyle: 'developer',
        isPublic: user?.isPublic || false,
        trackedRepositories: []
      });
    }

    return NextResponse.json({
      autoPostToTwitter: userSettings.autoPostToTwitter,
      autoPostToLinkedIn: userSettings.autoPostToLinkedIn,
      autoPostToNotion: userSettings.autoPostToNotion,
      summaryFrequency: userSettings.summaryFrequency,
      emailDigestEnabled: userSettings.emailDigestEnabled,
      emailDigestFrequency: userSettings.emailDigestFrequency,
      aiPromptStyle: userSettings.aiPromptStyle,
      isPublic: user?.isPublic || false,
      trackedRepositories: userSettings.trackedRepositories
    });

  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await request.json();

    // Validate required fields
    const requiredFields = [
      'autoPostToTwitter',
      'autoPostToLinkedIn', 
      'autoPostToNotion',
      'summaryFrequency',
      'emailDigestEnabled',
      'emailDigestFrequency',
      'aiPromptStyle',
      'isPublic'
    ];

    for (const field of requiredFields) {
      if (settings[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Update or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        autoPostToTwitter: settings.autoPostToTwitter,
        autoPostToLinkedIn: settings.autoPostToLinkedIn,
        autoPostToNotion: settings.autoPostToNotion,
        summaryFrequency: settings.summaryFrequency,
        emailDigestEnabled: settings.emailDigestEnabled,
        emailDigestFrequency: settings.emailDigestFrequency,
        aiPromptStyle: settings.aiPromptStyle,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        autoPostToTwitter: settings.autoPostToTwitter,
        autoPostToLinkedIn: settings.autoPostToLinkedIn,
        autoPostToNotion: settings.autoPostToNotion,
        summaryFrequency: settings.summaryFrequency,
        emailDigestEnabled: settings.emailDigestEnabled,
        emailDigestFrequency: settings.emailDigestFrequency,
        aiPromptStyle: settings.aiPromptStyle,
        trackedRepositories: settings.trackedRepositories || []
      }
    });

    // Update user's public profile setting
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isPublic: settings.isPublic
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: userSettings
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 