'use client'

import { useState } from 'react'
import { createSearchClient } from '../client'
import type { SearchConfig, SearchResponse, SearchObject } from '../types'

interface UseSearchReturn {
  search: (query: string, indexName: string, config?: SearchConfig) => Promise<SearchResponse>
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchClient = createSearchClient()

  const search = async (
    query: string, 
    indexName: string, 
    config: SearchConfig = {}
  ): Promise<SearchResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const index = searchClient.initIndex(indexName)
      const response = await index.search(query, config)
      
      return {
        hits: response.hits.map(hit => ({ hit })),
        nbHits: response.nbHits,
        page: response.page,
        nbPages: response.nbPages,
        hitsPerPage: response.hitsPerPage,
        processingTimeMS: response.processingTimeMS,
        facets: response.facets,
        query: response.query
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    search,
    isLoading,
    error
  }
}