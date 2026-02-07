import type { 
  PaperSearchObject, 
  ArchiveSearchObject, 
  AuthorSearchObject, 
  ConferenceSearchObject,
  NewsSearchObject,
  PageSearchObject
} from './types'

// Type definitions for database models (from Prisma)
// These would typically be imported from @ictirc/database
interface PaperDB {
  id: string
  title: string
  abstract: string
  keywords: string[]
  status: string
  createdAt: Date
  updatedAt: Date
  authors: { id: string; name: string; email: string }[]
  conference?: { id: string; name: string; year: number }
  category: { name: string }
  doi?: string
}

interface ArchiveDB {
  id: string
  title: string
  description?: string
  authors: string[]
  volume?: number
  issue?: number
  year: number
  createdAt: Date
  updatedAt: Date
  conference?: { id: string; name: string }
  category: { name: string }
  doi?: string
  pdfUrl?: string
}

interface AuthorDB {
  id: string
  name: string
  email: string
  affiliation?: string
  bio?: string
  researchInterests: string[]
  createdAt: Date
  updatedAt: Date
  orcid?: string
  papers: any[] // For counting
}

interface ConferenceDB {
  id: string
  name: string
  description?: string
  year: number
  location?: string
  startDate: Date
  endDate: Date
  organizer: string
  website?: string
  createdAt: Date
  updatedAt: Date
  papers: any[] // For counting
  status: string
}

// Transformer functions
export function transformPaperToSearch(paper: PaperDB): PaperSearchObject {
  return {
    objectID: paper.id,
    type: 'paper',
    title: paper.title,
    description: paper.abstract,
    abstract: paper.abstract, 
    url: `/papers/${paper.id}`,
    authors: paper.authors.map(a => a.name),
    authorIds: paper.authors.map(a => a.id),
    keywords: paper.keywords,
    category: paper.category.name,
    status: paper.status as any,
    conferenceId: paper.conference?.id,
    conferenceName: paper.conference?.name,
    year: paper.conference?.year || new Date(paper.createdAt).getFullYear(),
    doi: paper.doi,
    createdAt: paper.createdAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString()
  }
}

export function transformArchiveToSearch(archive: ArchiveDB): ArchiveSearchObject {
  return {
    objectID: archive.id,
    type: 'archive',
    title: archive.title,
    description: archive.description,
    url: `/archive/${archive.id}`,
    authors: archive.authors,
    volume: archive.volume,
    issue: archive.issue,
    year: archive.year,
    conferenceId: archive.conference?.id,
    conferenceName: archive.conference?.name,
    category: archive.category.name,
    doi: archive.doi,
    pdfUrl: archive.pdfUrl,
    createdAt: archive.createdAt.toISOString(),
    updatedAt: archive.updatedAt.toISOString()
  }
}

export function transformAuthorToSearch(author: AuthorDB): AuthorSearchObject {
  return {
    objectID: author.id,
    type: 'author',
    title: author.name,
    name: author.name,
    description: author.bio,
    url: `/authors/${author.id}`,
    email: author.email,
    affiliation: author.affiliation,
    bio: author.bio,
    researchInterests: author.researchInterests,
    paperCount: author.papers.length,
    orcid: author.orcid,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString()
  }
}

export function transformConferenceToSearch(conference: ConferenceDB): ConferenceSearchObject {
  return {
    objectID: conference.id,
    type: 'conference',
    title: conference.name,
    name: conference.name,
    description: conference.description,
    url: `/conferences/${conference.id}`,
    year: conference.year,
    location: conference.location,
    startDate: conference.startDate.toISOString(),
    endDate: conference.endDate.toISOString(),
    organizer: conference.organizer,
    website: conference.website,
    paperCount: conference.papers.length,
    status: conference.status as any,
    createdAt: conference.createdAt.toISOString(),
    updatedAt: conference.updatedAt.toISOString()
  }
}

// Generic batch transform utilities
export function transformBatch<T, U>(
  items: T[],
  transformer: (item: T) => U
): U[] {
  return items.map(transformer)
}

export function chunkArray<T>(array: T[], chunkSize: number = 1000): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// Validation helpers
export function validateSearchObject(obj: any): boolean {
  return (
    obj &&
    typeof obj.objectID === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  )
}

// Helper for cleaning text content
export function cleanTextContent(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}