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

    // Mock team data
    const teams = [
      {
        id: '1',
        name: 'React Masters',
        description: 'A community of React developers sharing knowledge, best practices, and building amazing applications together.',
        avatar: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=150&h=150&fit=crop',
        members: 1247,
        projects: 89,
        isPublic: true,
        tags: ['React', 'JavaScript', 'Frontend', 'UI/UX'],
        createdAt: '2023-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Python Pioneers',
        description: 'Backend developers and data scientists exploring Python, Django, Flask, and machine learning.',
        avatar: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop',
        members: 892,
        projects: 156,
        isPublic: true,
        tags: ['Python', 'Django', 'Data Science', 'ML'],
        createdAt: '2023-03-22T00:00:00Z'
      },
      {
        id: '3',
        name: 'DevOps Warriors',
        description: 'Infrastructure and DevOps engineers sharing cloud solutions, CI/CD practices, and automation strategies.',
        avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop',
        members: 567,
        projects: 78,
        isPublic: true,
        tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
        createdAt: '2023-02-10T00:00:00Z'
      },
      {
        id: '4',
        name: 'Mobile Innovators',
        description: 'Mobile app developers building the future of iOS, Android, and cross-platform applications.',
        avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=150&h=150&fit=crop',
        members: 734,
        projects: 123,
        isPublic: true,
        tags: ['iOS', 'Android', 'React Native', 'Flutter'],
        createdAt: '2023-04-05T00:00:00Z'
      },
      {
        id: '5',
        name: 'Startup Squad',
        description: 'Entrepreneurs and developers building the next generation of innovative startups and products.',
        avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
        members: 445,
        projects: 67,
        isPublic: false,
        tags: ['Startup', 'Innovation', 'Product', 'Growth'],
        createdAt: '2023-05-18T00:00:00Z'
      },
      {
        id: '6',
        name: 'Open Source Heroes',
        description: 'Contributors and maintainers of open source projects, making the world better through code.',
        avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
        members: 2156,
        projects: 234,
        isPublic: true,
        tags: ['Open Source', 'GitHub', 'Community', 'Contributing'],
        createdAt: '2023-01-08T00:00:00Z'
      }
    ];

    return NextResponse.json(teams);

  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
} 