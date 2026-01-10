import { useMutation, useQueryClient } from '@tanstack/react-query'
import { METAPHORS_QUERY_KEY } from './useMetaphors'
import type { MetaphorWithVotes } from '../types'

interface VoteParams {
  metaphorId: string
  voteType: 'like' | 'dislike'
  cookieId: string
}

interface VoteResponse {
  success: boolean
  votes: {
    like_count: number
    dislike_count: number
    score: number
  }
  error?: string
}

async function submitVote(params: VoteParams): Promise<VoteResponse> {
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metaphor_id: params.metaphorId,
      vote_type: params.voteType,
      cookie_id: params.cookieId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit vote')
  }

  return data
}

export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitVote,
    // Optimistic update: immediately update the UI
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: METAPHORS_QUERY_KEY })

      // Snapshot previous value
      const previousMetaphors = queryClient.getQueryData<MetaphorWithVotes[]>(METAPHORS_QUERY_KEY)

      // Optimistically update the cache
      if (previousMetaphors) {
        queryClient.setQueryData<MetaphorWithVotes[]>(METAPHORS_QUERY_KEY, (old) =>
          old?.map((metaphor) =>
            metaphor.id === variables.metaphorId
              ? {
                  ...metaphor,
                  like_count: variables.voteType === 'like'
                    ? metaphor.like_count + 1
                    : metaphor.like_count,
                  dislike_count: variables.voteType === 'dislike'
                    ? metaphor.dislike_count + 1
                    : metaphor.dislike_count,
                  score: variables.voteType === 'like'
                    ? metaphor.score + 1
                    : metaphor.score - 1,
                }
              : metaphor
          )
        )
      }

      return { previousMetaphors }
    },
    // On error, rollback to previous value
    onError: (_error, _variables, context) => {
      if (context?.previousMetaphors) {
        queryClient.setQueryData(METAPHORS_QUERY_KEY, context.previousMetaphors)
      }
    },
    // After success or error, invalidate to get fresh data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: METAPHORS_QUERY_KEY })
    },
  })
}
