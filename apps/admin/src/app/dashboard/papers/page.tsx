"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Eye, Trash2, ExternalLink, Archive,
  BookOpen, FileText, Edit2, ChevronDown, Filter, X,
} from "lucide-react";
import { Button, Input, Badge } from "@ictirc/ui";
import { useToastActions } from "@/lib/toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
  email: string;
}

interface IssueInfo {
  id: string;
  issueNumber: number;
  volume: { id: string; volumeNumber: number; year: number } | null;
  conference: { id: string; name: string } | null;
}

interface UnifiedPaper {
  id: string;
  title: string;
  abstract: string;
  status: string;
  doi: string | null;
  rawFileUrl: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  publishedAt: string | null;
  pageStart?: number | null;
  pageEnd?: number | null;
  category: { id: string; name: string } | null;
  issue?: IssueInfo | null;
  authors: Array<{ author: Author; order: number; affiliation?: string | null }>;
  uploader?: { name: string | null; email: string } | null;
  uploadedAt?: string | null;
  // Discriminator
  _source?: "archived" | "current";
  _archivedPaperId?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  PUBLISHED: "bg-purple-100 text-purple-700",
  ARCHIVED: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
};

const CURRENT_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "PUBLISHED", "REJECTED"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PapersPage() {
  const toast = useToastActions();

  // Data
  const [papers, setPapers] = useState<UnifiedPaper[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<"all" | "current" | "archived">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Edit modal state
  const [editingPaper, setEditingPaper] = useState<UnifiedPaper | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFields, setEditFields] = useState<{
    title: string;
    abstract: string;
    doi: string;
    status: string;
    publishedAt: string;
  }>({ title: "", abstract: "", doi: "", status: "", publishedAt: "" });

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("type", activeTab);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/papers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPapers(data.papers || []);
      }
    } catch {
      toast.error("Error", "Failed to load papers");
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, categoryFilter, searchTerm, toast]);

  useEffect(() => {
    const t = setTimeout(() => fetchPapers(), 300);
    return () => clearTimeout(t);
  }, [fetchPapers]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  async function handleStatusChange(paper: UnifiedPaper, newStatus: string) {
    const isArchived = paper._source === "archived";
    if (isArchived) {
      toast.warning("Notice", "Archived papers cannot change status");
      return;
    }
    try {
      const res = await fetch("/api/papers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paper.id, status: newStatus }),
      });
      if (res.ok) {
        toast.success("Status Updated", "Paper status has been changed");
        fetchPapers();
      } else {
        toast.error("Error", "Failed to update status");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred");
    }
  }

  async function handleDelete(paper: UnifiedPaper) {
    const label = paper._source === "archived" ? "archived paper" : "paper";
    if (!confirm(`Are you sure you want to delete this ${label}?\n"${paper.title}"`)) return;

    try {
      const url =
        paper._source === "archived"
          ? `/api/papers?id=${paper.id}&source=archived`
          : `/api/papers?id=${paper.id}`;

      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted", `"${paper.title}" has been removed`);
        fetchPapers();
      } else {
        toast.error("Error", "Failed to delete paper");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred");
    }
  }

  function openEdit(paper: UnifiedPaper) {
    setEditingPaper(paper);
    setEditFields({
      title: paper.title,
      abstract: paper.abstract,
      doi: paper.doi ?? "",
      status: paper.status,
      publishedAt: paper.publishedAt
        ? new Date(paper.publishedAt).toISOString().split("T")[0]
        : "",
    });
  }

  async function saveEdit() {
    if (!editingPaper) return;
    setEditLoading(true);
    try {
      const payload: any = {
        id: editingPaper.id,
        doi: editFields.doi || null,
      };

      if (editingPaper._source === "archived") {
        payload._source = "archived";
        payload.title = editFields.title;
        payload.abstract = editFields.abstract;
        if (editFields.publishedAt) {
          payload.publishedDate = editFields.publishedAt;
        }
      } else {
        payload.status = editFields.status;
        payload.title = editFields.title;
        payload.abstract = editFields.abstract;
      }

      const res = await fetch("/api/papers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Saved", "Paper updated successfully");
        setEditingPaper(null);
        fetchPapers();
      } else {
        toast.error("Error", "Failed to update paper");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred");
    } finally {
      setEditLoading(false);
    }
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const displayedPapers = papers; // filtering already applied via API

  const stats = {
    total: papers.length,
    current: papers.filter((p) => !p._source || p._source === "current").length,
    archived: papers.filter((p) => p._source === "archived").length,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
          <p className="text-gray-500 mt-0.5">
            Manage research paper submissions and archived publications
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/archives/upload">
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Upload Archive
            </Button>
          </Link>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Submission
          </Button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Papers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Submissions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.current}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Archived</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.archived}</p>
        </div>
      </div>

      {/* ─── Tabs + Filters ─── */}
      <div className="space-y-3">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["all", "current", "archived"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setStatusFilter("all"); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab === "all" ? "All Papers" : tab === "current" ? "Submissions" : "Archived"}
            </button>
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search papers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter - only for current/all */}
          {activeTab !== "archived" && (
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-maroon focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                {CURRENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Clear filters */}
          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("all"); setCategoryFilter("all"); }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-maroon border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500">Loading papers...</p>
          </div>
        ) : displayedPapers.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {searchTerm || statusFilter !== "all"
                ? "No papers found matching your filters"
                : activeTab === "archived"
                  ? "No archived papers yet"
                  : "No papers submitted yet"}
            </p>
            {activeTab === "archived" && !searchTerm && (
              <Link href="/dashboard/archives/upload" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4 mr-2" />
                  Upload Archived Papers
                </Button>
              </Link>
            )}
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
                      Issue / Volume
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DOI
                </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="w-28 text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedPapers.map((paper) => {
                    const isArchived = paper._source === "archived";
                    const authorNames = paper.authors
                      .map((a) => a.author.name)
                      .join(", ");
                    const issueLabel =
                      paper.issue
                        ? `Vol.${paper.issue.volume?.volumeNumber ?? "?"} No.${paper.issue.issueNumber}${paper.issue.volume?.year ? ` (${paper.issue.volume.year})` : ""
                        }`
                        : null;

                    return (
                  <tr
                    key={`${isArchived ? "arch-" : ""}${paper.id}`}
                    className={`hover:bg-gray-50 ${isArchived ? "bg-orange-50/30" : ""}`}
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        {isArchived ? (
                          <BookOpen className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1 text-sm">
                            {paper.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {authorNames}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {paper.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isArchived ? (
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS.ARCHIVED}`}
                        >
                          <Archive className="w-3 h-3" />
                          ARCHIVED
                        </span>
                      ) : (
                          <select
                            value={paper.status}
                            onChange={(e) => handleStatusChange(paper, e.target.value)}
                            aria-label="Change paper status"
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[paper.status] ?? "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {CURRENT_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {issueLabel ? (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {issueLabel}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
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
                      <span className="text-xs text-gray-500">
                        {isArchived && paper.publishedAt
                          ? new Date(paper.publishedAt).toLocaleDateString()
                          : new Date(paper.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        {isArchived ? (
                          <Link
                            href={`/dashboard/archives/papers/${paper.id}`}
                            className="p-1.5 hover:bg-orange-50 text-orange-600 rounded transition-colors"
                            title="View archived paper"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            href={`/dashboard/papers/${paper.id}`}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                            title="Review paper"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(paper)}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded transition-colors"
                          title="Edit paper"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Delete */}
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

      {/* ─── Edit Modal ─── */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPaper._source === "archived" ? "Edit Archived Paper" : "Edit Paper"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {editingPaper.title}
                </p>
              </div>
              <button
                onClick={() => setEditingPaper(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={editFields.title}
                  onChange={(e) => setEditFields((f) => ({ ...f, title: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abstract
                </label>
                <textarea
                  value={editFields.abstract}
                  onChange={(e) => setEditFields((f) => ({ ...f, abstract: e.target.value }))}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon focus:border-transparent resize-y"
                />
              </div>

              {/* DOI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DOI (optional)
                </label>
                <Input
                  value={editFields.doi}
                  onChange={(e) => setEditFields((f) => ({ ...f, doi: e.target.value }))}
                  placeholder="e.g. 10.1234/ictirc.v1.123"
                  className="w-full font-mono text-sm"
                />
              </div>

              {/* Status (for current papers) */}
              {editingPaper._source !== "archived" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editFields.status}
                    onChange={(e) => setEditFields((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon focus:border-transparent"
                  >
                    {CURRENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Published Date (for archived) */}
              {editingPaper._source === "archived" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Published Date
                  </label>
                  <Input
                    type="date"
                    value={editFields.publishedAt}
                    onChange={(e) => setEditFields((f) => ({ ...f, publishedAt: e.target.value }))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Metadata display */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Category:</span>{" "}
                  {editingPaper.category?.name ?? "—"}
                </p>
                {editingPaper.issue && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Issue:</span>{" "}
                    Vol.{editingPaper.issue.volume?.volumeNumber} No.
                    {editingPaper.issue.issueNumber}
                    {editingPaper.issue.volume?.year
                      ? ` (${editingPaper.issue.volume.year})`
                      : ""}
                  </p>
                )}
                {editingPaper._source === "archived" && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Source:</span> Archived Paper
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => setEditingPaper(null)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button onClick={saveEdit} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
