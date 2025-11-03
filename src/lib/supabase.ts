import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
export function getServerSupabase() {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_KEY

  if (!serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_KEY environment variable')
  }

  return createClient(supabaseUrl, serviceKey)
}
