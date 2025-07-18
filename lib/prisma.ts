import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only use the mock during the build phase
const isBuildTime = () => {
  return process.env.NEXT_PHASE === 'phase-production-build';
};

// Create a mock Prisma client for build time
const createMockPrisma = () => {
  return {
    gitHubActivity: {
      findMany: async () => [],
      findFirst: async () => null,
      create: async () => ({ id: 'mock-id' }),
      update: async () => ({ id: 'mock-id' }),
    },
    summary: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({ id: 'mock-id' }),
      update: async () => ({ id: 'mock-id' }),
    },
    user: {
      findUnique: async () => null,
      update: async () => ({ id: 'mock-id' }),
    },
    userSettings: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({ id: 'mock-id' }),
      update: async () => ({ id: 'mock-id' }),
      upsert: async () => ({ id: 'mock-id' }),
    },
    integration: {
      findMany: async () => [],
    },
  } as any;
};

export const prisma = isBuildTime() 
  ? createMockPrisma()
  : (globalForPrisma.prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 