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

    // Mock developer data
    const developers = [
      {
        id: '1',
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Full-stack developer passionate about React, TypeScript, and building scalable applications.',
        location: 'San Francisco, CA',
        company: 'TechCorp',
        followers: 1247,
        following: 89,
        repositories: 23,
        stars: 156,
        contributions: 342,
        languages: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        isOnline: true,
        lastActive: '2 minutes ago'
      },
      {
        id: '2',
        name: 'Alex Rodriguez',
        username: 'alexrodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Backend engineer specializing in Python, Django, and cloud infrastructure.',
        location: 'New York, NY',
        company: 'StartupXYZ',
        followers: 892,
        following: 156,
        repositories: 18,
        stars: 89,
        contributions: 267,
        languages: ['Python', 'Django', 'AWS', 'PostgreSQL'],
        isOnline: false,
        lastActive: '1 hour ago'
      },
      {
        id: '3',
        name: 'Emily Johnson',
        username: 'emilyjohnson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Frontend developer and UI/UX enthusiast. Love creating beautiful, accessible interfaces.',
        location: 'Austin, TX',
        company: 'DesignStudio',
        followers: 2156,
        following: 234,
        repositories: 31,
        stars: 423,
        contributions: 567,
        languages: ['JavaScript', 'React', 'Vue.js', 'CSS', 'Figma'],
        isOnline: true,
        lastActive: '5 minutes ago'
      },
      {
        id: '4',
        name: 'Michael Kim',
        username: 'michaelkim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'DevOps engineer and open source contributor. Building the future of cloud infrastructure.',
        location: 'Seattle, WA',
        company: 'CloudTech',
        followers: 3456,
        following: 445,
        repositories: 45,
        stars: 789,
        contributions: 892,
        languages: ['Go', 'Kubernetes', 'Docker', 'Terraform', 'Python'],
        isOnline: false,
        lastActive: '3 hours ago'
      },
      {
        id: '5',
        name: 'Lisa Wang',
        username: 'lisawang',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Mobile developer focused on iOS and React Native. Creating apps that make a difference.',
        location: 'Boston, MA',
        company: 'MobileFirst',
        followers: 1678,
        following: 123,
        repositories: 28,
        stars: 234,
        contributions: 445,
        languages: ['Swift', 'React Native', 'JavaScript', 'iOS'],
        isOnline: true,
        lastActive: '1 minute ago'
      },
      {
        id: '6',
        name: 'David Thompson',
        username: 'davidthompson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Senior software architect with 10+ years experience in enterprise systems and microservices.',
        location: 'Chicago, IL',
        company: 'EnterpriseCorp',
        followers: 2987,
        following: 178,
        repositories: 52,
        stars: 567,
        contributions: 1234,
        languages: ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'Docker'],
        isOnline: false,
        lastActive: '2 hours ago'
      }
    ];

    return NextResponse.json(developers);

  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
} 