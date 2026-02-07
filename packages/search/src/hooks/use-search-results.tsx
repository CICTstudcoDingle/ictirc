'use client'

import { useState, useEffect } from 'react'
import { createSearchClient, INDICES, DEFAULT_SEARCH_CONFIG } from '../client'
import type { SearchResponse, SearchConfig, SearchObject } from '../types'

interface UseSearchResultsConfig extends SearchConfig {
  query: string
  indices?: string[]
  enabled?: boolean
}

interface UseSearchResultsReturn {
  results: SearchObject[]
  isLoading: boolean
  error: string | null
  nbHits: number
  processingTimeMS: number
  refetch: () => void
}

export function useSearchResults({
  query,
  indices = [INDICES.PAPERS, INDICES.ARCHIVES, INDICES.AUTHORS],
  enabled = true,
  ...searchConfig
}: UseSearchResultsConfig): UseSearchResultsReturn {
  const [results, setResults] = useState<SearchObject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nbHits, setNbHits] = useState(0)
  const [processingTimeMS, setProcessingTimeMS] = useState(0)

  const searchClient = createSearchClient()

  const performSearch = async () => {
    if (!enabled || !query.trim()) {
      setResults([])
      setNbHits(0)
      setProcessingTimeMS(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const queries = indices.map(indexName => ({
        indexName,
        query: query.trim(),
        params: {
          ...DEFAULT_SEARCH_CONFIG,
          ...searchConfig
        }
      }))

      const response = await searchClient.multipleQueries(queries)
      
      // Combine results from all indices
      const allHits: SearchObject[] = []
      let totalHits = 0
      let maxProcessingTime = 0

      response.results.forEach((result: any) => {
        if (result.hits) {
          allHits.push(...result.hits)
          totalHits += result.nbHits
          maxProcessingTime = Math.max(maxProcessingTime, result.processingTimeMS)
        }
      })

      // Sort by relevance or custom logic
      allHits.sort((a, b) => {
        // Prioritize by type (papers first, then authors, etc.)
        const typeOrder = ['paper', 'author', 'conference', 'archive', 'news', 'page']
        const aIndex = typeOrder.indexOf(a.type)
        const bIndex = typeOrder.indexOf(b.type)
        
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        
        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      setResults(allHits)
      setNbHits(totalHits)
      setProcessingTimeMS(maxProcessingTime)

    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
      setResults([])
      setNbHits(0)
      setProcessingTimeMS(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(performSearch, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query, enabled, ...Object.values(searchConfig), indices.join(',')])

  return {
    results,
    isLoading,
    error,
    nbHits,
    processingTimeMS,
    refetch: performSearch
  }
}