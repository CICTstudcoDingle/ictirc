'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@ictirc/ui'

interface Paper {
  id: string
  title: string
  abstract: string | null
  authors: { name: string; order: number }[]
  category: { name: string }
  doi: string | null
  pdfUrl: string | null
  pageStart: number | null
  pageEnd: number | null
}

interface IssuePapersFilterProps {
  papers: Paper[]
}

// NOTE: Defined at module-level (outside the component) to prevent React from
// attempting to serialize this function reference across the Server/Client boundary.
// See: https://react.dev/reference/rsc/use-client#passing-props-from-server-to-client-components
function renderPapers(list: Paper[]) {
  return (
    <div className="space-y-4">
      {list.map((paper) => (
        <Card key={paper.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  <Link
                    href={`/archive/${paper.id}`}
                    className="hover:text-maroon transition-colors"
                  >
                    {paper.title}
                  </Link>
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{paper.authors.map((a) => a.name).join(', ')}</span>
                  {paper.pageStart && paper.pageEnd && (
                    <>
                      <span>•</span>
                      <span>Pages {paper.pageStart}-{paper.pageEnd}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-maroon font-medium">{paper.category.name}</span>
                </div>
              </div>
              {paper.doi && (
                <div className="ml-4">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-maroon"
                  >
                    DOI: {paper.doi}
                  </a>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {paper.abstract}
            </p>
            <div className="mt-4 flex gap-2">
              <Link href={`/archive/${paper.id}`}>
                <Button size="sm" variant="outline">View Details</Button>
              </Link>
              {paper.pdfUrl && (
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">Download PDF</Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function IssuePapersFilter({ papers }: IssuePapersFilterProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(papers.map(p => p.category.name)))
    return cats.sort()
  }, [papers])

  // Filter papers
  const filteredPapers = useMemo(() => {
    let filtered = papers

    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.abstract && p.abstract.toLowerCase().includes(q)) ||
        p.authors.some(a => a.name.toLowerCase().includes(q))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.name === selectedCategory)
    }

    return filtered
  }, [papers, query, selectedCategory])

  const hasActiveFilters = query.trim() || selectedCategory !== 'all'

  if (papers.length <= 1) {
    return <>{renderPapers(papers)}</>
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search papers in this issue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full h-10 pl-9 pr-9
              bg-gray-50 border-b-2 border-gray-200 rounded-t-md
              font-mono text-sm
              focus:outline-none focus:border-[#800000] focus:bg-white
              placeholder:text-gray-400
              transition-colors
            "
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <>
            {/* Desktop: inline select */}
            <div className="hidden sm:block relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="
                  appearance-none h-10 px-3 pr-8
                  bg-gray-50 border-b-2 border-gray-200 rounded-t-md
                  font-mono text-xs
                  focus:outline-none focus:border-[#800000] focus:bg-white
                  cursor-pointer transition-colors
                "
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile: filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              <Filter className="w-4 h-4" />
              Filter
              {selectedCategory !== 'all' && (
                <span className="bg-[#800000] text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
              )}
            </button>
          </>
        )}

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => { setQuery(''); setSelectedCategory('all') }}
            className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-[#800000] font-medium px-2"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Mobile filter dropdown */}
      {showFilters && categories.length > 1 && (
        <div className="sm:hidden mb-4 bg-white border border-gray-200 rounded-lg p-2 space-y-1">
          <button
            onClick={() => { setSelectedCategory('all'); setShowFilters(false) }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selectedCategory === 'all' ? 'bg-[#800000]/5 text-[#800000] font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowFilters(false) }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedCategory === cat ? 'bg-[#800000]/5 text-[#800000] font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results info */}
      {hasActiveFilters && (
        <p className="text-xs text-gray-500 mb-4">
          Showing <span className="font-medium text-gray-900">{filteredPapers.length}</span> of{' '}
          <span className="font-medium text-gray-900">{papers.length}</span> papers
          {selectedCategory !== 'all' && (
            <span> in <span className="text-[#800000] font-medium">{selectedCategory}</span></span>
          )}
        </p>
      )}

      {/* Render filtered papers */}
      {renderPapers(filteredPapers)}

      {/* No results */}
      {hasActiveFilters && filteredPapers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No papers match your search</p>
          <button
            onClick={() => { setQuery(''); setSelectedCategory('all') }}
            className="mt-2 text-sm text-[#800000] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )

}
