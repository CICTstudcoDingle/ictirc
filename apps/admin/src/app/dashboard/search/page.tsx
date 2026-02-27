'use client'

import { useState } from 'react'
import { Search, Database, Settings, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Loader2, Eye } from 'lucide-react'
import { useSearch } from '@ictirc/search'
import { SearchInput, SearchHitCard } from '@ictirc/search'

interface SearchStats {
  [indexName: string]: {
    settings?: any
    error?: string
  }
}

export default function SearchManagementPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const { query, setQuery, results, isLoading: searchLoading, totalHits, processingTimeMS } = useSearch()

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/search/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const result = await response.json()
      
      if (result.success) {
        showMessage('success', result.message)
        if (action === 'stats') {
          setStats(result.data)
        }
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'Operation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/search/manage')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      } else {
        showMessage('error', 'Failed to load statistics')
      }
    } catch (error) {
      showMessage('error', 'Failed to load statistics')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="h-5 w-5 md:h-6 md:w-6" />
          Search Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage Algolia search indices, synchronize data, and monitor search performance.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-3 md:p-4 rounded-lg flex items-center gap-2 text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          ) : (
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Setup Indices */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="p-2 bg-[#800000]/10 rounded-lg">
              <Settings className="h-6 w-6 md:h-8 md:w-8 text-[#800000]" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Setup Indices</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Initialize Algolia indices with proper configuration and settings.
          </p>
          <button
            onClick={() => handleAction('setup')}
            disabled={isLoading}
            className="w-full bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#600000] hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </span>
            ) : 'Setup Indices'}
          </button>
        </div>

        {/* Sync Data */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="p-2 bg-[#800000]/10 rounded-lg">
              <Database className="h-6 w-6 md:h-8 md:w-8 text-[#800000]" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Sync Data</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Synchronize all papers, authors, conferences, and archives to Algolia.
          </p>
          <button
            onClick={() => handleAction('sync')}
            disabled={isLoading}
            className="w-full bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#600000] hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Syncing...
              </span>
            ) : 'Sync All Data'}
          </button>
        </div>

        {/* Load Statistics */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Statistics</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            View search performance metrics and index status information.
          </p>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="w-full bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#600000] hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : 'Load Stats'}
          </button>
        </div>

        {/* Clear Indices */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <RefreshCw className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Clear Indices</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Remove all data from Algolia indices. Use with caution!
          </p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all search indices? This cannot be undone.')) {
                handleAction('clear')
              }
            }}
            disabled={isLoading}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Clearing...
              </span>
            ) : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Statistics Display */}
      {stats && (
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4">Index Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {Object.entries(stats).map(([indexName, indexStats]) => (
              <div key={indexName} className="border border-gray-100 rounded-lg p-3 md:p-4">
                <h4 className="font-medium text-gray-900 mb-2 text-sm font-mono truncate">{indexName}</h4>
                {indexStats.error ? (
                  <div className="text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Error: {indexStats.error}</span>
                  </div>
                ) : (
                    <div className="text-green-600 text-xs flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    Index configured successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Search Preview */}
      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 w-full text-left"
        >
          <div className="p-2 bg-[#800000]/10 rounded-lg">
            <Eye className="h-5 w-5 text-[#800000]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold">Live Search Preview</h3>
            <p className="text-xs text-gray-500">Test search results after syncing data</p>
          </div>
          <span className="text-xs text-gray-400">{showPreview ? '▼' : '▶'}</span>
        </button>

        {showPreview && (
          <div className="mt-4 space-y-4">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Test search: type to see results..."
              size="md"
            />

            {searchLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            )}

            {query && !searchLoading && (
              <p className="text-xs text-gray-500">
                Found <span className="font-medium text-gray-900">{totalHits}</span> results in{' '}
                <span className="font-mono text-[#800000]">{processingTimeMS}ms</span>
              </p>
            )}

            {results.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.slice(0, 10).map((hit) => (
                  <SearchHitCard key={hit.objectID} hit={hit} compact />
                ))}
                {results.length > 10 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Showing 10 of {totalHits} results
                  </p>
                )}
              </div>
            )}

            {query && !searchLoading && results.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No results. Make sure you&apos;ve synced data first.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-[#800000]/5 p-4 md:p-6 rounded-lg border border-[#800000]/10">
        <h3 className="text-base md:text-lg font-semibold text-[#800000] mb-2">Setup Instructions</h3>
        <div className="text-gray-700 space-y-2 text-xs md:text-sm">
          <p>1. <strong>Setup Indices:</strong> First-time setup to create Algolia indices with proper configuration.</p>
          <p>2. <strong>Sync Data:</strong> Import all existing data from your database to make it searchable.</p>
          <p>3. <strong>Preview:</strong> Use the Live Search Preview to verify data is properly indexed.</p>
          <p>4. <strong>Monitor:</strong> Use statistics to monitor search performance and index health.</p>
        </div>
      </div>
    </div>
  )
}