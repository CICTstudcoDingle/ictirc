import { createAdminClient, INDICES } from './client'
import type { IndexConfig } from './types'

// Index configurations
export const INDEX_CONFIGS: Record<string, IndexConfig> = {
  [INDICES.PAPERS]: {
    name: INDICES.PAPERS,
    searchableAttributes: [
      'title',
      'abstract', 
      'authors',
      'keywords',
      'category',
      'conferenceName'
    ],
    attributesForFaceting: [
      'searchable(category)',
      'searchable(authors)', 
      'status',
      'year',
      'conferenceName'
    ],
    customRanking: ['desc(year)', 'desc(createdAt)'],
    replicas: [
      {
        name: `${INDICES.PAPERS}_year_asc`,
        ranking: ['asc(year)', 'desc(createdAt)']
      },
      {
        name: `${INDICES.PAPERS}_title_asc`, 
        ranking: ['asc(title)', 'desc(createdAt)']
      }
    ]
  },

  [INDICES.ARCHIVES]: {
    name: INDICES.ARCHIVES,
    searchableAttributes: [
      'title',
      'description',
      'authors',
      'category',
      'conferenceName'
    ],
    attributesForFaceting: [
      'searchable(category)',
      'searchable(authors)',
      'year',
      'volume',
      'issue',
      'conferenceName'
    ],
    customRanking: ['desc(year)', 'desc(volume)', 'desc(issue)']
  },

  [INDICES.AUTHORS]: {
    name: INDICES.AUTHORS,
    searchableAttributes: [
      'name',
      'affiliation',
      'bio',
      'researchInterests'
    ],
    attributesForFaceting: [
      'searchable(affiliation)',
      'searchable(researchInterests)',
      'paperCount'
    ],
    customRanking: ['desc(paperCount)', 'desc(updatedAt)']
  },

  [INDICES.CONFERENCES]: {
    name: INDICES.CONFERENCES,
    searchableAttributes: [
      'name',
      'description',
      'location',
      'organizer'
    ],
    attributesForFaceting: [
      'year',
      'searchable(location)',
      'searchable(organizer)',
      'status'
    ],
    customRanking: ['desc(year)', 'desc(startDate)']
  },

  [INDICES.NEWS]: {
    name: INDICES.NEWS,
    searchableAttributes: [
      'title',
      'description',
      'content',
      'author',
      'tags'
    ],
    attributesForFaceting: [
      'searchable(author)',
      'searchable(tags)',
      'featured'
    ],
    customRanking: ['desc(featured)', 'desc(createdAt)']
  },

  [INDICES.PAGES]: {
    name: INDICES.PAGES,
    searchableAttributes: [
      'title',
      'description', 
      'content',
      'category'
    ],
    attributesForFaceting: [
      'searchable(category)'
    ],
    customRanking: ['desc(updatedAt)']
  }
}

// Index management functions
export async function setupIndices(): Promise<void> {
  const client = createAdminClient()
  
  for (const config of Object.values(INDEX_CONFIGS)) {
    try {
      console.log(`Setting up index: ${config.name}`)
      
      const index = client.initIndex(config.name)
      
      // Configure index settings
      await index.setSettings({
        searchableAttributes: config.searchableAttributes,
        attributesForFaceting: config.attributesForFaceting,
        customRanking: config.customRanking,
        hitsPerPage: 20,
        maxValuesPerFacet: 100,
        attributesToHighlight: ['title', 'description', 'content', 'authors'],
        attributesToSnippet: ['description:150', 'content:300'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        typoTolerance: true,
        queryType: 'prefixAll',
        removeWordsIfNoResults: 'allOptional'
      })

      console.log(`✅ Index ${config.name} configured successfully`)

      // Create replicas if specified
      if (config.replicas && config.replicas.length > 0) {
        for (const replica of config.replicas) {
          const replicaIndex = client.initIndex(replica.name)
          await replicaIndex.setSettings({
            ranking: replica.ranking,
            // Inherit other settings from primary index
            searchableAttributes: config.searchableAttributes,
            attributesForFaceting: config.attributesForFaceting
          })
          console.log(`✅ Replica ${replica.name} configured successfully`)
        }
      }

    } catch (error) {
      console.error(`❌ Failed to setup index ${config.name}:`, error)
      throw error
    }
  }
}

export async function clearAllIndices(): Promise<void> {
  const client = createAdminClient()
  
  for (const indexName of Object.values(INDICES)) {
    try {
      const index = client.initIndex(indexName)
      await index.clearObjects()
      console.log(`✅ Cleared index: ${indexName}`)
    } catch (error) {
      console.error(`❌ Failed to clear index ${indexName}:`, error)
    }
  }
}

export async function deleteAllIndices(): Promise<void> {
  const client = createAdminClient()
  
  for (const indexName of Object.values(INDICES)) {
    try {
      const index = client.initIndex(indexName)
      await index.delete()
      console.log(`✅ Deleted index: ${indexName}`)
    } catch (error) {
      console.error(`❌ Failed to delete index ${indexName}:`, error)
    }
  }
}

export async function getIndexStats(): Promise<Record<string, any>> {
  const client = createAdminClient()
  const stats: Record<string, any> = {}
  
  for (const indexName of Object.values(INDICES)) {
    try {
      const index = client.initIndex(indexName)
      const task = await index.getSettings()
      stats[indexName] = {
        settings: task,
        // Add more stats as needed
      }
    } catch (error) {
      console.error(`❌ Failed to get stats for index ${indexName}:`, error)
      stats[indexName] = { error: error.message }
    }
  }
  
  return stats
}

// Bulk operations
export async function addObjectsToIndex<T extends { objectID: string }>(
  indexName: string, 
  objects: T[]
): Promise<void> {
  if (objects.length === 0) return
  
  const client = createAdminClient()
  const index = client.initIndex(indexName)
  
  try {
    // Process in chunks to avoid API limits
    const CHUNK_SIZE = 1000
    for (let i = 0; i < objects.length; i += CHUNK_SIZE) {
      const chunk = objects.slice(i, i + CHUNK_SIZE)
      await index.saveObjects(chunk)
      console.log(`✅ Added ${chunk.length} objects to ${indexName} (${i + chunk.length}/${objects.length})`)
    }
  } catch (error) {
    console.error(`❌ Failed to add objects to index ${indexName}:`, error)
    throw error
  }
}

export async function updateObjectsInIndex<T extends { objectID: string }>(
  indexName: string,
  objects: T[]
): Promise<void> {
  if (objects.length === 0) return
  
  const client = createAdminClient()
  const index = client.initIndex(indexName)
  
  try {
    await index.partialUpdateObjects(objects)
    console.log(`✅ Updated ${objects.length} objects in ${indexName}`)
  } catch (error) {
    console.error(`❌ Failed to update objects in index ${indexName}:`, error)
    throw error
  }
}

export async function deleteObjectsFromIndex(
  indexName: string,
  objectIDs: string[]
): Promise<void> {
  if (objectIDs.length === 0) return
  
  const client = createAdminClient()
  const index = client.initIndex(indexName)
  
  try {
    await index.deleteObjects(objectIDs)
    console.log(`✅ Deleted ${objectIDs.length} objects from ${indexName}`)
  } catch (error) {
    console.error(`❌ Failed to delete objects from index ${indexName}:`, error)
    throw error
  }
}