import { useState, useMemo } from 'react'
import type { MetaphorWithVotes } from '../lib/types'
import VoteButtons from './VoteButtons'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
}

type TabType = 'all' | 'favorites'

export default function SearchBar({ metaphors }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
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
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'all'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Všechny
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'favorites'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Nejoblíbenější
        </button>
      </div>

      {/* All Metaphors Tab */}
      {activeTab === 'all' && (
        <>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Hledat metafory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors text-lg"
                aria-label="Vymazat hledání"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mb-6 text-sm text-gray-600">
              Nalezeno {filteredMetaphors.length} z {metaphors.length}
            </div>
          )}

          <div className="space-y-6">
            {filteredMetaphors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Žádné metafory nenalezeny. Zkuste jiné hledání.
              </div>
            ) : (
              filteredMetaphors.map((metaphor) => (
                <div
                  key={metaphor.id}
                  className="py-4 sm:py-6 border-b border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6"
                >
                  <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-80 transition-opacity">
                    <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{metaphor.nazev}</h2>
                    <p className="text-sm sm:text-base text-gray-700 mb-2 leading-relaxed">{metaphor.definice}</p>
                    <p className="text-xs sm:text-sm text-gray-600 italic mb-3 sm:mb-4">„{metaphor.priklad}"</p>
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
        <div className="space-y-4">
          {topFavorites.map((metaphor, index) => (
            <div
              key={metaphor.id}
              className="flex gap-3 py-4 border-b border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-grow">
                <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-80 transition-opacity">
                  <h3 className="text-lg font-bold mb-1 text-gray-900">{metaphor.nazev}</h3>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{metaphor.definice}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">👍 {metaphor.like_count}</span>
                    <span className="flex items-center gap-1">👎 {metaphor.dislike_count}</span>
                    <span className="font-semibold">Skóre: {metaphor.score}</span>
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
