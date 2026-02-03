"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FileUpload,
} from "@ictirc/ui";
import { toast } from "@/lib/toast";
import { createArchivedPaper } from "@/lib/actions/archived-paper";
import { listCategories } from "@/lib/actions/category";
import { uploadFile } from "@ictirc/storage";

interface SingleUploadFormProps {
  issues: Array<{
    id: string;
    issueNumber: number;
    volume: {
      volumeNumber: number;
      year: number;
    };
  }>;
}

export function SingleUploadForm({ issues }: SingleUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await listCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (!pdfFile) {
        toast({
          title: "Error",
          description: "PDF file is required",
          variant: "destructive",
        });
        return;
      }

      // Generate unique filenames with subfolder structure
      const timestamp = Date.now();
      const pdfPath = `papers/${timestamp}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      
      // Upload files to archive bucket
      const pdfUrl = await uploadFile(pdfFile, pdfPath, "archive");
      
      if (!pdfUrl.success) {
        toast({
          title: "Error",
          description: `Failed to upload PDF: ${pdfUrl.error}`,
          variant: "destructive",
        });
        return;
      }

      let docxUrl;
      if (docxFile) {
        const docxPath = `papers/${timestamp}-${docxFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        docxUrl = await uploadFile(docxFile, docxPath, "archive");
        
        if (!docxUrl.success) {
          toast({
            title: "Warning",
            description: `Failed to upload DOCX: ${docxUrl.error}`,
            variant: "default",
          });
          // Continue anyway since DOCX is optional
        }
      }

      // Parse authors
      const authorsData = [];
      for (let i = 1; i <= 5; i++) {
        const name = formData.get(`author_${i}_name`) as string;
        if (name) {
          authorsData.push({
            name,
            email: (formData.get(`author_${i}_email`) as string) || undefined,
            affiliation: (formData.get(`author_${i}_affiliation`) as string) || undefined,
            order: i - 1,
            isCorresponding: i === 1,
          });
        }
      }

      // Create paper
      const paperData = {
        title: formData.get("title") as string,
        abstract: formData.get("abstract") as string,
        keywords: (formData.get("keywords") as string).split(";").map((k) => k.trim()),
        categoryId: formData.get("categoryId") as string,
        issueId: formData.get("issueId") as string,
        publishedDate: new Date(formData.get("publishedDate") as string),
        pageStart: parseInt(formData.get("pageStart") as string) || undefined,
        pageEnd: parseInt(formData.get("pageEnd") as string) || undefined,
        pdfUrl: pdfUrl.url || "",
        docxUrl: docxUrl?.url,
        authors: authorsData,
      };

      // Get current user ID (you'll need to implement this based on your auth)
      const userId = "current-user-id"; // TODO: Get from auth context

      const result = await createArchivedPaper(paperData, userId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Paper uploaded successfully",
        });
        router.push("/dashboard/archives");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload paper",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Paper Upload</CardTitle>
        <CardDescription>
          Upload a single paper with metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Selection */}
          <div className="space-y-2">
            <Label htmlFor="issueId">Issue *</Label>
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

          {/* Paper Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input name="title" required placeholder="Paper title" />
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea name="abstract" required placeholder="Abstract" rows={5} />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords *</Label>
            <Input name="keywords" required placeholder="keyword1;keyword2;keyword3" />
            <p className="text-sm text-muted-foreground">Separate keywords with semicolons</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select name="categoryId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No categories available. Please create categories first.
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Page Numbers */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pageStart">Start Page</Label>
              <Input name="pageStart" type="number" placeholder="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageEnd">End Page</Label>
              <Input name="pageEnd" type="number" placeholder="10" />
            </div>
          </div>

          {/* Published Date */}
          <div className="space-y-2">
            <Label htmlFor="publishedDate">Published Date *</Label>
            <Input name="publishedDate" type="date" required />
          </div>

          {/* Authors */}
          <div className="space-y-4">
            <h3 className="font-semibold">Authors</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid gap-4 md:grid-cols-3 p-4 border rounded">
                <div className="space-y-2">
                  <Label htmlFor={`author_${i}_name`}>
                    Author {i} Name {i === 1 ? "*" : ""}
                  </Label>
                  <Input
                    name={`author_${i}_name`}
                    required={i === 1}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`author_${i}_email`}>Email</Label>
                  <Input
                    name={`author_${i}_email`}
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`author_${i}_affiliation`}>Affiliation</Label>
                  <Input
                    name={`author_${i}_affiliation`}
                    placeholder="Institution"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>PDF File *</Label>
              <FileUpload
                accept=".pdf"
                onFileSelect={(file) => setPdfFile(file)}
              />
            </div>
            <div className="space-y-2">
              <Label>DOCX File (Optional)</Label>
              <FileUpload
                accept=".docx"
                onFileSelect={(file) => setDocxFile(file)}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Paper"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
