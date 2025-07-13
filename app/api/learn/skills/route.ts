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

    // Mock skills data
    const skills = [
      {
        id: '1',
        name: 'JavaScript',
        icon: '💻',
        level: 8,
        targetLevel: 10,
        progress: 80,
        category: 'frontend',
        lastPracticed: '2 hours ago'
      },
      {
        id: '2',
        name: 'React',
        icon: '⚛️',
        level: 7,
        targetLevel: 9,
        progress: 78,
        category: 'frontend',
        lastPracticed: '1 day ago'
      },
      {
        id: '3',
        name: 'TypeScript',
        icon: '📘',
        level: 6,
        targetLevel: 8,
        progress: 75,
        category: 'frontend',
        lastPracticed: '3 days ago'
      },
      {
        id: '4',
        name: 'Node.js',
        icon: '🟢',
        level: 5,
        targetLevel: 8,
        progress: 63,
        category: 'backend',
        lastPracticed: '1 week ago'
      },
      {
        id: '5',
        name: 'Python',
        icon: '🐍',
        level: 4,
        targetLevel: 7,
        progress: 57,
        category: 'backend',
        lastPracticed: '2 weeks ago'
      },
      {
        id: '6',
        name: 'Docker',
        icon: '🐳',
        level: 3,
        targetLevel: 6,
        progress: 50,
        category: 'devops',
        lastPracticed: '1 month ago'
      },
      {
        id: '7',
        name: 'Git',
        icon: '📚',
        level: 9,
        targetLevel: 10,
        progress: 90,
        category: 'tools',
        lastPracticed: '5 hours ago'
      },
      {
        id: '8',
        name: 'CSS',
        icon: '🎨',
        level: 8,
        targetLevel: 9,
        progress: 89,
        category: 'frontend',
        lastPracticed: '1 day ago'
      },
      {
        id: '9',
        name: 'SQL',
        icon: '🗄️',
        level: 6,
        targetLevel: 8,
        progress: 75,
        category: 'backend',
        lastPracticed: '4 days ago'
      },
      {
        id: '10',
        name: 'AWS',
        icon: '☁️',
        level: 4,
        targetLevel: 7,
        progress: 57,
        category: 'devops',
        lastPracticed: '2 weeks ago'
      },
      {
        id: '11',
        name: 'MongoDB',
        icon: '🍃',
        level: 5,
        targetLevel: 7,
        progress: 71,
        category: 'backend',
        lastPracticed: '1 week ago'
      },
      {
        id: '12',
        name: 'Kubernetes',
        icon: '⚓',
        level: 2,
        targetLevel: 6,
        progress: 33,
        category: 'devops',
        lastPracticed: '1 month ago'
      }
    ];

    return NextResponse.json(skills);

  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
} 