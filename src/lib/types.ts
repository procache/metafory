// Database types for Supabase tables

export interface Metaphor {
  id: string
  slug: string
  nazev: string
  definice: string
  priklad: string
  zdroj: string | null
  autor_jmeno: string | null
  autor_email: string | null
  status: 'pending' | 'published' | 'rejected'
  created_at: string
  approved_at: string | null
}

export interface Vote {
  id: string
  metaphor_id: string
  vote_type: 'like' | 'dislike'
  ip_address: string
  cookie_id: string
  created_at: string
}

export interface MetaphorWithVotes extends Metaphor {
  like_count: number
  dislike_count: number
  score: number // likes - dislikes
}
