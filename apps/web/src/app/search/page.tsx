'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Clock, TrendingUp } from 'lucide-react'
import { SearchInput, SearchHit, useSearchResults } from '@ictirc/search'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const { results, isLoading, error, nbHits, processingTimeMS } = useSearchResults({
    query,
    enabled: !!query,
    hitsPerPage: 20
  })

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Search IRCICT
            </h1>
            <p className="text-gray-600 mb-8">
              Find research papers, authors, conferences, and more
            </p>
            
            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchInput
                placeholder="Search papers, authors, conferences..."
                className="w-full"
                showResults={false}
              />
            </div>

            {/* Popular Searches or Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-blue-600 mb-2">📄</div>
                <div className="text-sm font-medium">Research Papers</div>
              </button>
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-green-600 mb-2">👥</div>
                <div className="text-sm font-medium">Authors</div>
              </button>
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-purple-600 mb-2">📅</div>
                <div className="text-sm font-medium">Conferences</div>
              </button>
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-orange-600 mb-2">📚</div>
                <div className="text-sm font-medium">Archives</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="max-w-2xl">
            <SearchInput
              placeholder="Search papers, authors, conferences..."
              className="w-full"
              showResults={false}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {isLoading ? 'Searching...' : `${nbHits.toLocaleString()} results for "${query}"`}
            </span>
            {processingTimeMS > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {processingTimeMS}ms
              </span>
            )}
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-3">Refine Results</h3>
              
              {/* Content Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Content Type</h4>
                <div className="space-y-2">
                  {['paper', 'author', 'conference', 'archive'].map(type => (
                    <label key={type} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 mr-2" />
                      <span className="text-sm text-gray-600 capitalize">{type}s</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Year</h4>
                <select className="w-full text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option>All years</option>
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <select className="w-full text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option>All categories</option>
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>Data Science</option>
                  <option>AI & Machine Learning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">
                  Search error: {error}. Please try again.
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.objectID} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <SearchHit
                      hit={result}
                      onClick={() => window.location.href = result.url}
                    />
                  </div>
                ))}

                {/* Load More / Pagination */}
                <div className="text-center py-6">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Load More Results
                  </button>
                </div>
              </div>
            ) : query && !isLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  We couldn't find anything matching "{query}". Try different keywords or check your spelling.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-14 md:pt-16">
        <div className="text-center">
          <Search className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
