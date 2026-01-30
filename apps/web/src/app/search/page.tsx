import { Search as SearchIcon } from "lucide-react";
import { Input, Button } from "@ictirc/ui";

export default function SearchPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Search Papers
          </h1>
          <p className="text-gray-600">
            Find research papers by title, author, keyword, or DOI.
          </p>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search for papers..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-maroon focus:outline-none text-lg"
              autoFocus
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              AI & Machine Learning
            </Button>
            <Button variant="secondary" size="sm">
              Cybersecurity
            </Button>
            <Button variant="secondary" size="sm">
              IoT
            </Button>
            <Button variant="secondary" size="sm">
              Blockchain
            </Button>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Popular Searches
          </h2>
          <div className="space-y-3">
            {[
              "Machine learning intrusion detection",
              "Natural language processing Filipino",
              "Smart agriculture IoT",
              "Blockchain credential verification",
            ].map((search) => (
              <button
                key={search}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{search}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
