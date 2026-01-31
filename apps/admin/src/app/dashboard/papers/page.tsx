"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button, Input, Badge } from "@ictirc/ui";
import { useToastActions } from "@/lib/toast";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Paper {
  id: string;
  title: string;
  abstract: string;
  status: string;
  doi: string | null;
  rawFileUrl: string | null;
  createdAt: string;
  publishedAt: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  authors: Array<{
    author: Author;
    order: number;
  }>;
}

const statusColors = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  PUBLISHED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-red-100 text-red-700",
} as const;

export default function PapersPage() {
  const toast = useToastActions();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPapers();
  }, []);

  async function fetchPapers() {
    setLoading(true);
    try {
      const response = await fetch("/api/papers");
      if (response.ok) {
        const data = await response.json();
        setPapers(data.papers || []);
      }
    } catch (error) {
      console.error("Failed to fetch papers:", error);
      toast.error("Error", "Failed to load papers");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(paperId: string, newStatus: string) {
    try {
      const response = await fetch("/api/papers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paperId, status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status Updated", "Paper status has been changed");
        fetchPapers();
      } else {
        toast.error("Error", "Failed to update status");
      }
    } catch (error) {
      toast.error("Error", "An unexpected error occurred");
    }
  }

  async function handleDelete(paper: Paper) {
    if (!confirm(`Are you sure you want to delete "${paper.title}"?`)) return;

    try {
      const response = await fetch(`/api/papers?id=${paper.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Paper Deleted", `"${paper.title}" has been removed`);
        fetchPapers();
      } else {
        toast.error("Error", "Failed to delete paper");
      }
    } catch (error) {
      toast.error("Error", "An unexpected error occurred");
    }
  }

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading papers...</div>
        ) : filteredPapers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "No papers found matching your search" : "No papers submitted yet"}
          </div>
        ) : (
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
              <th className="w-32 text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPapers.map((paper) => {
              const authorNames = paper.authors.map(a => a.author.name).join(", ");
              return (
                <tr key={paper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {paper.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                        {authorNames}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {paper.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={paper.status}
                      onChange={(e) => handleStatusChange(paper.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${statusColors[paper.status as keyof typeof statusColors]}`}
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="UNDER_REVIEW">UNDER REVIEW</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {paper.doi ? (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {paper.doi}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/papers/${paper.id}`}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Review paper"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(paper)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Delete paper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
