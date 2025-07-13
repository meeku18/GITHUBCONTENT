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

    // Mock course data
    const courses = [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Master the basics of React including components, state, props, and hooks. Build your first React application.',
        thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
        instructor: 'Sarah Chen',
        instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        duration: '8 hours',
        level: 'beginner',
        rating: 4.8,
        students: 1247,
        lessons: 24,
        isCompleted: false,
        progress: 35,
        tags: ['React', 'JavaScript', 'Frontend', 'Components'],
        category: 'frontend'
      },
      {
        id: '2',
        title: 'Advanced TypeScript',
        description: 'Deep dive into TypeScript advanced features including generics, decorators, and advanced type patterns.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        instructor: 'Alex Rodriguez',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        duration: '12 hours',
        level: 'advanced',
        rating: 4.9,
        students: 892,
        lessons: 32,
        isCompleted: true,
        progress: 100,
        tags: ['TypeScript', 'JavaScript', 'Advanced', 'Types'],
        category: 'frontend'
      },
      {
        id: '3',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn RESTful APIs and authentication.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
        instructor: 'Michael Kim',
        instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        duration: '15 hours',
        level: 'intermediate',
        rating: 4.7,
        students: 1567,
        lessons: 28,
        isCompleted: false,
        progress: 0,
        tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
        category: 'backend'
      },
      {
        id: '4',
        title: 'Mobile App Development with React Native',
        description: 'Create cross-platform mobile applications using React Native. Build for both iOS and Android.',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        instructor: 'Lisa Wang',
        instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        duration: '18 hours',
        level: 'intermediate',
        rating: 4.6,
        students: 734,
        lessons: 36,
        isCompleted: false,
        progress: 0,
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        category: 'mobile'
      },
      {
        id: '5',
        title: 'DevOps and CI/CD Pipeline',
        description: 'Learn modern DevOps practices including Docker, Kubernetes, and automated deployment pipelines.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
        instructor: 'David Thompson',
        instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        duration: '20 hours',
        level: 'advanced',
        rating: 4.8,
        students: 445,
        lessons: 42,
        isCompleted: false,
        progress: 0,
        tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
        category: 'devops'
      },
      {
        id: '6',
        title: 'Data Science with Python',
        description: 'Introduction to data science using Python, pandas, numpy, and machine learning libraries.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        instructor: 'Emily Johnson',
        instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        duration: '16 hours',
        level: 'intermediate',
        rating: 4.5,
        students: 892,
        lessons: 30,
        isCompleted: false,
        progress: 0,
        tags: ['Python', 'Data Science', 'Pandas', 'Machine Learning'],
        category: 'data'
      }
    ];

    return NextResponse.json(courses);

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
} 