import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Dynamically import prisma to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Get user's integrations from database
    const integrations = await prisma.integration.findMany({
      where: { userId: session.user.id }
    });

    // Define available integrations
    const availableIntegrations = [
      {
        id: 'twitter',
        provider: 'twitter',
        name: 'Twitter/X',
        isConnected: integrations.some(integration => integration.provider === 'twitter' && integration.isActive),
        lastSync: integrations.find(integration => integration.provider === 'twitter')?.updatedAt
      },
      {
        id: 'linkedin',
        provider: 'linkedin',
        name: 'LinkedIn',
        isConnected: integrations.some(integration => integration.provider === 'linkedin' && integration.isActive),
        lastSync: integrations.find(integration => integration.provider === 'linkedin')?.updatedAt
      },
      {
        id: 'notion',
        provider: 'notion',
        name: 'Notion',
        isConnected: integrations.some(integration => integration.provider === 'notion' && integration.isActive),
        lastSync: integrations.find(integration => integration.provider === 'notion')?.updatedAt
      },
      {
        id: 'medium',
        provider: 'medium',
        name: 'Medium',
        isConnected: integrations.some(integration => integration.provider === 'medium' && integration.isActive),
        lastSync: integrations.find(integration => integration.provider === 'medium')?.updatedAt
      }
    ];

    return NextResponse.json(availableIntegrations);

  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
} 