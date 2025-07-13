import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Update the summary to mark it as published
    const updatedSummary = await prisma.summary.update({
      where: {
        id: id,
        userId: session.user.id // Ensure user owns this summary
      },
      data: {
        published: true,
        publishedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        id: updatedSummary.id,
        published: updatedSummary.published,
        publishedAt: updatedSummary.publishedAt?.toISOString()
      }
    });

  } catch (error) {
    console.error('Error publishing summary:', error);
    return NextResponse.json(
      { error: 'Failed to publish summary' },
      { status: 500 }
    );
  }
} 