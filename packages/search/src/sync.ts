import { createAdminClient, INDICES } from './client'
import { prisma } from '@ictirc/database'

const db = prisma

// Sync all data from database to Algolia
export async function syncAllData() {
  console.log('🔄 Starting full Algolia data sync...')
  
  try {
    await syncPapers()
    await syncArchives()
    await syncAuthors()
    await syncConferences()
    console.log('✅ Full Algolia sync completed successfully!')
  } catch (error) {
    console.error('❌ Full sync failed:', error)
    throw error
  }
}

// ─── Paper sync ───────────────────────────────────────────────────────────────
// Schema: Paper → PaperAuthor → Author, Paper → Category, Paper → Issue → Conference
export async function syncPapers() {
  console.log('📄 Syncing papers to Algolia...')

  const papers = await db.paper.findMany({
    where: { status: { in: ['PUBLISHED', 'ACCEPTED'] } },
    include: {
      authors: {
        include: { author: true },
        orderBy: { order: 'asc' },
      },
      category: true,
      issue: {
        include: {
          volume: true,
          conference: true,
        },
      },
    },
  })

  if (papers.length === 0) {
    console.log('⚠️  No published papers to sync')
    return
  }

  const client = createAdminClient()
  const index = client.initIndex(INDICES.PAPERS)

  const objects = papers.map(paper => ({
    objectID: paper.id,
    type: 'paper',
    title: paper.title,
    description: paper.abstract,
    abstract: paper.abstract,
    url: `/archive/${paper.id}`,
    authors: paper.authors.map(a => a.author.name),
    authorIds: paper.authors.map(a => a.author.id),
    keywords: paper.keywords,
    category: paper.category.name,
    status: paper.status,
    year: paper.issue?.volume?.year ?? paper.publishedAt?.getFullYear() ?? new Date().getFullYear(),
    volume: paper.issue?.volume?.volumeNumber,
    issue: paper.issue?.issueNumber,
    conferenceId: paper.issue?.conference?.id,
    conferenceName: paper.issue?.conference?.name,
    doi: paper.doi,
    pdfUrl: paper.pdfUrl,
    createdAt: paper.createdAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString(),
  }))

  await index.saveObjects(objects)
  console.log(`✅ Synced ${objects.length} papers to Algolia`)
}

// ─── ArchivedPaper sync ───────────────────────────────────────────────────────
// Schema: ArchivedPaper → ArchivedPaperAuthor (embedded names), ArchivedPaper → Category, → Issue → Volume/Conference
export async function syncArchives() {
  console.log('📚 Syncing archived papers to Algolia...')

  const archives = await db.archivedPaper.findMany({
    include: {
      authors: { orderBy: { order: 'asc' } },
      category: true,
      issue: {
        include: {
          volume: true,
          conference: true,
        },
      },
    },
  })

  if (archives.length === 0) {
    console.log('⚠️  No archived papers to sync')
    return
  }

  const client = createAdminClient()
  const index = client.initIndex(INDICES.ARCHIVES)

  const objects = archives.map(archive => ({
    objectID: archive.id,
    type: 'archive',
    title: archive.title,
    description: archive.abstract,
    abstract: archive.abstract,
    url: `/archive/${archive.id}`,
    authors: archive.authors.map(a => a.name),
    keywords: archive.keywords,
    category: archive.category.name,
    volume: archive.issue?.volume?.volumeNumber,
    issue: archive.issue?.issueNumber,
    year: archive.issue?.volume?.year ?? archive.publishedDate.getFullYear(),
    conferenceId: archive.issue?.conference?.id,
    conferenceName: archive.issue?.conference?.name,
    doi: archive.doi,
    pdfUrl: archive.pdfUrl,
    createdAt: archive.createdAt.toISOString(),
    updatedAt: archive.updatedAt.toISOString(),
  }))

  await index.saveObjects(objects)
  console.log(`✅ Synced ${objects.length} archived papers to Algolia`)
}

