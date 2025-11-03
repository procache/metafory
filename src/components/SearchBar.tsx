import { useState, useMemo } from 'react'
import type { MetaphorWithVotes } from '../lib/types'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
}

export default function SearchBar({ metaphors }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Normalize text for Czech language search (remove diacritics)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

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
            <a
              key={metaphor.id}
              href={`/metafora/${metaphor.slug}`}
              className="block py-4 sm:py-6 border-b border-gray-200 hover:bg-gray-50 transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6"
            >
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{metaphor.nazev}</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-2 leading-relaxed">{metaphor.definice}</p>
              <p className="text-xs sm:text-sm text-gray-600 italic mb-3 sm:mb-4">„{metaphor.priklad}"</p>
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span>👍</span>
                  <span>{metaphor.like_count}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>👎</span>
                  <span>{metaphor.dislike_count}</span>
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
