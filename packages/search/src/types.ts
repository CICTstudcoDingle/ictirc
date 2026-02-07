// Search result types for different content types
export interface BaseSearchObject {
  objectID: string
  type: 'paper' | 'archive' | 'author' | 'conference' | 'news' | 'page'
  title: string
  description?: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface PaperSearchObject extends BaseSearchObject {
  type: 'paper'
  authors: string[]
  authorIds: string[]
  abstract: string
  keywords: string[]
  category: string
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published' | 'rejected'
  conferenceId?: string
  conferenceName?: string
  year: number
  doi?: string
  citations?: number
}

export interface ArchiveSearchObject extends BaseSearchObject {
  type: 'archive'
  authors: string[]
  volume?: number
  issue?: number
  year: number
  conferenceId?: string
  conferenceName?: string
  category: string
  doi?: string
  pdfUrl?: string
}

export interface AuthorSearchObject extends BaseSearchObject {
  type: 'author'
  name: string
  email: string
  affiliation?: string
  bio?: string
  researchInterests: string[]
  paperCount: number
  hIndex?: number
  orcid?: string
}

export interface ConferenceSearchObject extends BaseSearchObject {
  type: 'conference'
  name: string
  year: number
  location?: string
  startDate: string
  endDate: string
  organizer: string
  website?: string
  paperCount: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export interface NewsSearchObject extends BaseSearchObject {
  type: 'news'
  content: string
  author: string
  tags: string[]
  featured: boolean
}

export interface PageSearchObject extends BaseSearchObject {
  type: 'page'
  content: string
  slug: string
  category: string
}

export type SearchObject = 
  | PaperSearchObject 
  | ArchiveSearchObject 
  | AuthorSearchObject 
  | ConferenceSearchObject 
  | NewsSearchObject 
  | PageSearchObject

// Search configuration types
export interface SearchConfig {
  hitsPerPage?: number
  page?: number
  facetFilters?: string[]
  numericFilters?: string[]
  attributesToHighlight?: string[]
  attributesToSnippet?: string[]
  typoTolerance?: boolean
  queryType?: 'prefixAll' | 'prefixLast' | 'prefixNone'
  removeWordsIfNoResults?: 'none' | 'lastWords' | 'firstWords' | 'allOptional'
}

// Search result types
export interface SearchHit<T = SearchObject> {
  hit: T & {
    _highlightResult?: Record<string, any>
    _snippetResult?: Record<string, any>
  }
}

export interface SearchResponse<T = SearchObject> {
  hits: SearchHit<T>[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
  facets?: Record<string, Record<string, number>>
  query: string
}

// Facet configuration
export interface FacetConfig {
  attribute: string
  label: string
  type: 'list' | 'range' | 'hierarchical'
  searchable?: boolean
  limit?: number
}

// Index configuration
export interface IndexConfig {
  name: string
  searchableAttributes: string[]
  attributesForFaceting: string[]
  customRanking?: string[]
  replicas?: ReplicaConfig[]
}

export interface ReplicaConfig {
  name: string
  ranking: string[]
}

// Component props types
export interface SearchInputProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  onSelect?: (hit: SearchObject) => void
  showResults?: boolean
}

export interface SearchResultsProps {
  query: string
  indices?: string[]
  hitsPerPage?: number
  showFacets?: boolean
  className?: string
}

export interface FacetProps {
  attribute: string
  label: string
  type?: 'list' | 'range'
  searchable?: boolean
  limit?: number
  className?: string
}