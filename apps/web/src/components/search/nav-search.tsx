'use client'

import React from 'react'
import { SearchInput } from '@ictirc/search'
import { useRouter } from 'next/navigation'

interface NavSearchProps {
  className?: string
}

export function NavSearch({ className }: NavSearchProps) {
  const router = useRouter()

  const handleSearch = (query: string) => {
    // Navigate to search results page with query
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSelect = (hit: any) => {
    // Navigate directly to the selected item
    router.push(hit.url)
  }

  return (
    <SearchInput
      placeholder="Search papers, authors, conferences..."
      className={className}
      onSearch={handleSearch}
      onSelect={handleSelect}
      showResults={true}
    />
  )
}