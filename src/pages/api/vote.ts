import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Vote API error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
