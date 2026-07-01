"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ictirc/ui";
import { Download, Upload, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";
import { uploadFile } from "@ictirc/storage";
import { batchCreateArchivedPapers } from "@/lib/actions/archived-paper";
import { listCategories } from "@/lib/actions/category";
import type { ArchivedPaperInput } from "@/lib/validations/archive";

interface BatchUploadFormProps {
  issues: Array<{
    id: string;
    issueNumber: number;
    publishedDate: Date;
    volume: {
      volumeNumber: number;
      year: number;
    };
  }>;
}

interface RowError {
  title: string;
  error: string;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === "\n" || char === "\r") {
        if (current.length > 0 || lines.length > 0) {
          lines.push(current);
          current = "";
        }
        if (char === "\r" && next === "\n") i++;
      } else if (char === ",") {
        current += "\0"; // field separator
      } else {
        current += char;
      }
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  if (lines.length < 2) return [];

  const headers = lines[0].split("\0").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split("\0");
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || "").trim();
    });
    return row;
  });
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export function BatchUploadForm({ issues }: BatchUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [docxFiles, setDocxFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [errors, setErrors] = useState<RowError[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await listCategories();
      if (result.success && result.data) {
        setCategories(
          result.data.map((c: any) => ({ id: c.id, name: c.name })),
        );
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const issueId = formData.get("issueId") as string;
    const issue = issues.find((i) => i.id === issueId);

    if (!issueId || !issue) {
      toast({
        title: "Error",
        description: "Please select a target issue",
        variant: "destructive",
      });
      return;
    }

    if (!csvFile) {
      toast({
        title: "Error",
        description: "CSV file is required",
        variant: "destructive",
      });
      return;
    }

    if (pdfFiles.length === 0) {
      toast({
        title: "Error",
        description: "At least one PDF file is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const text = await csvFile.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast({
          title: "Error",
          description: "CSV file appears to be empty",
          variant: "destructive",
        });
        return;
      }

      const papers: ArchivedPaperInput[] = [];
      const rowErrors: RowError[] = [];

      setProgress({ current: 0, total: rows.length });

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setProgress({ current: i + 1, total: rows.length });

        const title = row.title;
        if (!title) {
          rowErrors.push({ title: `Row ${i + 1}`, error: "Missing title" });
          continue;
        }

        const categoryName = row.category;
        const category = categories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
        );

        if (!category) {
          rowErrors.push({
            title,
            error: `Category not found: "${categoryName}"`,
          });
          continue;
        }

        const pdfFile = pdfFiles.find((f) => f.name === row.pdf_filename);
        if (!pdfFile) {
          rowErrors.push({
            title,
            error: `PDF file not found: "${row.pdf_filename}"`,
          });
          continue;
        }

        const pdfPath = `papers/${Date.now()}-${sanitizeFileName(pdfFile.name)}`;
        const pdfUpload = await uploadFile(pdfFile, pdfPath, "archive");
        if (!pdfUpload.success || !pdfUpload.url) {
          rowErrors.push({
            title,
            error: `Failed to upload PDF: ${pdfUpload.error || "unknown"}`,
          });
          continue;
        }

        let docxUrl: string | undefined;
        if (row.docx_filename) {
          const docxFile = docxFiles.find((f) => f.name === row.docx_filename);
          if (!docxFile) {
            rowErrors.push({
              title,
              error: `DOCX file not found: "${row.docx_filename}"`,
            });
            continue;
          }
          const docxPath = `papers/${Date.now()}-${sanitizeFileName(docxFile.name)}`;
          const docxUpload = await uploadFile(docxFile, docxPath, "archive");
          if (docxUpload.success && docxUpload.url) {
            docxUrl = docxUpload.url;
          }
        }

        const authors = [];
        for (let a = 1; a <= 5; a++) {
          const name = row[`author_${a}_name`];
          if (name) {
            authors.push({
              name,
              email: row[`author_${a}_email`] || undefined,
              affiliation: row[`author_${a}_affiliation`] || undefined,
              order: a - 1,
              isCorresponding: a === 1,
            });
          }
        }

        if (authors.length === 0) {
          rowErrors.push({ title, error: "No authors provided" });
          continue;
        }

        const keywords = row.keywords
          .split(";")
          .map((k) => k.trim())
          .filter(Boolean);

        const pageStart = row.page_start
          ? parseInt(row.page_start, 10)
          : undefined;
        const pageEnd = row.page_end ? parseInt(row.page_end, 10) : undefined;

        papers.push({
          title,
          abstract: row.abstract,
          keywords,
          doi: row.doi || undefined,
          categoryId: category.id,
          issueId,
          publishedDate: issue.publishedDate || new Date(),
          submittedDate: row.submitted_date
            ? new Date(row.submitted_date)
            : undefined,
          acceptedDate: row.accepted_date
            ? new Date(row.accepted_date)
            : undefined,
          pageStart: pageStart && !isNaN(pageStart) ? pageStart : undefined,
          pageEnd: pageEnd && !isNaN(pageEnd) ? pageEnd : undefined,
          pdfUrl: pdfUpload.url,
          docxUrl,
          authors,
        });
      }

      if (papers.length === 0) {
        setErrors(rowErrors);
        toast({
          title: "Upload failed",
          description: "No valid papers could be processed. See errors below.",
          variant: "destructive",
        });
        return;
      }

      const result = await batchCreateArchivedPapers(papers);
      const serverErrors: RowError[] = (result.errors || []).map((e: any) => ({
        title: e.title || "Unknown",
        error: e.error || "Unknown error",
      }));
      const allErrors = [...rowErrors, ...serverErrors];
      setErrors(allErrors);

      if (result.success && allErrors.length === 0) {
        toast({
          title: "Success",
          description: `${papers.length} paper${papers.length === 1 ? "" : "s"} uploaded successfully`,
        });
        router.push("/dashboard/archives/papers");
        router.refresh();
      } else {
        const successCount = result.data?.length || 0;
        toast({
          title: "Batch upload completed with errors",
          description: `${successCount} saved, ${allErrors.length} failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process batch upload",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setProgress(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Paper Upload</CardTitle>
        <CardDescription>
          Upload multiple papers using a CSV file for metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Step 1: Download CSV Template
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download the template, fill in your paper metadata, and save it.
            </p>
            <a href="/templates/archive-batch-upload-template.csv" download>
              <Button variant="outline" type="button">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Selection */}
            <div className="space-y-2">
              <Label htmlFor="issueId">Target Issue *</Label>
              <Select name="issueId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an issue" />
                </SelectTrigger>
                <SelectContent>
                  {issues.map((issue) => (
                    <SelectItem key={issue.id} value={issue.id}>
                      Volume {issue.volume.volumeNumber}, Issue{" "}
                      {issue.issueNumber} ({issue.volume.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CSV Upload */}
            <div className="space-y-2">
              <Label htmlFor="csvFile">Metadata CSV File *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csvFile"
                />
                <label htmlFor="csvFile" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {csvFile ? csvFile.name : "Click to upload CSV file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV file with paper metadata
                  </p>
                </label>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdfFiles">PDF Files *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setPdfFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                  id="pdfFiles"
                />
                <label htmlFor="pdfFiles" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {pdfFiles.length > 0
                      ? `${pdfFiles.length} file(s) selected`
                      : "Click to upload PDF files"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select all PDF files referenced in the CSV
                  </p>
                </label>
              </div>
              {pdfFiles.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-1">
                    Selected files:
                  </p>
                  <ul className="text-xs space-y-1">
                    {pdfFiles.map((file, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* DOCX Upload (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="docxFiles">DOCX Files (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".docx"
                  multiple
                  onChange={(e) =>
                    setDocxFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                  id="docxFiles"
                />
                <label htmlFor="docxFiles" className="cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    {docxFiles.length > 0
                      ? `${docxFiles.length} file(s) selected`
                      : "Optional: Upload source DOCX files"}
                  </p>
                </label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Make sure the PDF filenames in your
                CSV exactly match the uploaded files.
              </p>
            </div>

            {progress && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing row {progress.current} of {progress.total}...
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Batch
                </>
              )}
            </Button>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-semibold text-red-800">
                    {errors.length} error{errors.length === 1 ? "" : "s"}
                  </h4>
                </div>
                <ul className="text-xs text-red-700 space-y-1 max-h-48 overflow-y-auto">
                  {errors.map((err, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{err.title}:</span>{" "}
                      {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
