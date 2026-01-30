"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Input, Button } from "@ictirc/ui";
import { useState, useEffect, useTransition } from "react";

interface ArchiveFiltersProps {
  categories: { id: string; name: string }[];
}

export function ArchiveFilters({ categories }: ArchiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(currentQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQuery) {
        handleSearch(query, currentCategory);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentCategory]);

  const handleSearch = (q: string, category: string) => {
    const params = new URLSearchParams(searchParams);
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    // Reset page on filter change
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search papers..."
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

      {/* Category Filter */}
      <div className="relative">
        <select
          className="w-full md:w-auto appearance-none bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 pr-10 font-mono text-sm focus:outline-none focus:border-maroon focus:bg-white cursor-pointer transition-colors"
          value={currentCategory || "all"}
          onChange={(e) => handleSearch(query, e.target.value)}
          disabled={isPending}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Filter Button - hidden on mobile */}
      <Button variant="secondary" size="md" className="hidden md:flex">
        <Filter className="w-4 h-4" />
        Filters
      </Button>
    </div>
  );
}
