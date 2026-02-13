'use client'

import { Suspense } from 'react'
import { Search } from 'lucide-react'

function SearchResultsContent() {
  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search Coming Soon
          </h1>
          <p className="text-gray-600 mb-8">
            Our advanced search feature is currently being configured. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-14 md:pt-16">
        <div className="text-center">
          <Search className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
