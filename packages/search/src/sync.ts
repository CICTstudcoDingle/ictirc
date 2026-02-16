import { createAdminClient, INDICES } from './client'
import {
  transformPaperToSearch,
  transformArchiveToSearch,
  transformAuthorToSearch,
  transformConferenceToSearch,
  chunkArray
} from './transformers'
import { addObjectsToIndex, updateObjectsInIndex, deleteObjectsFromIndex } from './indices'
import { prisma } from '@ictirc/database'

// Alias prisma client for clarity within this module
const db = prisma


// Sync all data from database to Algolia
export async function syncAllData() {
  console.log('🔄 Starting full Algolia data sync...')
  
  try {
    // Sync Papers
    await syncPapers()
    
    // Sync Archives  
    await syncArchives()
    
    // Sync Authors
    await syncAuthors()
    
    // Sync Conferences
    await syncConferences()
    
    console.log('✅ Full Algolia sync completed successfully!')
    
  } catch (error) {
    console.error('❌ Full sync failed:', error)
    throw error
  }
}

export async function syncPapers() {
  console.log('📄 Syncing papers to Algolia...')
  
  const papers = await db.paper.findMany({
    include: {
      authors: {
        include: {
          author: true
        }
      },
      conference: true
    } as any
  })

  const searchObjects = papers.map(paper => transformPaperToSearch({
    ...paper,
    authors: (paper as any).authors.map((a: any) => ({
      id: a.author.id,
      name: a.author.name,
      email: a.author.email
    }))
  } as any))

  if (searchObjects.length > 0) {
    await addObjectsToIndex(INDICES.PAPERS, searchObjects)
    console.log(`✅ Synced ${searchObjects.length} papers to Algolia`)
  }
}

export async function syncArchives() {
  console.log('📚 Syncing archive papers to Algolia...')
  
  const archives = await db.archivedPaper.findMany({
    include: {
      conference: true
    } as any
  })

  const searchObjects = archives.map(archive => transformArchiveToSearch({
    ...archive,
    authors: (archive as any).authors
  } as any))

  if (searchObjects.length > 0) {
    await addObjectsToIndex(INDICES.ARCHIVES, searchObjects)
    console.log(`✅ Synced ${searchObjects.length} archived papers to Algolia`)
  }
}

export async function syncAuthors() {
  console.log('👥 Syncing authors to Algolia...')
  
  const authors = await db.author.findMany({
    include: {
      papers: true
    } as any
  })

  const searchObjects = authors.map(author => transformAuthorToSearch({
    ...author,
    papers: (author as any).papers
  } as any))

  if (searchObjects.length > 0) {
    await addObjectsToIndex(INDICES.AUTHORS, searchObjects)
    console.log(`✅ Synced ${searchObjects.length} authors to Algolia`)
  }
}

export async function syncConferences() {
  console.log('📅 Syncing conferences to Algolia...')
  
  const conferences = await db.conference.findMany({
    include: {
      papers: true
    } as any
  })

  const searchObjects = conferences.map(conf => transformConferenceToSearch({
    ...conf,
    papers: (conf as any).papers
  } as any))

  if (searchObjects.length > 0) {
    await addObjectsToIndex(INDICES.CONFERENCES, searchObjects)
    console.log(`✅ Synced ${searchObjects.length} conferences to Algolia`)
  }
}

// Individual entity sync functions
export async function syncPaper(paperId: string) {
  const paper = await db.paper.findUnique({
    where: { id: paperId },
    include: {
      authors: {
        include: {
          author: true
        }
      },
      conference: true
    } as any
  }) as any // Cast to any to avoid complex Prisma include typing issues

  if (paper) {
    const searchObject = transformPaperToSearch({
      ...paper,
      authors: paper.authors.map((a: any) => ({
        id: a.author.id,
        name: a.author.name,
        email: a.author.email
      }))
    } as any)
    await updateObjectsInIndex(INDICES.PAPERS, [searchObject])
  }
}

export async function syncAuthor(authorId: string) {
  const author = await db.author.findUnique({
    where: { id: authorId },
    include: {
      papers: true
    } as any
  })

  if (author) {
    const searchObject = transformAuthorToSearch({
      ...author,
      papers: (author as any).papers
    } as any)
    await updateObjectsInIndex(INDICES.AUTHORS, [searchObject])
  }
}

export async function deletePaperFromSearch(paperId: string) {
  await deleteObjectsFromIndex(INDICES.PAPERS, [paperId])
}

export async function deleteAuthorFromSearch(authorId: string) {
  await deleteObjectsFromIndex(INDICES.AUTHORS, [authorId])
}