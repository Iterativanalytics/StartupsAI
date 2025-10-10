export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(userId: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get user's request history
    const userRequests = this.requests.get(userId) || [];

    // Filter to only requests within the current window
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= this.config.maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + this.config.windowMs - now) / 1000);

      return {
        allowed: false,
        retryAfter
      };
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);

    // Clean up old data periodically
    if (Math.random() < 0.1) {
      this.cleanup();
    }

    return { allowed: true };
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.config.windowMs * 2;

    for (const [userId, requests] of this.requests.entries()) {
      const filtered = requests.filter(timestamp => timestamp > cutoff);
      
      if (filtered.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, filtered);
      }
    }
  }

  reset(userId: string): void {
    this.requests.delete(userId);
  }

  getStats(userId: string): { requests: number; remaining: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const userRequests = this.requests.get(userId) || [];
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);

    return {
      requests: recentRequests.length,
      remaining: Math.max(0, this.config.maxRequests - recentRequests.length)
    };
  }
}

// Preset rate limiters
export const RATE_LIMITS = {
  FREE_TIER: new RateLimiter({
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Rate limit exceeded. Please upgrade for more requests.'
  }),
  
  PRO_TIER: new RateLimiter({
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Rate limit exceeded. Please wait before making more requests.'
  }),
  
  ENTERPRISE_TIER: new RateLimiter({
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Rate limit exceeded. Contact support for higher limits.'
  })
};