"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useTransition } from "react";

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

  const currentCategory = searchParams.get("category") || "";
  const currentYear = searchParams.get("year") || "";
  const currentAuthor = searchParams.get("author") || "";

  const handleFilter = (category: string, year: string, author: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    if (category && category !== "all") params.set("category", category); else params.delete("category");
    if (year && year !== "all") params.set("year", year); else params.delete("year");
    if (author && author !== "all") params.set("author", author); else params.delete("author");
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center w-full">
      {/* Category Filter */}
      <div className="relative group">
        <select
          className="appearance-none bg-gray-50 border-b-2 border-gray-200 rounded-t-md px-3 py-2 pr-8 font-mono text-xs focus:outline-none focus:border-maroon focus:bg-white cursor-pointer transition-colors"
          value={currentCategory || "all"}
          onChange={(e) => handleFilter(e.target.value, currentYear, currentAuthor)}
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
          onChange={(e) => handleFilter(currentCategory, e.target.value, currentAuthor)}
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
          onChange={(e) => handleFilter(currentCategory, currentYear, e.target.value)}
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
      {(currentCategory || currentYear || currentAuthor) && (
        <button
          onClick={() => handleFilter("all", "all", "all")}
          className="text-xs text-gray-500 hover:text-maroon flex items-center gap-1 font-medium ml-2"
        >
          <X className="w-3 h-3" />
          Clear All
        </button>
      )}
    </div>
  );
}
