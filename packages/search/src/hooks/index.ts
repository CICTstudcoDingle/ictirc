'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import algoliasearch from 'algoliasearch/lite'

// Create a lazy-initialized search client
let _searchClient: ReturnType<typeof algoliasearch> | null = null

function getSearchClient() {
  if (_searchClient) return _searchClient

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID || ''
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''

  if (!appId || !searchKey) {
    console.warn('Algolia credentials not found, search will be disabled')
    return null
  }

  _searchClient = algoliasearch(appId, searchKey)
  return _searchClient
}

function getIndexPrefix() {
  return process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX || process.env.ALGOLIA_INDEX_PREFIX || 'ictirc'
}

export interface SearchHitResult {
  objectID: string
  type: string
  title: string
  description?: string
  url: string
  authors?: string[]
  category?: string
  year?: number
  conferenceName?: string
  doi?: string
  pdfUrl?: string
  name?: string
  affiliation?: string
  paperCount?: number
  keywords?: string[]
  abstract?: string
  volume?: number
  issue?: number
  _highlightResult?: Record<string, { value: string; matchLevel: string }>
  _snippetResult?: Record<string, { value: string; matchLevel: string }>
  [key: string]: any
}

export interface UseSearchOptions {
  indices?: string[]
  hitsPerPage?: number
  filters?: string
}

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: SearchHitResult[]
  isLoading: boolean
  error: string | null
  totalHits: number
  processingTimeMS: number
  search: (q: string) => Promise<void>
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    indices,
    hitsPerPage = 20,
    filters,
  } = options

  const [query, setQueryState] = useState('')
  const [results, setResults] = useState<SearchHitResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalHits, setTotalHits] = useState(0)
  const [processingTimeMS, setProcessingTimeMS] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const prefix = getIndexPrefix()
  const defaultIndices = indices || [
    `${prefix}_papers`,
    `${prefix}_archives`,
    `${prefix}_authors`,
    `${prefix}_conferences`,
  ]

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setTotalHits(0)
      setProcessingTimeMS(0)
      return
    }

    const client = getSearchClient()
    if (!client) {
      setError('Search is not configured')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchPromises = defaultIndices.map(indexName =>
        client.initIndex(indexName).search(q, {
          hitsPerPage,
          attributesToHighlight: ['title', 'description', 'abstract', 'authors', 'name'],
          attributesToSnippet: ['description:150', 'abstract:200'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          ...(filters ? { filters } : {}),
        })
      )

      const searchResults = await Promise.all(searchPromises)

      let allHits: SearchHitResult[] = []
      let allTotalHits = 0
      let maxProcessingTime = 0

      for (const result of searchResults) {
        allHits = [...allHits, ...result.hits as SearchHitResult[]]
        allTotalHits += result.nbHits || 0
        maxProcessingTime = Math.max(maxProcessingTime, result.processingTimeMS || 0)
      }

      setResults(allHits)
      setTotalHits(allTotalHits)
      setProcessingTimeMS(maxProcessingTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [defaultIndices.join(','), hitsPerPage, filters])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(q)
    }, 300)
  }, [performSearch])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    totalHits,
    processingTimeMS,
    search: performSearch,
  }
}

export interface UseSearchResultsOptions {
  query?: string
  enabled?: boolean
  hitsPerPage?: number
  indexName?: string
  filters?: string
}

export function useSearchResults(options: UseSearchResultsOptions) {
  const { query, enabled = true, hitsPerPage = 20, indexName, filters } = options
  const [results, setResults] = useState<SearchHitResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nbHits, setNbHits] = useState(0)
  const [processingTimeMS, setProcessingTimeMS] = useState(0)

  useEffect(() => {
    if (!enabled || !query?.trim()) {
      setResults([])
      setNbHits(0)
      return
    }

    const client = getSearchClient()
    if (!client) {
      setError('Search is not configured')
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    const prefix = getIndexPrefix()
    const targetIndex = indexName || `${prefix}_papers`

    client
      .initIndex(targetIndex)
      .search(query, {
        hitsPerPage,
        attributesToHighlight: ['title', 'description', 'abstract', 'authors', 'name'],
        attributesToSnippet: ['description:150', 'abstract:200'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        ...(filters ? { filters } : {}),
      })
      .then(res => {
        if (!cancelled) {
          setResults(res.hits as SearchHitResult[])
          setNbHits(res.nbHits)
          setProcessingTimeMS(res.processingTimeMS)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search failed')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [query, enabled, hitsPerPage, indexName, filters])

  return { results, isLoading, error, nbHits, processingTimeMS }
}

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([])
      return
    }

    const client = getSearchClient()
    if (!client) return

    setIsLoading(true)
    setError(null)

    const prefix = getIndexPrefix()

    try {
      const result = await client.initIndex(`${prefix}_papers`).search(q, {
        hitsPerPage: 5,
        attributesToRetrieve: ['title'],
      })

      setSuggestions(result.hits.map((h: any) => h.title))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get suggestions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { suggestions, isLoading, error, getSuggestions }
}
