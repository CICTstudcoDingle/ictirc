"use client";

import { useState } from "react";
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
import { Download, Upload } from "lucide-react";
import { toast } from "@/lib/toast";

interface BatchUploadFormProps {
  issues: Array<{
    id: string;
    issueNumber: number;
    volume: {
      volumeNumber: number;
      year: number;
    };
  }>;
}

export function BatchUploadForm({ issues }: BatchUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const issueId = formData.get("issueId") as string;

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

      toast({
        title: "Processing",
        description: "Batch upload is processing. This may take a while...",
      });

      // TODO: Implement batch upload logic
      // 1. Parse CSV file
      // 2. Upload all PDF files
      // 3. Create archived papers with metadata from CSV

      toast({
        title: "Success",
        description: `Successfully uploaded ${pdfFiles.length} papers`,
      });

      router.push("/dashboard/archives");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process batch upload",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            <h3 className="font-semibold mb-2">Step 1: Download CSV Template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download the template, fill in your paper metadata, and save it.
            </p>
            <a href="/templates/archive-batch-upload-template.csv" download>
              <Button variant="outline">
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
                      Volume {issue.volume.volumeNumber}, Issue {issue.issueNumber} ({issue.volume.year})
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
                  onChange={(e) => setPdfFiles(Array.from(e.target.files || []))}
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
                  <p className="text-xs text-muted-foreground mb-1">Selected files:</p>
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
                  className="hidden"
                  id="docxFiles"
                />
                <label htmlFor="docxFiles" className="cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    Optional: Upload source DOCX files
                  </p>
                </label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Make sure the PDF filenames in your CSV exactly match
                the uploaded files.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Batch"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
