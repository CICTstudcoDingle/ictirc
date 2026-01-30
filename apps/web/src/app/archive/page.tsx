import type { Metadata } from "next";
import { Search, Filter, ChevronDown } from "lucide-react";
import { PaperCard } from "@/components/papers/paper-card";
import { Button, Input } from "@ictirc/ui";

export const metadata: Metadata = {
  title: "Research Archive",
  description:
    "Browse peer-reviewed ICT research papers from ICTIRC. Search by title, author, category, or keywords.",
};

// Mock data for demo - will be replaced with Prisma queries
const mockPapers = [
  {
    id: "1",
    title: "Machine Learning Approaches for Network Intrusion Detection in IoT Environments",
    abstract:
      "This paper presents a comprehensive study of machine learning techniques for detecting network intrusions in Internet of Things environments. We evaluate multiple algorithms including Random Forest, XGBoost, and deep learning models on benchmark datasets.",
    authors: [{ name: "Juan Dela Cruz" }, { name: "Maria Santos" }],
    category: "Cybersecurity",
    publishedAt: new Date("2024-06-15"),
    doi: "10.ISUFST.CICT/2024.00001",
    status: "PUBLISHED" as const,
  },
  {
    id: "2",
    title: "Blockchain-based Academic Credential Verification System",
    abstract:
      "We propose a decentralized system for verifying academic credentials using blockchain technology. The system ensures tamper-proof record keeping and instant verification for employers and educational institutions.",
    authors: [{ name: "Pedro Garcia" }],
    category: "Blockchain",
    publishedAt: new Date("2024-05-20"),
    doi: "10.ISUFST.CICT/2024.00002",
    status: "PUBLISHED" as const,
  },
  {
    id: "3",
    title: "Natural Language Processing for Filipino Sentiment Analysis on Social Media",
    abstract:
      "This research develops an NLP model specifically designed for sentiment analysis of Filipino text on social media platforms. We address challenges unique to the Filipino language including code-switching and regional variations.",
    authors: [{ name: "Ana Reyes" }, { name: "Carlos Bautista" }, { name: "Lisa Mendoza" }],
    category: "Natural Language Processing",
    status: "UNDER_REVIEW" as const,
  },
  {
    id: "4",
    title: "Smart Agriculture: IoT-based Crop Monitoring System for Philippine Farmers",
    abstract:
      "We design and implement a low-cost IoT solution for monitoring crop health and environmental conditions in Philippine agricultural settings. The system provides real-time alerts and recommendations via mobile application.",
    authors: [{ name: "Ricardo Villanueva" }],
    category: "Internet of Things",
    status: "ACCEPTED" as const,
  },
];

const categories = [
  "All Categories",
  "Artificial Intelligence",
  "Blockchain",
  "Cybersecurity",
  "Data Science",
  "Internet of Things",
  "Natural Language Processing",
  "Software Engineering",
];

export default function ArchivePage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Research Archive
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Browse peer-reviewed papers from ICTIRC researchers
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-200 py-4 md:py-6 sticky top-14 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search papers..."
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select className="w-full md:w-auto appearance-none bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 pr-10 font-mono text-sm focus:outline-none focus:border-maroon focus:bg-white cursor-pointer">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
        </div>
      </section>

      {/* Results */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4 md:mb-6">
            Showing <span className="font-medium text-gray-900">4</span> papers
          </p>

          {/* Paper Grid - 1 column on mobile, 2 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {mockPapers.map((paper) => (
              <PaperCard key={paper.id} {...paper} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" size="sm" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-maroon text-white rounded-md text-sm font-medium">
                1
              </span>
              <Button variant="ghost" size="sm">
                2
              </Button>
              <Button variant="ghost" size="sm">
                3
              </Button>
              <Button variant="ghost" size="sm">
                Next
              </Button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
