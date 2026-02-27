'use client'

import React from 'react'
import type { SearchHitResult } from '../hooks'

interface SearchHitCardProps {
  hit: SearchHitResult
  onClick?: (hit: SearchHitResult) => void
  compact?: boolean
}

// Safely render highlighted text (strips XSS, only allows <mark>)
function HighlightedText({ html, fallback }: { html?: string; fallback: string }) {
  if (!html) return <>{fallback}</>
  // Only allow <mark> tags
  const sanitized = html.replace(/<(?!\/?mark>)[^>]+>/g, '')
  return <span dangerouslySetInnerHTML={{ __html: sanitized }} />
}

function getTypeLabel(type: string) {
  const labels: Record<string, { text: string; color: string }> = {
    paper: { text: 'Paper', color: 'bg-blue-100 text-blue-800' },
    archive: { text: 'Archive', color: 'bg-purple-100 text-purple-800' },
    author: { text: 'Author', color: 'bg-green-100 text-green-800' },
    conference: { text: 'Conference', color: 'bg-amber-100 text-amber-800' },
    news: { text: 'News', color: 'bg-gray-100 text-gray-800' },
    page: { text: 'Page', color: 'bg-gray-100 text-gray-800' },
  }
  return labels[type] || { text: type, color: 'bg-gray-100 text-gray-800' }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'paper':
    case 'archive':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'author':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'conference':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
  }
}

export function SearchHitCard({ hit, onClick, compact = false }: SearchHitCardProps) {
  const typeInfo = getTypeLabel(hit.type)
  const highlightedTitle = hit._highlightResult?.title?.value
  const highlightedDesc = hit._snippetResult?.description?.value || hit._snippetResult?.abstract?.value
  const highlightedAuthors = (hit._highlightResult?.authors as any)?.map?.((a: any) => a.value) as string[] | undefined

  return (
    <article
      onClick={() => onClick?.(hit)}
      className={`
        bg-white border border-gray-200 rounded-lg shadow-sm 
        hover:border-[#800000]/30 hover:shadow-md
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${compact ? 'p-3' : 'p-4 md:p-5'}
      `}
    >
      {/* Type indicator bar */}
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch bg-[#800000] rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {/* Top row: type badge + year */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>
              {getTypeIcon(hit.type)}
              {typeInfo.text}
            </span>
            {hit.category && (
              <span className="text-xs font-medium text-[#800000] bg-[#800000]/5 px-2 py-0.5 rounded-full">
                {hit.category}
              </span>
            )}
            {hit.year && (
              <span className="text-xs text-gray-400 font-mono ml-auto flex-shrink-0">
                {hit.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-gray-900 leading-snug ${compact ? 'text-sm' : 'text-base md:text-lg'}`}>
            <HighlightedText html={highlightedTitle} fallback={hit.title} />
          </h3>

          {/* Authors */}
          {hit.authors && hit.authors.length > 0 && (
            <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">
              {highlightedAuthors
                ? highlightedAuthors.map((a: string, i: number) => (
                    <React.Fragment key={i}>
                      {i > 0 && ', '}
                      <HighlightedText html={a} fallback={hit.authors![i]} />
                    </React.Fragment>
                  ))
                : hit.authors.join(', ')
              }
            </p>
          )}

          {/* Author-type specifics */}
          {hit.type === 'author' && (
            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
              {hit.affiliation && <p>{hit.affiliation}</p>}
              {hit.paperCount !== undefined && <p>{hit.paperCount} paper{hit.paperCount !== 1 ? 's' : ''}</p>}
            </div>
          )}

          {/* Conference-type specifics */}
          {hit.type === 'conference' && (
            <div className="text-xs text-gray-500 mt-1">
              {hit.location && <span>{hit.location} • </span>}
              {hit.organizer && <span>{hit.organizer}</span>}
            </div>
          )}

          {/* Snippet / Description */}
          {!compact && (highlightedDesc || hit.description || hit.abstract) && (
            <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-2 md:line-clamp-3">
              <HighlightedText
                html={highlightedDesc}
                fallback={hit.description || hit.abstract || ''}
              />
            </p>
          )}

          {/* Keywords / Volume+Issue */}
          {!compact && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {hit.volume !== undefined && hit.issue !== undefined && (
                <span className="text-xs text-gray-400 font-mono">
                  Vol. {hit.volume}, Issue {hit.issue}
                </span>
              )}
              {hit.doi && (
                <span className="text-xs text-gray-400 font-mono truncate">
                  DOI: {hit.doi}
                </span>
              )}
              {hit.keywords && hit.keywords.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {hit.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
