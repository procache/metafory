import { useState, useEffect } from 'react'

interface VoteButtonsProps {
  metaphorId: string
  initialLikes: number
}

export default function VoteButtons({
  metaphorId,
  initialLikes
}: VoteButtonsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

      // Update vote count
      setLikes(data.votes.like_count)
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

  const handleCopyLink = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote('like')}
          disabled={hasVoted || isVoting}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-sm
            ${hasVoted || isVoting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105'
            }
          `}
          style={{
            backgroundColor: hasVoted || isVoting ? '#d0d0d0' : '#ef4444',
            color: '#fff',
            border: 'none'
          }}
          aria-label="Líbí se mi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
          {likes > 0 && <span>{likes}</span>}
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-sm hover:scale-105"
          style={{
            backgroundColor: copied ? '#10b981' : '#8B7355',
            color: '#fff',
            border: 'none'
          }}
          aria-label="Kopírovat odkaz"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Zkopírováno</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Sdílet</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--color-negative)' }}>{error}</p>
      )}

      {hasVoted && !error && (
        <p className="text-sm" style={{ color: 'var(--color-positive)' }}>Děkujeme za váš hlas</p>
      )}

      {isVoting && (
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Odesílám...</p>
      )}
    </div>
  )
}
