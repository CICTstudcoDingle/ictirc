'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useSearchResults } from '../hooks'
import { SearchHit } from './search-hit'
import type { SearchInputProps, SearchObject } from '../types'

export function SearchInput({
  placeholder = 'Search papers, authors, conferences...',
  className = '',
  onSearch,
  onSelect,
  showResults = true
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  
  const { results, isLoading, error } = useSearchResults({
    query,
    enabled: query.length >= 2,
    hitsPerPage: 8
  })

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !results.length) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          } else if (query.trim()) {
            handleSearch()
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length >= 2) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleSelect = (hit: SearchObject) => {
    setQuery(hit.title)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(hit)
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim())
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        
        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : query ? (
            <button
              onClick={clearSearch}
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && showResults && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Search error. Please try again.
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.objectID}
                  onClick={() => handleSelect(result)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <SearchHit hit={result} compact />
                </button>
              ))}
              
              {/* Show All Results Link */}
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm font-medium"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}