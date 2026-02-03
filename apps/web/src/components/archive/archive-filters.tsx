"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Input, Button } from "@ictirc/ui";
import { useState, useEffect, useTransition } from "react";

interface ArchiveFiltersProps {
  categories: { id: string; name: string }[];
  years: number[];
  authors: { id: string; name: string }[];
}

export function ArchiveFilters({ categories, years, authors }: ArchiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentYear = searchParams.get("year") || "";
  const currentAuthor = searchParams.get("author") || "";

  const [query, setQuery] = useState(currentQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQuery) {
        handleSearch(query, currentCategory, currentYear, currentAuthor);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentCategory, currentYear, currentAuthor]);

  const handleSearch = (q: string, category: string, year: string, author: string) => {
    const params = new URLSearchParams(searchParams);
    if (q) params.set("q", q); else params.delete("q");
    if (category && category !== "all") params.set("category", category); else params.delete("category");
    if (year && year !== "all") params.set("year", year); else params.delete("year");
    if (author && author !== "all") params.set("author", author); else params.delete("author");
    
    // Reset page on filter change
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search papers by title or abstract..."
            className="pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Toggle for Mobile (could be added later) */}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Category Filter */}
        <div className="relative group">
          <select
            className="appearance-none bg-gray-50 border-b-2 border-gray-200 rounded-t-md px-3 py-2 pr-8 font-mono text-xs focus:outline-none focus:border-maroon focus:bg-white cursor-pointer transition-colors"
            value={currentCategory || "all"}
            onChange={(e) => handleSearch(query, e.target.value, currentYear, currentAuthor)}
            disabled={isPending}
          >
            <option value="all">All Disciplines</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:text-maroon" />
        </div>

        {/* Year Filter */}
        <div className="relative group">
          <select
            className="appearance-none bg-gray-50 border-b-2 border-gray-200 rounded-t-md px-3 py-2 pr-8 font-mono text-xs focus:outline-none focus:border-maroon focus:bg-white cursor-pointer transition-colors"
            value={currentYear || "all"}
            onChange={(e) => handleSearch(query, currentCategory, e.target.value, currentAuthor)}
            disabled={isPending}
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:text-maroon" />
        </div>

        {/* Author Filter */}
        <div className="relative group">
          <select
            className="appearance-none bg-gray-50 border-b-2 border-gray-200 rounded-t-md px-3 py-2 pr-8 font-mono text-xs focus:outline-none focus:border-maroon focus:bg-white cursor-pointer transition-colors"
            value={currentAuthor || "all"}
            onChange={(e) => handleSearch(query, currentCategory, currentYear, e.target.value)}
            disabled={isPending}
          >
            <option value="all">All Authors</option>
            {authors.map((auth) => (
              <option key={auth.id} value={auth.id}>{auth.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:text-maroon" />
        </div>

        {/* Clear Filters */}
        {(currentCategory || currentYear || currentAuthor || currentQuery) && (
          <button
            onClick={() => {
              setQuery("");
              handleSearch("", "all", "all", "all");
            }}
            className="text-xs text-gray-500 hover:text-maroon flex items-center gap-1 font-medium ml-2"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
