import { useState, useMemo } from 'react'
import type { MetaphorWithVotes } from '../lib/types'
import VoteButtons from './VoteButtons'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
  initialQuery?: string
}

type TabType = 'all' | 'favorites'

export default function SearchBar({ metaphors, initialQuery = '' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<TabType>('all')

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
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-10" style={{ borderBottom: '1.5px solid var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-3 font-semibold transition-all border-b-3 -mb-px ${
            activeTab === 'all'
              ? 'border-b-2'
              : 'border-transparent hover:opacity-70'
          }`}
          style={activeTab === 'all'
            ? { borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-primary)' }
            : { color: 'var(--color-text-tertiary)' }
          }
        >
          Všechny
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-5 py-3 font-semibold transition-all border-b-3 -mb-px ${
            activeTab === 'favorites'
              ? 'border-b-2'
              : 'border-transparent hover:opacity-70'
          }`}
          style={activeTab === 'favorites'
            ? { borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-primary)' }
            : { color: 'var(--color-text-tertiary)' }
          }
        >
          Nejoblíbenější
        </button>
      </div>

      {/* All Metaphors Tab */}
      {activeTab === 'all' && (
        <>
          <div className="relative mb-10">
            <input
              type="text"
              placeholder="Hledat metafory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 rounded-lg font-medium transition-all"
              style={{
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity text-lg font-bold"
                style={{ color: 'var(--color-text-tertiary)' }}
                aria-label="Vymazat hledání"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mb-6 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Nalezeno {filteredMetaphors.length} z {metaphors.length}
            </div>
          )}

          <div className="space-y-5">
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
                  className="py-6 sm:py-7"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
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

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-5">
          {topFavorites.map((metaphor, index) => (
            <div
              key={metaphor.id}
              className="flex gap-4 sm:gap-5 py-6"
              style={{ borderBottom: '1px solid var(--color-border)' }}
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
    </div>
  )
}
