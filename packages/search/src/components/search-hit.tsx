'use client'

import React from 'react'
import { FileText, User, Calendar, Archive, Globe, BookOpen } from 'lucide-react'
import type { SearchObject } from '../types'

interface SearchHitProps {
  hit: SearchObject & {
    _highlightResult?: Record<string, any>
    _snippetResult?: Record<string, any>
  }
  compact?: boolean
  onClick?: () => void
}

export function SearchHit({ hit, compact = false, onClick }: SearchHitProps) {
  const getIcon = () => {
    switch (hit.type) {
      case 'paper':
        return <FileText className="h-4 w-4" />
      case 'author': 
        return <User className="h-4 w-4" />
      case 'conference':
        return <Calendar className="h-4 w-4" />
      case 'archive':
        return <Archive className="h-4 w-4" />
      case 'news':
        return <Globe className="h-4 w-4" />
      case 'page':
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (hit.type) {
      case 'paper':
        return 'bg-blue-100 text-blue-800'
      case 'author':
        return 'bg-green-100 text-green-800'
      case 'conference':
        return 'bg-purple-100 text-purple-800'
      case 'archive':
        return 'bg-orange-100 text-orange-800'
      case 'news':
        return 'bg-red-100 text-red-800'
      case 'page':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = () => {
    switch (hit.type) {
      case 'paper':
        return 'Paper'
      case 'author':
        return 'Author'
      case 'conference':
        return 'Conference'
      case 'archive':
        return 'Archive'
      case 'news':
        return 'News'
      case 'page':
        return 'Page'
      default:
        return 'Content'
    }
  }

  const getHighlightedText = (attribute: string, fallback: string) => {
    const highlighted = hit._highlightResult?.[attribute]?.value
    return highlighted ? (
      <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    ) : (
      fallback
    )
  }

  const getSnippet = (attribute: string) => {
    return hit._snippetResult?.[attribute]?.value || ''
  }

  const renderPaperHit = () => {
    const paper = hit as any // Type assertion for paper-specific fields
    return (
      <>
        <div className="flex items-start gap-2">
          <div className="text-gray-500 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
              {getHighlightedText('title', hit.title)}
            </h3>
            
            {!compact && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {getSnippet('abstract') || hit.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              {paper.authors?.length > 0 && (
                <span>
                  {getHighlightedText('authors', paper.authors.slice(0, 2).join(', '))}
                  {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
                </span>
              )}
              {paper.year && <span>• {paper.year}</span>}
              {paper.category && <span>• {paper.category}</span>}
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderAuthorHit = () => {
    const author = hit as any
    return (
      <>
        <div className="flex items-start gap-2">
          <div className="text-gray-500 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {getHighlightedText('name', author.name)}
            </h3>
            
            {author.affiliation && (
              <p className="text-sm text-gray-600 mt-1">
                {getHighlightedText('affiliation', author.affiliation)}
              </p>
            )}
            
            {!compact && author.bio && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {getSnippet('bio')}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              {author.paperCount > 0 && <span>{author.paperCount} papers</span>}
              {author.researchInterests?.length > 0 && (
                <span>• {author.researchInterests.slice(0, 2).join(', ')}</span>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderConferenceHit = () => {
    const conf = hit as any
    return (
      <>
        <div className="flex items-start gap-2">
          <div className="text-gray-500 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {getHighlightedText('name', conf.name)}
            </h3>
            
            {!compact && hit.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {getSnippet('description')}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              {conf.year && <span>{conf.year}</span>}
              {conf.location && <span>• {conf.location}</span>}
              {conf.paperCount > 0 && <span>• {conf.paperCount} papers</span>}
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderDefaultHit = () => {
    return (
      <>
        <div className="flex items-start gap-2">
          <div className="text-gray-500 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
              {getHighlightedText('title', hit.title)}
            </h3>
            
            {!compact && hit.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {getSnippet('description') || hit.description}
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div
      className={`${compact ? 'py-2' : 'p-4'} hover:bg-gray-50 cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {hit.type === 'paper' && renderPaperHit()}
          {hit.type === 'author' && renderAuthorHit()}
          {hit.type === 'conference' && renderConferenceHit()}
          {!['paper', 'author', 'conference'].includes(hit.type) && renderDefaultHit()}
        </div>
        
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {getTypeLabel()}
          </span>
        </div>
      </div>
    </div>
  )
}