/**
 * Simple in-memory rate limiting for API endpoints
 * Tracks requests by IP address
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Store rate limit data in memory (per-function instance)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 10 * 60 * 1000)

interface RateLimitConfig {
  maxRequests: number // Maximum requests allowed
  windowMs: number // Time window in milliseconds
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // First request or window expired - create new record
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, {
      count: 1,
      resetTime
    })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime
    }
  }

  // Window still active
  if (record.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    }
  }

  // Increment count
  record.count++
  rateLimitStore.set(key, record)

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime
  }
}

/**
 * Extract IP address from request headers
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  )
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Submit new metaphor: 3 submissions per hour per IP
  SUBMIT: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  // Contact form: 5 messages per hour per IP
  CONTACT: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  // Vote: 50 votes per 15 minutes per IP (generous for browsing)
  VOTE: {
    maxRequests: 50,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
} as const
