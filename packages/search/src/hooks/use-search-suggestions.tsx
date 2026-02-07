'use client'

import { useState, useEffect } from 'react'
import { createSearchClient, INDICES } from '../client'

interface UseSearchSuggestionsConfig {
  query: string
  enabled?: boolean
  limit?: number
  indices?: string[]
}

interface UseSearchSuggestionsReturn {
  suggestions: string[]
  isLoading: boolean
  error: string | null
}

export function useSearchSuggestions({
  query,
  enabled = true,
  limit = 5,
  indices = [INDICES.PAPERS, INDICES.AUTHORS]
}: UseSearchSuggestionsConfig): UseSearchSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchClient = createSearchClient()

  const getSuggestions = async () => {
    if (!enabled || !query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const queries = indices.map(indexName => ({
        indexName,
        query: query.trim(),
        params: {
          hitsPerPage: limit,
          attributesToRetrieve: ['title', 'name', 'authors'],
          attributesToHighlight: []
        }
      }))

      const response = await searchClient.multipleQueries(queries)
      
      const suggestionSet = new Set<string>()
      
      response.results.forEach((result: any) => {
        if (result.hits) {
          result.hits.forEach((hit: any) => {
            // Extract suggestions from titles
            if (hit.title) {
              suggestionSet.add(hit.title)
            }
            
            // Extract suggestions from names (for authors)
            if (hit.name) {
              suggestionSet.add(hit.name)
            }
            
            // Extract suggestions from author names (for papers)
            if (hit.authors && Array.isArray(hit.authors)) {
              hit.authors.forEach((author: string) => {
                suggestionSet.add(author)
              })
            }
          })
        }
      })

      // Convert to array and limit results
      const suggestionArray = Array.from(suggestionSet)
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit)

      setSuggestions(suggestionArray)

    } catch (err) {
      console.error('Suggestions error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load suggestions')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(getSuggestions, 200) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query, enabled, limit, indices.join(',')])

  return {
    suggestions,
    isLoading,
    error
  }
}