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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleVote('like')}
          disabled={hasVoted || isVoting}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
            ${hasVoted || isVoting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-50 text-green-700 hover:bg-green-100 active:scale-95'
            }
          `}
          aria-label="Líbí se mi"
        >
          <span className="text-2xl">👍</span>
          <span className="text-lg">{likes}</span>
        </button>

        <button
          onClick={() => handleVote('dislike')}
          disabled={hasVoted || isVoting}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
            ${hasVoted || isVoting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-700 hover:bg-red-100 active:scale-95'
            }
          `}
          aria-label="Nelíbí se mi"
        >
          <span className="text-2xl">👎</span>
          <span className="text-lg">{dislikes}</span>
        </button>

        <div className="ml-auto text-gray-600">
          Skóre: <span className="font-semibold text-xl">{score}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {hasVoted && !error && (
        <p className="text-green-600 text-sm">Děkujeme za váš hlas!</p>
      )}

      {isVoting && (
        <p className="text-gray-500 text-sm">Odesílám...</p>
      )}
    </div>
  )
}
