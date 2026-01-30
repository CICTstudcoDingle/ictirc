import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button, Input, Badge } from "@ictirc/ui";

// Mock data - will be fetched from database
const papers = [
  {
    id: "1",
    title: "Machine Learning Approaches for Network Intrusion Detection",
    authors: "Juan Dela Cruz, Maria Santos",
    category: "Cybersecurity",
    status: "PUBLISHED",
    doi: "10.ISUFST.CICT/2024.00001",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Blockchain-based Academic Credential Verification",
    authors: "Pedro Garcia",
    category: "Blockchain",
    status: "PUBLISHED",
    doi: "10.ISUFST.CICT/2024.00002",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Natural Language Processing for Filipino Sentiment Analysis",
    authors: "Ana Reyes, Carlos Bautista, Lisa Mendoza",
    category: "NLP",
    status: "UNDER_REVIEW",
    doi: null,
    createdAt: "2024-01-25",
  },
  {
    id: "4",
    title: "Smart Agriculture: IoT-based Crop Monitoring System",
    authors: "Ricardo Villanueva",
    category: "IoT",
    status: "ACCEPTED",
    doi: null,
    createdAt: "2024-01-28",
  },
];

const statusMap = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  ACCEPTED: "accepted",
  PUBLISHED: "published",
  REJECTED: "rejected",
} as const;

export default function PapersPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
          <p className="text-gray-500">Manage research paper submissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Paper
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search papers..."
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paper
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                DOI
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {papers.map((paper) => (
              <tr key={paper.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/papers/${paper.id}`}
                    className="block"
                  >
                    <p className="font-medium text-gray-900 hover:text-maroon transition-colors line-clamp-1">
                      {paper.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {paper.authors}
                    </p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{paper.category}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge status={statusMap[paper.status as keyof typeof statusMap]}>
                    {paper.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {paper.doi ? (
                    <span className="font-mono text-xs text-gray-600">
                      {paper.doi}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{paper.createdAt}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
