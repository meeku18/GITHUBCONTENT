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

    // Mock event data
    const events = [
      {
        id: '1',
        title: 'React Conf 2024',
        description: 'The premier conference for React developers. Learn from the best, network with peers, and discover the future of React.',
        date: '2024-03-15',
        time: '09:00 AM',
        location: 'San Francisco, CA',
        attendees: 1247,
        maxAttendees: 1500,
        organizer: 'React Team',
        organizerAvatar: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=150&h=150&fit=crop',
        tags: ['React', 'JavaScript', 'Frontend', 'Conference'],
        isOnline: false
      },
      {
        id: '2',
        title: 'DevOps Summit',
        description: 'Join DevOps professionals for a day of learning about CI/CD, cloud infrastructure, and automation best practices.',
        date: '2024-02-28',
        time: '10:00 AM',
        location: 'Austin, TX',
        attendees: 567,
        maxAttendees: 800,
        organizer: 'DevOps Community',
        organizerAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop',
        tags: ['DevOps', 'CI/CD', 'Cloud', 'Automation'],
        isOnline: false
      },
      {
        id: '3',
        title: 'Python Web Development Workshop',
        description: 'Hands-on workshop covering Django, Flask, and modern Python web development techniques.',
        date: '2024-03-10',
        time: '02:00 PM',
        location: 'Online',
        attendees: 234,
        maxAttendees: 300,
        organizer: 'Python Developers',
        organizerAvatar: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop',
        tags: ['Python', 'Django', 'Flask', 'Web Development'],
        isOnline: true
      },
      {
        id: '4',
        title: 'Mobile App Development Meetup',
        description: 'Monthly meetup for mobile developers. This month: React Native vs Flutter - A Deep Dive.',
        date: '2024-02-20',
        time: '06:30 PM',
        location: 'New York, NY',
        attendees: 89,
        maxAttendees: 120,
        organizer: 'Mobile Dev NYC',
        organizerAvatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=150&h=150&fit=crop',
        tags: ['Mobile', 'React Native', 'Flutter', 'iOS', 'Android'],
        isOnline: false
      },
      {
        id: '5',
        title: 'Open Source Contribution Day',
        description: 'Spend a day contributing to open source projects. Mentors available for beginners and experienced developers.',
        date: '2024-03-05',
        time: '11:00 AM',
        location: 'Online',
        attendees: 445,
        maxAttendees: 500,
        organizer: 'Open Source Heroes',
        organizerAvatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
        tags: ['Open Source', 'GitHub', 'Contributing', 'Community'],
        isOnline: true
      },
      {
        id: '6',
        title: 'Startup Tech Talk Series',
        description: 'Weekly tech talks from successful startup founders and technical leaders. This week: Scaling Infrastructure.',
        date: '2024-02-25',
        time: '07:00 PM',
        location: 'Seattle, WA',
        attendees: 156,
        maxAttendees: 200,
        organizer: 'Startup Squad',
        organizerAvatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
        tags: ['Startup', 'Scaling', 'Infrastructure', 'Tech Talks'],
        isOnline: false
      }
    ];

    return NextResponse.json(events);

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 