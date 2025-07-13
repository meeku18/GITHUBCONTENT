import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  public config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const requestData = this.requests.get(identifier);

    if (!requestData || now > requestData.resetTime) {
      // Reset or create new entry
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return false;
    }

    if (requestData.count >= this.config.max) {
      return true;
    }

    // Increment count
    requestData.count++;
    return false;
  }

  getRemainingRequests(identifier: string): number {
    const requestData = this.requests.get(identifier);
    if (!requestData || Date.now() > requestData.resetTime) {
      return this.config.max;
    }
    return Math.max(0, this.config.max - requestData.count);
  }

  getResetTime(identifier: string): number {
    const requestData = this.requests.get(identifier);
    return requestData?.resetTime || Date.now() + this.config.windowMs;
  }
}

// Create rate limiters for different endpoints
const rateLimiters = {
  api: new RateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), // 10 auth attempts per 15 minutes
  webhook: new RateLimiter({ windowMs: 60 * 1000, max: 1000 }), // 1000 webhook calls per minute
  sync: new RateLimiter({ windowMs: 5 * 60 * 1000, max: 10 }), // 10 syncs per 5 minutes
};

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  type: keyof typeof rateLimiters = 'api'
) {
  return async (request: NextRequest) => {
    const identifier = getClientIdentifier(request);
    const rateLimiter = rateLimiters[type];

    if (rateLimiter.isRateLimited(identifier)) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimiter.getResetTime(identifier) - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimiter.config.max.toString(),
            'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(identifier).toString(),
            'X-RateLimit-Reset': rateLimiter.getResetTime(identifier).toString(),
            'Retry-After': Math.ceil((rateLimiter.getResetTime(identifier) - Date.now()) / 1000).toString()
          }
        }
      );
    }

    return handler(request);
  };
}

function getClientIdentifier(request: NextRequest): string {
  // Use IP address as primary identifier
  const ip = request.ip || 
             request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // For authenticated requests, include user ID
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Extract user ID from JWT token (simplified)
    try {
      const token = authHeader.replace('Bearer ', '');
      // In a real implementation, you'd decode the JWT to get the user ID
      return `${ip}:authenticated`;
    } catch {
      return ip;
    }
  }

  return ip;
}

// Specific rate limiters for different endpoints
export const apiRateLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, 'api');

export const authRateLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, 'auth');

export const webhookRateLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, 'webhook');

export const syncRateLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, 'sync'); 