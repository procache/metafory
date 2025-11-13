import { useState, useMemo } from 'react'
import type { MetaphorWithVotes } from '../lib/types'
import VoteButtons from './VoteButtons'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
  initialQuery?: string
  activeView?: string
}

export default function SearchBar({ metaphors, initialQuery = '', activeView = 'all' }: SearchBarProps) {
  const [searchQuery] = useState(initialQuery)

  // Normalize text for Czech language search (remove diacritics)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  // Get top 5 favorites
  const topFavorites = useMemo(() => {
    return metaphors.slice(0, 5)
  }, [metaphors])

  // Get recently added metaphors (sorted by approved_at or created_at)
  const recentMetaphors = useMemo(() => {
    return [...metaphors].sort((a, b) => {
      const dateA = new Date(a.approved_at || a.created_at).getTime()
      const dateB = new Date(b.approved_at || b.created_at).getTime()
      return dateB - dateA
    })
  }, [metaphors])

  // Filter metaphors based on search query
  const filteredMetaphors = useMemo(() => {
    if (!searchQuery.trim()) {
      return metaphors
    }

    const normalizedQuery = normalizeText(searchQuery)

    return metaphors.filter((metaphor) => {
      const nazevMatch = normalizeText(metaphor.nazev).includes(normalizedQuery)
      const definiceMatch = normalizeText(metaphor.definice).includes(normalizedQuery)
      const prikladMatch = normalizeText(metaphor.priklad).includes(normalizedQuery)

      return nazevMatch || definiceMatch || prikladMatch
    })
  }, [searchQuery, metaphors])

  return (
    <div>
      {/* All Metaphors View */}
      {activeView === 'all' && (
        <>
          {searchQuery && (
            <div className="mb-6 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Nalezeno {filteredMetaphors.length} z {metaphors.length}
            </div>
          )}

          <div className="space-y-6">
            {filteredMetaphors.length === 0 ? (
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
              filteredMetaphors.map((metaphor) => (
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
          {topFavorites.map((metaphor, index) => (
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
          {recentMetaphors.map((metaphor) => (
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
