'use client'

import { useState } from 'react'
import { Search, Database, Settings, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="h-6 w-6" />
          Search Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage Algolia search indices, synchronize data, and monitor search performance.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Setup Indices */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h3 className="font-semibold">Setup Indices</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Initialize Algolia indices with proper configuration and settings.
          </p>
          <button
            onClick={() => handleAction('setup')}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Setup Indices'}
          </button>
        </div>

        {/* Sync Data */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <h3 className="font-semibold">Sync Data</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Synchronize all papers, authors, conferences, and archives to Algolia.
          </p>
          <button
            onClick={() => handleAction('sync')}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Syncing...' : 'Sync All Data'}
          </button>
        </div>

        {/* Load Statistics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <h3 className="font-semibold">Statistics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View search performance metrics and index status information.
          </p>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load Stats'}
          </button>
        </div>

        {/* Clear Indices */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="h-8 w-8 text-red-600" />
            <h3 className="font-semibold">Clear Indices</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Remove all data from Algolia indices. Use with caution!
          </p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all search indices? This cannot be undone.')) {
                handleAction('clear')
              }
            }}
            disabled={isLoading}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Statistics Display */}
      {stats && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Index Statistics</h3>
          <div className="space-y-4">
            {Object.entries(stats).map(([indexName, indexStats]) => (
              <div key={indexName} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{indexName}</h4>
                {indexStats.error ? (
                  <div className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Error: {indexStats.error}
                  </div>
                ) : (
                  <div className="text-green-600 text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Index configured successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
        <div className="text-blue-800 space-y-2 text-sm">
          <p>1. <strong>Setup Indices:</strong> First-time setup to create Algolia indices with proper configuration.</p>
          <p>2. <strong>Sync Data:</strong> Import all existing data from your database to make it searchable.</p>
          <p>3. <strong>Monitor:</strong> Use statistics to monitor search performance and index health.</p>
          <p>4. <strong>Environment:</strong> Ensure Algolia credentials are configured in your .env file.</p>
        </div>
      </div>
    </div>
  )
}