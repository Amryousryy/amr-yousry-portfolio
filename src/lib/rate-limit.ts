interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests } = config;

  return (identifier: string): { success: boolean; remaining: number; resetIn: number } => {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (entry.count >= maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetIn: entry.resetTime - now,
      };
    }

    entry.count++;
    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetIn: entry.resetTime - now,
    };
  };
}

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 100,
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 5,
});