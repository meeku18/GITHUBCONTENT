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

    // Mock challenges data
    const challenges = [
      {
        id: '1',
        title: 'Build a Todo App with React',
        description: 'Create a fully functional todo application using React hooks and local storage. Include add, edit, delete, and mark complete functionality.',
        difficulty: 'easy',
        points: 50,
        timeLimit: 30,
        isCompleted: true,
        category: 'frontend',
        tags: ['React', 'JavaScript', 'Hooks', 'Local Storage']
      },
      {
        id: '2',
        title: 'API Integration Challenge',
        description: 'Build a weather app that fetches data from a public API and displays it in a beautiful UI. Handle loading states and errors.',
        difficulty: 'medium',
        points: 100,
        timeLimit: 60,
        isCompleted: false,
        category: 'frontend',
        tags: ['API', 'Fetch', 'Async/Await', 'Error Handling']
      },
      {
        id: '3',
        title: 'TypeScript Type Challenge',
        description: 'Create complex TypeScript types for a user management system. Include interfaces, generics, and utility types.',
        difficulty: 'hard',
        points: 150,
        timeLimit: 45,
        isCompleted: false,
        category: 'frontend',
        tags: ['TypeScript', 'Types', 'Interfaces', 'Generics']
      },
      {
        id: '4',
        title: 'Node.js REST API',
        description: 'Build a RESTful API with Node.js and Express. Include CRUD operations, authentication, and data validation.',
        difficulty: 'medium',
        points: 120,
        timeLimit: 90,
        isCompleted: false,
        category: 'backend',
        tags: ['Node.js', 'Express', 'REST API', 'Authentication']
      },
      {
        id: '5',
        title: 'Database Design Challenge',
        description: 'Design and implement a database schema for an e-commerce platform. Include relationships, indexes, and optimization.',
        difficulty: 'hard',
        points: 200,
        timeLimit: 120,
        isCompleted: false,
        category: 'backend',
        tags: ['Database', 'SQL', 'Schema Design', 'Optimization']
      },
      {
        id: '6',
        title: 'Docker Containerization',
        description: 'Containerize a web application using Docker. Create multi-stage builds and docker-compose for development.',
        difficulty: 'medium',
        points: 80,
        timeLimit: 60,
        isCompleted: false,
        category: 'devops',
        tags: ['Docker', 'Containerization', 'Multi-stage Builds']
      },
      {
        id: '7',
        title: 'CSS Grid Layout Mastery',
        description: 'Create a responsive dashboard layout using CSS Grid. Include complex layouts and responsive breakpoints.',
        difficulty: 'easy',
        points: 40,
        timeLimit: 30,
        isCompleted: true,
        category: 'frontend',
        tags: ['CSS', 'Grid', 'Responsive Design', 'Layout']
      },
      {
        id: '8',
        title: 'State Management with Redux',
        description: 'Implement a shopping cart using Redux Toolkit. Include actions, reducers, and middleware.',
        difficulty: 'hard',
        points: 180,
        timeLimit: 90,
        isCompleted: false,
        category: 'frontend',
        tags: ['Redux', 'State Management', 'Redux Toolkit']
      },
      {
        id: '9',
        title: 'Python Data Analysis',
        description: 'Analyze a dataset using pandas and matplotlib. Create visualizations and statistical summaries.',
        difficulty: 'medium',
        points: 100,
        timeLimit: 75,
        isCompleted: false,
        category: 'data',
        tags: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis']
      },
      {
        id: '10',
        title: 'Git Workflow Challenge',
        description: 'Practice advanced Git workflows including branching, merging, rebasing, and resolving conflicts.',
        difficulty: 'medium',
        points: 60,
        timeLimit: 45,
        isCompleted: false,
        category: 'tools',
        tags: ['Git', 'Branching', 'Merging', 'Workflow']
      },
      {
        id: '11',
        title: 'React Native Mobile App',
        description: 'Build a simple mobile app using React Native. Include navigation, state management, and native features.',
        difficulty: 'hard',
        points: 250,
        timeLimit: 120,
        isCompleted: false,
        category: 'mobile',
        tags: ['React Native', 'Mobile', 'Navigation', 'Native Features']
      },
      {
        id: '12',
        title: 'AWS Lambda Function',
        description: 'Create a serverless function using AWS Lambda. Deploy and test the function with API Gateway.',
        difficulty: 'hard',
        points: 150,
        timeLimit: 90,
        isCompleted: false,
        category: 'devops',
        tags: ['AWS', 'Lambda', 'Serverless', 'API Gateway']
      }
    ];

    return NextResponse.json(challenges);

  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
} 