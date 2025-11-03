import { useState, useEffect } from 'react'

interface VoteButtonsProps {
  metaphorId: string
  initialLikes: number
  initialDislikes: number
  initialScore: number
}

export default function VoteButtons({
  metaphorId,
  initialLikes,
  initialDislikes,
  initialScore
}: VoteButtonsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [score, setScore] = useState(initialScore)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate or retrieve cookie ID for anti-spam
  useEffect(() => {
    const existingCookie = localStorage.getItem('voter_id')
    if (!existingCookie) {
      const newCookie = crypto.randomUUID()
      localStorage.setItem('voter_id', newCookie)
    }

    // Check if user already voted on this metaphor
    const votedMetaphors = JSON.parse(localStorage.getItem('voted_metaphors') || '[]')
    if (votedMetaphors.includes(metaphorId)) {
      setHasVoted(true)
    }
  }, [metaphorId])

  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    setError(null)

    try {
      const cookieId = localStorage.getItem('voter_id')

      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaphor_id: metaphorId,
          vote_type: voteType,
          cookie_id: cookieId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError('Už jste hlasovali')
          setHasVoted(true)
        } else {
          setError(data.error || 'Chyba při hlasování')
        }
        return
      }

      // Update vote counts
      setLikes(data.votes.like_count)
      setDislikes(data.votes.dislike_count)
      setScore(data.votes.score)
      setHasVoted(true)

      // Remember this vote in localStorage
      const votedMetaphors = JSON.parse(localStorage.getItem('voted_metaphors') || '[]')
      votedMetaphors.push(metaphorId)
      localStorage.setItem('voted_metaphors', JSON.stringify(votedMetaphors))
    } catch (err) {
      console.error('Vote error:', err)
      setError('Nepodařilo se odeslat hlas')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => handleVote('like')}
          disabled={hasVoted || isVoting}
          className={`
            flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 rounded font-medium transition-colors text-sm sm:text-base
            ${hasVoted || isVoting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
            }
          `}
          aria-label="Líbí se mi"
        >
          <span className="text-lg sm:text-xl">👍</span>
          <span>{likes}</span>
        </button>

        <button
          onClick={() => handleVote('dislike')}
          disabled={hasVoted || isVoting}
          className={`
            flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 rounded font-medium transition-colors text-sm sm:text-base
            ${hasVoted || isVoting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
            }
          `}
          aria-label="Nelíbí se mi"
        >
          <span className="text-lg sm:text-xl">👎</span>
          <span>{dislikes}</span>
        </button>
      </div>

      {error && (
        <p className="text-xs sm:text-sm text-gray-600">{error}</p>
      )}

      {hasVoted && !error && (
        <p className="text-xs sm:text-sm text-gray-600">Děkujeme za váš hlas</p>
      )}

      {isVoting && (
        <p className="text-xs sm:text-sm text-gray-500">Odesílám...</p>
      )}
    </div>
  )
}
