import { useState, useEffect, useMemo } from 'react'
import type { MetaphorWithVotes } from '../lib/types'
import VoteButtons from './VoteButtons'

interface SearchBarProps {
  metaphors: MetaphorWithVotes[]
}

const METAPHORS_PER_PAGE = 30

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function SearchBar({ metaphors }: SearchBarProps) {
  // Read initial state from URL
  const getInitialState = () => {
    if (typeof window === 'undefined') return { q: '', view: 'all', page: 1 }
    const params = new URLSearchParams(window.location.search)
    return {
      q: params.get('q') || '',
      view: params.get('view') || 'all',
      page: parseInt(params.get('page') || '1', 10)
    }
  }

  const [searchQuery, setSearchQuery] = useState(() => getInitialState().q)
  const [viewType, setViewType] = useState(() => getInitialState().view)
  const [currentPage, setCurrentPage] = useState(() => getInitialState().page)

  // Shuffle metaphors once when component mounts (for 'all' view without search)
  const [shuffledMetaphors] = useState(() => shuffleArray(metaphors))

  // Update URL when state changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (viewType !== 'all') params.set('view', viewType)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const newUrl = params.toString() ? `?${params.toString()}` : '/'
    window.history.pushState({}, '', newUrl)
  }, [searchQuery, viewType, currentPage])

  // Filter and sort metaphors based on view type and search query
  const filteredMetaphors = useMemo(() => {
    let result = metaphors

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.nazev.toLowerCase().includes(query) ||
        m.definice.toLowerCase().includes(query) ||
        m.priklad.toLowerCase().includes(query)
      )
    }

    // Apply view type sorting/filtering
    if (viewType === 'favorites') {
      // Top 5 favorites sorted by likes (no pagination for favorites)
      return result
        .sort((a, b) => b.like_count - a.like_count)
        .slice(0, 5)
    } else if (viewType === 'recent') {
      // Sort by approval date, then creation date
      return result.sort((a, b) => {
        const dateA = a.approved_at ? new Date(a.approved_at).getTime() : new Date(a.created_at).getTime()
        const dateB = b.approved_at ? new Date(b.approved_at).getTime() : new Date(b.created_at).getTime()
        return dateB - dateA
      })
    } else {
      // 'all' view: use shuffled order if no search, otherwise sort by likes
      if (!searchQuery.trim()) {
        // Use pre-shuffled order for 'all' view
        return shuffledMetaphors
      } else {
        // For search results, sort by relevance (like_count)
        return result.sort((a, b) => b.like_count - a.like_count)
      }
    }
  }, [metaphors, shuffledMetaphors, searchQuery, viewType])

  // Calculate pagination
  const totalPages = viewType === 'favorites'
    ? 1
    : Math.ceil(filteredMetaphors.length / METAPHORS_PER_PAGE)

  // Get current page metaphors
  const paginatedMetaphors = useMemo(() => {
    if (viewType === 'favorites') {
      return filteredMetaphors // Already limited to 5
    }
    const startIndex = (currentPage - 1) * METAPHORS_PER_PAGE
    const endIndex = startIndex + METAPHORS_PER_PAGE
    return filteredMetaphors.slice(startIndex, endIndex)
  }, [filteredMetaphors, currentPage, viewType])

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [searchQuery, viewType, totalPages, currentPage])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleViewChange = (view: string) => {
    setViewType(view)
    setCurrentPage(1) // Reset to first page on view change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Search Input Block - attached to header */}
      <div
        className="px-5 sm:px-8 py-4"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Hledat metafory..."
              className="w-full px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: 'var(--color-text-primary)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            />
            {/* Search Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar - no gap above */}
      <div
        className="px-5 sm:px-8 py-3"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: 'var(--shadow-sm)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleViewChange('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                viewType === 'all' ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: viewType === 'all' ? 'var(--color-accent-primary)' : 'white',
                color: viewType === 'all' ? 'white' : 'var(--color-text-secondary)',
                border: '2px solid',
                borderColor: viewType === 'all' ? 'var(--color-accent-primary)' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: viewType === 'all' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              Všechny
            </button>
            <button
              onClick={() => handleViewChange('favorites')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                viewType === 'favorites' ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: viewType === 'favorites' ? 'var(--color-accent-primary)' : 'white',
                color: viewType === 'favorites' ? 'white' : 'var(--color-text-secondary)',
                border: '2px solid',
                borderColor: viewType === 'favorites' ? 'var(--color-accent-primary)' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: viewType === 'favorites' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              Top 5
            </button>
            <button
              onClick={() => handleViewChange('recent')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                viewType === 'recent' ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: viewType === 'recent' ? 'var(--color-accent-primary)' : 'white',
                color: viewType === 'recent' ? 'white' : 'var(--color-text-secondary)',
                border: '2px solid',
                borderColor: viewType === 'recent' ? 'var(--color-accent-primary)' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: viewType === 'recent' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              Nejnovější
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="px-5 sm:px-8 mt-4">
          <div className="max-w-4xl mx-auto text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Nalezeno {filteredMetaphors.length} metafor{filteredMetaphors.length === 1 ? 'a' : filteredMetaphors.length < 5 ? 'y' : ''}
          </div>
        </div>
      )}

      <div className="px-5 sm:px-8 mt-6">
        <div className="max-w-4xl mx-auto">

      {/* Metaphor List */}
      <div className="space-y-6">
        {paginatedMetaphors.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--color-text-secondary)'
            }}
          >
            Žádné metafory nenalezeny. Zkuste jiné hledání.
          </div>
        ) : viewType === 'favorites' ? (
          // Favorites View with Ranking
          paginatedMetaphors.map((metaphor, index) => (
            <div
              key={metaphor.id}
              className="flex gap-4 sm:gap-5 p-6 sm:p-8 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
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
                    className="text-xl sm:text-2xl font-bold mb-3 leading-tight"
                    style={{ color: 'var(--color-heading-blue)' }}
                  >
                    {metaphor.nazev}
                  </h3>
                  <p
                    className="text-sm sm:text-base mb-3 leading-relaxed font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {metaphor.definice}
                  </p>
                  {metaphor.like_count > 0 && (
                    <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--color-positive)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                      <span>{metaphor.like_count}</span>
                    </div>
                  )}
                </a>
              </div>
            </div>
          ))
        ) : (
          // Standard View (all/recent)
          paginatedMetaphors.map((metaphor) => (
            <div
              key={metaphor.id}
              className="rounded-xl p-6 sm:p-8 transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              <a href={`/metafora/${metaphor.slug}`} className="block hover:opacity-70 transition-opacity">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
                  style={{ color: 'var(--color-heading-blue)' }}
                >
                  {metaphor.nazev}
                </h2>
                <p
                  className="text-base sm:text-lg mb-3 leading-relaxed font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
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
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination (not shown for favorites view) */}
      {viewType !== 'favorites' && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--color-text-primary)'
            }}
          >
            ← Předchozí
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === pageNum ? 'font-bold' : ''
                  }`}
                  style={{
                    backgroundColor: currentPage === pageNum ? 'var(--color-accent-primary)' : 'var(--color-bg-card)',
                    color: currentPage === pageNum ? 'white' : 'var(--color-text-primary)',
                    border: '1px solid',
                    borderColor: currentPage === pageNum ? 'var(--color-accent-primary)' : 'rgba(0, 0, 0, 0.1)',
                    boxShadow: currentPage === pageNum ? 'none' : 'var(--shadow-sm)'
                  }}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--color-text-primary)'
            }}
          >
            Další →
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
