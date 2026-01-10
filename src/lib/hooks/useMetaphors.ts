import { useQuery } from '@tanstack/react-query'
import type { MetaphorWithVotes } from '../types'

export const METAPHORS_QUERY_KEY = ['metaphors'] as const

async function fetchMetaphors(): Promise<MetaphorWithVotes[]> {
  const response = await fetch('/api/metaphors')

  if (!response.ok) {
    throw new Error('Failed to fetch metaphors')
  }

  return response.json()
}

interface UseMetaphorsOptions {
  initialData?: MetaphorWithVotes[]
}

export function useMetaphors({ initialData }: UseMetaphorsOptions = {}) {
  return useQuery({
    queryKey: METAPHORS_QUERY_KEY,
    queryFn: fetchMetaphors,
    // Use SSG data as initial data for instant display
    initialData,
    // Consider initial data as stale so we refetch in background
    staleTime: 0,
  })
}
