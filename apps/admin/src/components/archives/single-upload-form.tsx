"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Loader2, Wand2, Plus, Trash2 } from "lucide-react";
import { extractPdfMetadata } from "@/lib/pdf-parser";

// Define Schema
const authorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  affiliation: z.string().optional(),
  isCorresponding: z.boolean().default(false),
});

const formSchema = z.object({
  issueId: z.string().min(1, "Issue is required"),
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  keywords: z.string().min(1, "Keywords are required"),
  categoryId: z.string().min(1, "Category is required"),
  pageStart: z.coerce.number().optional(),
  pageEnd: z.coerce.number().optional(),
  publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
  }),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
  pdfUrl: z.string().optional(),
  docxUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SingleUploadFormProps {
  userId: string;
  issues: Array<{
    id: string;
    issueNumber: number;
    volume: {
      volumeNumber: number;
      year: number;
    };
  }>;
}

export function SingleUploadForm({ issues, userId }: SingleUploadFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      keywords: "",
      publishedDate: new Date().toISOString().split('T')[0],
      authors: [{ name: "", email: "", affiliation: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  useEffect(() => {
    async function loadCategories() {
      const result = await listCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    }
    loadCategories();
  }, []);

  const handlePdfSelect = async (file: File) => {
    setPdfFile(file);

    // Autofill Logic
    if (file) {
      try {
        setIsProcessingPdf(true);
        const metadata = await extractPdfMetadata(file);

        if (metadata.title) form.setValue("title", metadata.title);
        if (metadata.abstract) form.setValue("abstract", metadata.abstract);

        if (metadata.keywords && metadata.keywords.length > 0) {
          form.setValue("keywords", metadata.keywords.join("; "));
        }

        if (metadata.authors && metadata.authors.length > 0) {
          // Replace current authors with extracted ones
          form.setValue("authors", metadata.authors.map(a => ({
            name: a.name,
            email: a.email || "",
            affiliation: a.affiliation || "",
            isCorresponding: false // defaulting to false, subsequent logic handles 1st author
          })));
        }

        toast({
          title: "PDF Metadata Extracted",
          description: "Form fields have been autofilled from the PDF.",
        });
      } catch (error) {
        console.error("Autofill error:", error);
        toast({
          title: "Autofill Warning",
          description: "Could not extract metadata automatically. Please fill fields manually.",
          variant: "default",
        });
      } finally {
        setIsProcessingPdf(false);
      }
    }
  };

  async function onSubmit(data: FormData) {
    setIsUploading(true);

    try {
      if (!pdfFile) {
        toast({ title: "Error", description: "PDF file is required", variant: "destructive" });
        setIsUploading(false);
        return;
      }

      // Upload PDF
      const timestamp = Date.now();
      const pdfPath = `papers/${timestamp}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const pdfUpload = await uploadFile(pdfFile, pdfPath, "archive");
      
      if (!pdfUpload.success || !pdfUpload.url) {
        throw new Error(`Failed to upload PDF: ${pdfUpload.error}`);
      }

      // Upload DOCX (Optional)
      let docxUrlStr = undefined;
      if (docxFile) {
        const docxPath = `papers/${timestamp}-${docxFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const docxUpload = await uploadFile(docxFile, docxPath, "archive");
        if (docxUpload.success) {
          docxUrlStr = docxUpload.url;
        }
      }

      // Prepare payload
      const payload = {
        issueId: data.issueId,
        categoryId: data.categoryId,
        title: data.title,
        abstract: data.abstract,
        keywords: data.keywords.split(/[;,]/).map(k => k.trim()).filter(Boolean),
        pageStart: data.pageStart,
        pageEnd: data.pageEnd,
        publishedDate: new Date(data.publishedDate),
        pdfUrl: pdfUpload.url,
        docxUrl: docxUrlStr,
        authors: data.authors.map((a, index) => ({
          ...a,
          order: index,
          // First author is corresponding by default logic for now, or add checkbox
          isCorresponding: index === 0
        }))
      };

      const result = await createArchivedPaper(payload, userId);

      if (result.success) {
        toast({ title: "Success", description: "Paper uploaded successfully" });
        router.push("/dashboard/archives");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create paper", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Paper Upload</CardTitle>
        <CardDescription>
          Upload a paper. PDF metadata will be autofilled when possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* File Upload Section - First because it drives autofill */}
            <div className="grid gap-6 md:grid-cols-2 p-4 bg-muted/20 rounded-lg">
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  PDF File *
                  {isProcessingPdf && <Loader2 className="h-3 w-3 animate-spin" />}
                </FormLabel>
                <FileUpload
                  accept=".pdf"
                  variant="file"
                  fileName={pdfFile?.name}
                  onFileSelect={handlePdfSelect}
                  onRemove={() => setPdfFile(null)}
                  label="Upload PDF"
                  description="Select the full paper PDF"
                />
              </div>
              <div className="space-y-2">
                <FormLabel>DOCX File (Optional)</FormLabel>
                <FileUpload
                  accept=".docx"
                  variant="file"
                  fileName={docxFile?.name}
                  onFileSelect={(f) => setDocxFile(f)}
                  onRemove={() => setDocxFile(null)}
                  label="Upload DOCX"
                  description="Source file for editing"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="issueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an issue">
                            {issues.find(i => i.id === field.value)
                              ? `Volume ${issues.find(i => i.id === field.value)?.volume.volumeNumber}, Issue ${issues.find(i => i.id === field.value)?.issueNumber} (${issues.find(i => i.id === field.value)?.volume.year})`
                              : "Select an Issue"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issues.map((issue) => (
                          <SelectItem key={issue.id} value={issue.id}>
                            Volume {issue.volume.volumeNumber}, Issue {issue.issueNumber} ({issue.volume.year})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category">
                            {categories.find(c => c.id === field.value)?.name || "Select Category"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Paper Title" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paper Abstract..." rows={5} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords *</FormLabel>
                  <FormControl>
                    <Input placeholder="AI; Machine Learning; Education" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Semi-colon separated</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Authors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Authors</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", email: "", affiliation: "", isCorresponding: false })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Author
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-12 items-start">
                      <div className="md:col-span-11 grid gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`authors.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`authors.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Optional" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`authors.${index}.affiliation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Affiliation</FormLabel>
                              <FormControl>
                                <Input placeholder="Institution" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end mt-8">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="pageStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Page</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pageEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Page</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Published Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={typeof field.value === 'string' ? field.value : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading} className="w-full md:w-auto min-w-[200px]">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Paper...
                  </>
                ) : (
                  "Upload Paper"
                )}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
