import { useState } from 'react'
import type { MetaphorWithVotes } from '../lib/types'
import VoteButtons from './VoteButtons'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
  initialQuery?: string
  activeView?: string
  showPagination?: boolean
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function SearchBar({
  metaphors,
  initialQuery = '',
  activeView = 'all',
  showPagination = true
}: SearchBarProps) {
  // Shuffle metaphors once when component mounts for 'all' view without search
  // This ensures returning visitors see different content each visit
  const [shuffledMetaphors] = useState(() => shuffleArray(metaphors))

  // Use shuffled order for 'all' view without search query, otherwise use original order
  const displayMetaphors = (activeView === 'all' && !initialQuery) ? shuffledMetaphors : metaphors

  return (
    <div>
      {/* All Metaphors View & Search Results */}
      {(activeView === 'all' || initialQuery) && (
        <>
          {initialQuery && (
            <div className="mb-6 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Nalezeno {displayMetaphors.length} metafor{displayMetaphors.length === 1 ? 'a' : displayMetaphors.length < 5 ? 'y' : ''}
            </div>
          )}

          <div className="space-y-6">
            {displayMetaphors.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Žádné metafory nenalezeny. Zkuste jiné hledání.
              </div>
            ) : (
              displayMetaphors.map((metaphor) => (
                <div
                  key={metaphor.id}
                  className="rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '2px solid var(--color-border)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-hover)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                  }}
                >
                  <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-70 transition-opacity">
                    <h2
                      className="text-xl sm:text-2xl font-semibold mb-3 leading-tight"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {metaphor.nazev}
                    </h2>
                    <p
                      className="text-base sm:text-lg mb-2.5 leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {metaphor.definice}
                    </p>
                    <p
                      className="text-sm sm:text-base italic mb-4 leading-relaxed"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      „{metaphor.priklad}"
                    </p>
                  </a>
                  <VoteButtons
                    metaphorId={metaphor.id}
                    initialLikes={metaphor.like_count}
                    initialDislikes={metaphor.dislike_count}
                    initialScore={metaphor.score}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Favorites View */}
      {activeView === 'favorites' && (
        <div className="space-y-6">
          {displayMetaphors.map((metaphor, index) => (
            <div
              key={metaphor.id}
              className="flex gap-4 sm:gap-5 p-6 sm:p-8 rounded-xl hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '2px solid var(--color-border)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-base"
                style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}
              >
                {index + 1}
              </div>
              <div className="flex-grow">
                <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-70 transition-opacity">
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-2 leading-tight"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {metaphor.nazev}
                  </h3>
                  <p
                    className="text-sm sm:text-base mb-3 leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {metaphor.definice}
                  </p>
                  <div className="flex items-center gap-5 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--color-positive)' }}>
                      👍 {metaphor.like_count}
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--color-negative)' }}>
                      👎 {metaphor.dislike_count}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
                      Skóre: {metaphor.score}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent View */}
      {activeView === 'recent' && (
        <div className="space-y-6">
          {displayMetaphors.map((metaphor) => (
            <div
              key={metaphor.id}
              className="rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '2px solid var(--color-border)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-70 transition-opacity">
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-3 leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {metaphor.nazev}
                </h2>
                <p
                  className="text-base sm:text-lg mb-2.5 leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {metaphor.definice}
                </p>
                <p
                  className="text-sm sm:text-base italic mb-4 leading-relaxed"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  „{metaphor.priklad}"
                </p>
              </a>
              <VoteButtons
                metaphorId={metaphor.id}
                initialLikes={metaphor.like_count}
                initialDislikes={metaphor.dislike_count}
                initialScore={metaphor.score}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
