'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SearchInput({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = 'Search papers, authors, conferences...',
  className = '',
  autoFocus = false,
  size = 'md',
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(controlledValue || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const currentValue = controlledValue !== undefined ? controlledValue : localValue

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setLocalValue(v)
    onChange?.(v)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(currentValue)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  const sizeClasses = {
    sm: 'h-9 text-sm pl-9 pr-9',
    md: 'h-11 text-sm pl-11 pr-10',
    lg: 'h-14 text-base pl-12 pr-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const iconPositions = {
    sm: 'left-2.5',
    md: 'left-3.5',
    lg: 'left-4',
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute ${iconPositions[size]} top-1/2 -translate-y-1/2 ${iconSizes[size]} text-gray-400 pointer-events-none`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <input
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full ${sizeClasses[size]} 
          bg-gray-50 border-b-2 border-gray-200 rounded-t-md
          font-mono
          focus:outline-none focus:border-[#800000] focus:bg-white
          placeholder:text-gray-400
          transition-colors
        `}
      />

      {/* Clear button */}
      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}
