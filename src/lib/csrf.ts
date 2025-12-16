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
 * Check if the origin matches allowed origins
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false

  return ALLOWED_ORIGINS.some(allowed => {
    // Exact match or starts with allowed origin (for subdomains)
    return origin === allowed || origin.startsWith(allowed + '/')
  })
}

/**
 * Check if the referer matches allowed origins
 */
function isRefererAllowed(referer: string | null): boolean {
  if (!referer) return false

  return ALLOWED_ORIGINS.some(allowed => {
    return referer.startsWith(allowed)
  })
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

  // For POST requests, we require either Origin or Referer header
  // Origin is preferred (more secure), Referer is fallback
  if (origin) {
    return isOriginAllowed(origin)
  }

  if (referer) {
    return isRefererAllowed(referer)
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
