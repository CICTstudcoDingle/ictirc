// Hook exports
// These are placeholder stubs until Algolia credentials are configured

export function useSearch() {
  return {
    search: async () => ({ hits: [], nbHits: 0, page: 0, nbPages: 0, hitsPerPage: 0, processingTimeMS: 0, facets: {}, query: '' }),
    isLoading: false,
    error: 'Algolia search is not configured. Please add credentials to enable search.'
  }
}

export function useSearchResults({ query }: { query?: string; enabled?: boolean; hitsPerPage?: number }) {
  return {
    results: [],
    isLoading: false,
    error: query ? 'Search is not configured. Algolia credentials are required.' : null,
    nbHits: 0,
    processingTimeMS: 0
  }
}

export function useSearchSuggestions() {
  return {
    suggestions: [],
    isLoading: false,
    error: null
  }
}
