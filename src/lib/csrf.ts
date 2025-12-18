/**
 * CSRF Protection Utilities
 * Validates Origin and Referer headers to prevent Cross-Site Request Forgery attacks
 */

/**
 * List of allowed origins for CSRF protection
 * Add your production domain and local development URLs
 */
const ALLOWED_ORIGINS = [
  'https://metafory.cz',
  'https://www.metafory.cz',
  'http://localhost:4321',
  'http://localhost:3000',
  'http://127.0.0.1:4321',
  'http://127.0.0.1:3000'
]

/**
 * Allowed Netlify domain patterns for preview/deploy URLs
 */
const ALLOWED_NETLIFY_PATTERNS = [
  /^https:\/\/[a-z0-9-]+--metafory\.netlify\.app$/,
  /^https:\/\/[a-z0-9-]+\.netlify\.app$/
]

/**
 * Check if the origin matches allowed origins or patterns
 */
function isOriginAllowed(origin: string | null, requestHost: string | null): boolean {
  if (!origin) return false

  // Check explicit allowed origins
  if (ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed + '/'))) {
    return true
  }

  // Check Netlify patterns
  if (ALLOWED_NETLIFY_PATTERNS.some(pattern => pattern.test(origin))) {
    return true
  }

  // Dynamic check: if origin host matches request host, it's same-origin
  if (requestHost) {
    try {
      const originUrl = new URL(origin)
      // Compare hosts (handles both with and without port)
      if (originUrl.host === requestHost) {
        return true
      }
    } catch {
      // Invalid origin URL
    }
  }

  return false
}

/**
 * Check if the referer matches allowed origins or patterns
 */
function isRefererAllowed(referer: string | null, requestHost: string | null): boolean {
  if (!referer) return false

  // Check explicit allowed origins
  if (ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))) {
    return true
  }

  // Check Netlify patterns
  if (ALLOWED_NETLIFY_PATTERNS.some(pattern => pattern.test(new URL(referer).origin))) {
    return true
  }

  // Dynamic check: if referer host matches request host, it's same-origin
  if (requestHost) {
    try {
      const refererUrl = new URL(referer)
      if (refererUrl.host === requestHost) {
        return true
      }
    } catch {
      // Invalid referer URL
    }
  }

  return false
}

/**
 * Validate CSRF headers (Origin and Referer)
 * Returns true if request is valid, false otherwise
 *
 * @param request - The incoming request
 * @returns boolean - True if CSRF validation passes
 */
export function validateCsrf(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // For POST requests, we require either Origin or Referer header
  // Origin is preferred (more secure), Referer is fallback
  if (origin) {
    return isOriginAllowed(origin, host)
  }

  if (referer) {
    return isRefererAllowed(referer, host)
  }

  // Neither Origin nor Referer present - reject
  return false
}

/**
 * Create a standardized CSRF error response
 */
export function createCsrfErrorResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'Neplatný požadavek. Zkuste obnovit stránku a zkusit znovu.'
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
