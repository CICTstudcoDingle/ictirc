"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@ictirc/ui";
import { Save, Plus, Trash2 } from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string | null;
  affiliation: string | null;
  order: number;
  isCorresponding: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface IssueOption {
  id: string;
  issueNumber: number;
  volume: { volumeNumber: number; year: number } | null;
}

interface Props {
  paper: {
    id: string;
    title: string;
    abstract: string;
    keywords: string[];
    doi: string | null;
    pdfUrl: string;
    docxUrl: string | null;
    pageStart: number | null;
    pageEnd: number | null;
    publishedDate: Date;
    submittedDate: Date | null;
    acceptedDate: Date | null;
    categoryId: string;
    issueId: string;
    authors: Author[];
  };
  categories: Category[];
  issues: IssueOption[];
}

export function EditArchivedPaperForm({ paper, categories, issues }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [fields, setFields] = useState({
    title: paper.title,
    abstract: paper.abstract,
    keywords: paper.keywords.join(", "),
    doi: paper.doi ?? "",
    pdfUrl: paper.pdfUrl,
    docxUrl: paper.docxUrl ?? "",
    pageStart: paper.pageStart?.toString() ?? "",
    pageEnd: paper.pageEnd?.toString() ?? "",
    publishedDate: paper.publishedDate
      ? new Date(paper.publishedDate).toISOString().split("T")[0]
      : "",
    categoryId: paper.categoryId,
    issueId: paper.issueId,
  });

  const [authors, setAuthors] = useState<Author[]>(paper.authors);

  function updateField<K extends keyof typeof fields>(key: K, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
  }

  function updateAuthor(index: number, key: keyof Author, value: any) {
    setAuthors((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [key]: value } : a))
    );
  }

  function addAuthor() {
    setAuthors((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: "",
        email: null,
        affiliation: null,
        order: prev.length,
        isCorresponding: false,
      },
    ]);
  }

  function removeAuthor(index: number) {
    setAuthors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      const payload = {
        id: paper.id,
        _source: "archived",
        title: fields.title,
        abstract: fields.abstract,
        keywords: fields.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        doi: fields.doi || null,
        pdfUrl: fields.pdfUrl,
        docxUrl: fields.docxUrl || null,
        pageStart: fields.pageStart ? parseInt(fields.pageStart) : null,
        pageEnd: fields.pageEnd ? parseInt(fields.pageEnd) : null,
        publishedDate: fields.publishedDate,
        categoryId: fields.categoryId,
        issueId: fields.issueId,
        // Authors update via separate action
      };

      const res = await fetch("/api/papers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Also update authors via dedicated API
        await fetch(`/api/archived-papers/${paper.id}/authors`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authors: authors.map((a, i) => ({
              name: a.name,
              email: a.email || null,
              affiliation: a.affiliation || null,
              order: i,
              isCorresponding: a.isCorresponding,
            })),
          }),
        });

        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(`Failed to save: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      alert("An unexpected error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Basic fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <Input
            value={fields.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={fields.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Issue *</label>
          <select
            value={fields.issueId}
            onChange={(e) => updateField("issueId", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon focus:border-transparent"
          >
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                Vol.{issue.volume?.volumeNumber} No.{issue.issueNumber}
                {issue.volume?.year ? ` (${issue.volume.year})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Published Date *</label>
          <Input
            type="date"
            value={fields.publishedDate}
            onChange={(e) => updateField("publishedDate", e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">DOI</label>
          <Input
            value={fields.doi}
            onChange={(e) => updateField("doi", e.target.value)}
            placeholder="10.1234/ictirc.v1.123"
            className="w-full font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Page Start</label>
          <Input
            type="number"
            value={fields.pageStart}
            onChange={(e) => updateField("pageStart", e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Page End</label>
          <Input
            type="number"
            value={fields.pageEnd}
            onChange={(e) => updateField("pageEnd", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Keywords (comma-separated)
          </label>
          <Input
            value={fields.keywords}
            onChange={(e) => updateField("keywords", e.target.value)}
            placeholder="machine learning, IoT, data science"
            className="w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">PDF URL *</label>
          <Input
            value={fields.pdfUrl}
            onChange={(e) => updateField("pdfUrl", e.target.value)}
            className="w-full font-mono text-sm"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">DOCX URL</label>
          <Input
            value={fields.docxUrl}
            onChange={(e) => updateField("docxUrl", e.target.value)}
            className="w-full font-mono text-sm"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Abstract *</label>
          <textarea
            value={fields.abstract}
            onChange={(e) => updateField("abstract", e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon focus:border-transparent resize-y"
          />
        </div>
      </div>

      {/* Authors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-gray-700">
            Authors ({authors.length})
          </label>
          <Button variant="outline" size="sm" onClick={addAuthor}>
            <Plus className="w-3 h-3 mr-1" />
            Add Author
          </Button>
        </div>
        <div className="space-y-3">
          {authors.map((author, i) => (
            <div
              key={author.id}
              className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Author #{i + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={author.isCorresponding}
                      onChange={(e) => updateAuthor(i, "isCorresponding", e.target.checked)}
                      className="rounded"
                    />
                    Corresponding
                  </label>
                  <button
                    onClick={() => removeAuthor(i)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Remove author"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Full name *"
                  value={author.name}
                  onChange={(e) => updateAuthor(i, "name", e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Email (optional)"
                  value={author.email ?? ""}
                  onChange={(e) => updateAuthor(i, "email", e.target.value || null)}
                  className="text-sm"
                />
                <div className="col-span-2">
                  <Input
                    placeholder="Affiliation (optional)"
                    value={author.affiliation ?? ""}
                    onChange={(e) => updateAuthor(i, "affiliation", e.target.value || null)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between pt-2">
        {success && (
          <span className="text-sm text-green-600 font-medium">
            ✓ Changes saved successfully
          </span>
        )}
        {!success && <span />}
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