// ─── Author sync ──────────────────────────────────────────────────────────────
// Schema: Author → PaperAuthor → Paper (count via _count or manual count)
export async function syncAuthors() {
  console.log('👥 Syncing authors to Algolia...')

  const authors = await db.author.findMany({
    include: {
      papers: true, // PaperAuthor join table
    },
  })

  if (authors.length === 0) {
    console.log('⚠️  No authors to sync')
    return
  }

  const client = createAdminClient()
  const index = client.initIndex(INDICES.AUTHORS)

  const objects = authors.map(author => ({
    objectID: author.id,
    type: 'author',
    title: author.name,
    name: author.name,
    description: null,
    url: `/authors/${author.id}`,
    email: author.email,
    affiliation: author.affiliation,
    paperCount: author.papers.length,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString(),
  }))

  await index.saveObjects(objects)
  console.log(`✅ Synced ${objects.length} authors to Algolia`)
}

// ─── Conference sync ──────────────────────────────────────────────────────────
// Schema: Conference → Issue (count papers via issues.papers)
export async function syncConferences() {
  console.log('📅 Syncing conferences to Algolia...')

  const conferences = await db.conference.findMany({
    where: { isPublished: true },
    include: {
      issues: {
        include: {
          papers: { select: { id: true } },
        },
      },
    },
  })

  if (conferences.length === 0) {
    console.log('⚠️  No conferences to sync')
    return
  }

  const client = createAdminClient()
  const index = client.initIndex(INDICES.CONFERENCES)

  const objects = conferences.map(conf => {
    const paperCount = conf.issues.reduce((sum, issue) => sum + issue.papers.length, 0)
    const year = conf.startDate.getFullYear()

    return {
      objectID: conf.id,
      type: 'conference',
      title: conf.name,
      name: conf.name,
      description: conf.description,
      url: `/conferences/${conf.id}`,
      year,
      location: conf.location,
      startDate: conf.startDate.toISOString(),
      endDate: conf.endDate?.toISOString() ?? conf.startDate.toISOString(),
      organizer: conf.organizers?.[0] ?? 'ICTIRC',
      website: conf.websiteUrl,
      paperCount,
      status: conf.isActive ? 'ongoing' : (new Date() > conf.startDate ? 'completed' : 'upcoming'),
      createdAt: conf.createdAt.toISOString(),
      updatedAt: conf.updatedAt.toISOString(),
    }
  })

  await index.saveObjects(objects)
  console.log(`✅ Synced ${objects.length} conferences to Algolia`)
}

// ─── Individual entity sync ───────────────────────────────────────────────────

export async function syncPaper(paperId: string) {
  const paper = await db.paper.findUnique({
    where: { id: paperId },
    include: {
      authors: {
        include: { author: true },
        orderBy: { order: 'asc' },
      },
      category: true,
      issue: {
        include: { volume: true, conference: true },
      },
    },
  })

  if (!paper) return

  const client = createAdminClient()
  const index = client.initIndex(INDICES.PAPERS)

  await index.partialUpdateObject({
    objectID: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors.map(a => a.author.name),
    keywords: paper.keywords,
    category: paper.category.name,
    status: paper.status,
    year: paper.issue?.volume?.year ?? paper.publishedAt?.getFullYear(),
    doi: paper.doi,
    updatedAt: paper.updatedAt.toISOString(),
  })
}

export async function deletePaperFromSearch(paperId: string) {
  const client = createAdminClient()
  await client.initIndex(INDICES.PAPERS).deleteObject(paperId)
}

export async function deleteAuthorFromSearch(authorId: string) {
  const client = createAdminClient()
  await client.initIndex(INDICES.AUTHORS).deleteObject(authorId)
}

export async function syncAuthor(authorId: string) {
  const author = await db.author.findUnique({
    where: { id: authorId },
    include: { papers: true },
  })

  if (!author) return

  const client = createAdminClient()
  await client.initIndex(INDICES.AUTHORS).partialUpdateObject({
    objectID: author.id,
    name: author.name,
    affiliation: author.affiliation,
    paperCount: author.papers.length,
    updatedAt: author.updatedAt.toISOString(),
  })
}