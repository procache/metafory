import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
import type { MetaphorWithVotes } from '../../lib/types'

// Ensure this route is never prerendered (needed for Netlify)
export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const { data: metaphors, error } = await supabase
      .from('metaphors_with_votes')
      .select('*')
      .eq('status', 'published')
      .order('score', { ascending: false })
      .returns<MetaphorWithVotes[]>()

    if (error) {
      console.error('Error fetching metaphors:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch metaphors' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(metaphors || []),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Allow caching for 30 seconds, but revalidate in background
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (err) {
    console.error('Metaphors API error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
