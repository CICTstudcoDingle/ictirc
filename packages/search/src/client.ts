import algoliasearch from 'algoliasearch'
import type { SearchClient } from 'algoliasearch/lite'

// Environment validation
const requiredEnvVars = {
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_INDEX_PREFIX: process.env.ALGOLIA_INDEX_PREFIX || 'ictirc'
}

// Validate environment variables
function validateEnvVars() {
  const missing = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value && key !== 'ALGOLIA_INDEX_PREFIX')
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required Algolia environment variables: ${missing.join(', ')}`)
  }
}

// Admin client (server-side only)
export function createAdminClient() {
  validateEnvVars()
  
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used server-side')
  }

  return algoliasearch(
    requiredEnvVars.ALGOLIA_APP_ID!,
    requiredEnvVars.ALGOLIA_ADMIN_API_KEY!
  )
}

// Search client (client-side safe)
export function createSearchClient(): SearchClient {
  if (!requiredEnvVars.ALGOLIA_APP_ID || !requiredEnvVars.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY) {
    console.warn('Algolia credentials not found, search will be disabled')
    // Return a mock client for development
    return {
      search: () => Promise.resolve({ results: [] })
    } as any
  }

  return algoliasearch(
    requiredEnvVars.ALGOLIA_APP_ID,
    requiredEnvVars.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
}

// Index names
export const INDICES = {
  PAPERS: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_papers`,
  ARCHIVES: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_archives`,
  AUTHORS: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_authors`,
  CONFERENCES: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_conferences`, 
  NEWS: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_news`,
  PAGES: `${requiredEnvVars.ALGOLIA_INDEX_PREFIX}_pages`
} as const

// Default search configuration
export const DEFAULT_SEARCH_CONFIG = {
  hitsPerPage: 20,
  attributesToHighlight: ['title', 'description', 'content', 'authors'],
  attributesToSnippet: ['description:150', 'content:300'],
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
  typoTolerance: true,
  queryType: 'prefixAll' as const,
  removeWordsIfNoResults: 'allOptional' as const
}