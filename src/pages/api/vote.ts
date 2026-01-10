import type { APIRoute } from 'astro'
import { getServerSupabase } from '../../lib/supabase'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../lib/rate-limit'
import { validateCsrf, createCsrfErrorResponse } from '../../lib/csrf'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // CSRF Protection: Validate Origin/Referer headers
    if (!validateCsrf(request)) {
      return createCsrfErrorResponse()
    }

    // Check rate limit
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.VOTE)

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      return new Response(
        JSON.stringify({
          error: 'Příliš mnoho požadavků. Zkuste to prosím později.',
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMITS.VOTE.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    // Use service role for database operations (bypasses RLS)
    const supabase = getServerSupabase()

    const body = await request.json()
    const { metaphor_id, vote_type, cookie_id } = body

    // Validate input
    if (!metaphor_id || !vote_type || !cookie_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (vote_type !== 'like' && vote_type !== 'dislike') {
      return new Response(
        JSON.stringify({ error: 'Invalid vote type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get IP address for anti-spam
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown'

    // Try to insert vote
    const { data, error } = await supabase
      .from('votes')
      .insert({
        metaphor_id,
        vote_type,
        ip_address,
        cookie_id
      })
      .select()

    if (error) {
      // Check if it's a duplicate vote (unique constraint violation)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Already voted' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        )
      }

      console.error('Vote error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to record vote' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch updated vote counts
    const { data: metaphor } = await supabase
      .from('metaphors_with_votes')
      .select('like_count, dislike_count, score')
      .eq('id', metaphor_id)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        votes: metaphor || { like_count: 0, dislike_count: 0, score: 0 }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMITS.VOTE.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      }
    )
  } catch (err) {
    console.error('Vote API error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
