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
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Hledat metafory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Vymazat hledání"
          >
            ✕
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="mt-3 text-sm text-gray-600">
          Nalezeno {filteredMetaphors.length} z {metaphors.length} metafor
        </div>
      )}

      <div className="mt-6 space-y-4">
        {filteredMetaphors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Žádné metafory nenalezeny. Zkuste jiné hledání.
          </div>
        ) : (
          filteredMetaphors.map((metaphor) => (
            <a
              key={metaphor.id}
              href={`/metafora/${metaphor.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{metaphor.nazev}</h3>
              <p className="text-gray-700 mb-2">{metaphor.definice}</p>
              <p className="text-sm text-gray-600 italic mb-3">{metaphor.priklad}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>👍 {metaphor.like_count}</span>
                <span>👎 {metaphor.dislike_count}</span>
                <span>Score: {metaphor.score}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
