'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Clock, FileText, Users, Calendar, ExternalLink } from 'lucide-react'
import { useSearch } from '@ictirc/search'
import type { SearchHitResult } from '@ictirc/search'
import { SearchInput, SearchHitCard } from '@ictirc/search'

export default function AuthorSearchPage() {
  const router = useRouter()
  const { query, setQuery, results, isLoading, error, totalHits, processingTimeMS } = useSearch({
    hitsPerPage: 20,
  })

  // Filter state
  const [selectedType, setSelectedType] = useState<string>('all')

  const handleHitClick = (hit: SearchHitResult) => {
    // Open in the public web app since author portal doesn't have paper detail pages for all papers  
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://irjict.isufst.edu.ph'
    if (hit.url) {
      window.open(`${baseUrl}${hit.url}`, '_blank')
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
    { value: 'all', label: 'All', count: results.length },
    { value: 'paper', label: 'Papers', count: typeCounts['paper'] || 0 },
    { value: 'archive', label: 'Archives', count: typeCounts['archive'] || 0 },
    { value: 'author', label: 'Authors', count: typeCounts['author'] || 0 },
    { value: 'conference', label: 'Conferences', count: typeCounts['conference'] || 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="h-6 w-6 text-maroon" />
          Search Papers
        </h1>
        <p className="text-gray-600 mt-1">
          Search across all published research papers, authors, and conferences
        </p>
      </div>

      {/* Search Bar */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search papers, authors, conferences..."
        size="lg"
        autoFocus
      />

      {/* Quick Stats */}
      {query && !isLoading && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
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

      {/* Type Filters */}
      {query && results.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {typeFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setSelectedType(f.value)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
                transition-colors
                ${selectedType === f.value
                  ? 'bg-maroon text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  selectedType === f.value ? 'bg-white/20' : 'bg-white'
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-maroon animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {!isLoading && query && filteredResults.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Results open in public archive
          </p>
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
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
          <p className="text-sm text-gray-500">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Discover Published Research
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Search across all published papers, authors, and conferences in the IRJICT archive.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['machine learning', 'cybersecurity', 'IoT', 'AI', 'data mining'].map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-sm bg-white border border-gray-200 hover:border-maroon/30 hover:text-maroon text-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
