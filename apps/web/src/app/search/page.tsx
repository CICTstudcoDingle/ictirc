'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Loader2, Clock, FileText, Users, Calendar } from 'lucide-react'
import { useSearch } from '@ictirc/search'
import type { SearchHitResult } from '@ictirc/search'
import { SearchInput, SearchHitCard } from '@ictirc/search'
import { Button, CircuitBackground } from '@ictirc/ui'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const { query, setQuery, results, isLoading, error, totalHits, processingTimeMS } = useSearch({
    hitsPerPage: 20,
  })

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')

  // Initialize from URL
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  // Update URL on search
  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [setQuery, router])

  const handleHitClick = (hit: SearchHitResult) => {
    if (hit.url) {
      router.push(hit.url)
    }
  }

  // Filter results by type
  const filteredResults = selectedType === 'all'
    ? results
    : results.filter(r => r.type === selectedType)

  // Count by type
  const typeCounts = results.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeFilters = [
    { value: 'all', label: 'All', icon: Search, count: results.length },
    { value: 'paper', label: 'Papers', icon: FileText, count: typeCounts['paper'] || 0 },
    { value: 'archive', label: 'Archives', icon: FileText, count: typeCounts['archive'] || 0 },
    { value: 'author', label: 'Authors', icon: Users, count: typeCounts['author'] || 0 },
    { value: 'conference', label: 'Conferences', icon: Calendar, count: typeCounts['conference'] || 0 },
  ]

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-8 md:py-14 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-4 text-center">
            Search <span className="text-[#D4AF37]">Research</span>
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={query}
              onChange={handleSearch}
              placeholder="Search papers, authors, conferences..."
              size="lg"
              autoFocus
            />
          </div>

          {/* Quick Stats */}
          {query && !isLoading && (
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                {totalHits} result{totalHits !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {processingTimeMS}ms
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Filters + Results */}
      <section className="py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Type Filters */}
          {query && results.length > 0 && (
            <>
              {/* Desktop filters */}
              <div className="hidden md:flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {typeFilters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setSelectedType(f.value)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium 
                      transition-colors whitespace-nowrap
                      ${selectedType === f.value
                        ? 'bg-[#800000] text-white shadow-[2px_2px_0px_0px_rgba(212,175,55,1)]'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#800000]/30'
                      }
                    `}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                    {f.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedType === f.value ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                        {f.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile filter toggle */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter by type
                    {selectedType !== 'all' && (
                      <span className="bg-[#800000] text-white text-xs px-2 py-0.5 rounded-full">
                        {typeFilters.find(f => f.value === selectedType)?.label}
                      </span>
                    )}
                  </span>
                  {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                </button>

                {showFilters && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg p-2 space-y-1">
                    {typeFilters.map(f => (
                      <button
                        key={f.value}
                        onClick={() => {
                          setSelectedType(f.value)
                          setShowFilters(false)
                        }}
                        className={`
                          flex items-center justify-between w-full px-3 py-2 rounded-md text-sm
                          ${selectedType === f.value
                            ? 'bg-[#800000]/5 text-[#800000] font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2">
                          <f.icon className="w-4 h-4" />
                          {f.label}
                        </span>
                        <span className="text-xs text-gray-400">{f.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#800000] animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {!isLoading && query && filteredResults.length > 0 && (
            <div className="space-y-3">
              {filteredResults.map((hit) => (
                <SearchHitCard
                  key={hit.objectID}
                  hit={hit}
                  onClick={handleHitClick}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && !error && (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try different keywords or check your spelling
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['machine learning', 'cybersecurity', 'IoT', 'AI'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-[#800000]/5 hover:text-[#800000] text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State (no query) */}
          {!query && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Research
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Search across papers, authors, and conferences in the IRJICT research archive.
              </p>

              {/* Popular searches */}
              <div className="max-w-lg mx-auto">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'machine learning',
                    'cybersecurity',
                    'Internet of Things',
                    'artificial intelligence',
                    'data mining',
                    'image processing',
                  ].map(term => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="text-sm bg-white border border-gray-200 hover:border-[#800000]/30 hover:text-[#800000] text-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-14 md:pt-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#800000] mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
