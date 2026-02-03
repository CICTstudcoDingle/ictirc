"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
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
import { issueSchema } from "@/lib/validations/archive";
import { createIssue, updateIssue } from "@/lib/actions/issue";
import { listVolumes } from "@/lib/actions/volume";
import { listConferences } from "@/lib/actions/conference";
import { toast } from "@/lib/toast";
import { useUpload } from "@/hooks/use-upload";

const formSchema = issueSchema.extend({
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  conferenceId: z.string().cuid().optional().or(z.literal("")),
  publishedDate: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]),
});

type FormData = z.infer<typeof formSchema>;

interface IssueFormProps {
  issue?: {
    id: string;
    issueNumber: number;
    month?: string | null;
    publishedDate: Date;
    issn?: string | null;
    theme?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    volumeId: string;
    conferenceId?: string | null;
  };
}

export function IssueForm({ issue }: IssueFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverUpload = useUpload({ folder: "issues/covers" });
  const [volumes, setVolumes] = useState<any[]>([]);
  const [conferences, setConferences] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [volumesResult, conferencesResult] = await Promise.all([
        listVolumes(),
        listConferences(),
      ]);
      console.log('Volumes result:', volumesResult);
      console.log('Conferences result:', conferencesResult);
      if (volumesResult.success && volumesResult.data) {
        setVolumes(volumesResult.data);
      }
      if (conferencesResult.success && conferencesResult.data) {
        setConferences(conferencesResult.data);
      }
    }
    loadData();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueNumber: issue?.issueNumber || 1,
      month: issue?.month || "",
      publishedDate: (issue?.publishedDate ? new Date(issue.publishedDate) : new Date()).toISOString().split('T')[0] as any,
      issn: issue?.issn || "",
      theme: issue?.theme || "",
      description: issue?.description || "",
      coverImageUrl: issue?.coverImageUrl || "",
      volumeId: issue?.volumeId || "",
      conferenceId: issue?.conferenceId || "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const result = issue
        ? await updateIssue(issue.id, data)
        : await createIssue(data);

      if (result.success) {
        toast({
          title: issue ? "Issue updated" : "Issue created",
          description: `Issue ${data.issueNumber} has been ${issue ? "updated" : "created"} successfully.`,
        });
        router.push("/dashboard/archives/issues");
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
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="volumeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value as string || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a volume">
                        {volumes.find(v => v.id === field.value)
                          ? `Volume ${volumes.find(v => v.id === field.value)?.volumeNumber} (${volumes.find(v => v.id === field.value)?.year})`
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {volumes.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        Volume {v.volumeNumber} ({v.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The parent volume for this issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issueNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    The sequential issue number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., April" {...field} value={field.value as string || ""} />
                  </FormControl>
                  <FormDescription>Publication month</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || "")}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Official publication date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISSN</FormLabel>
                <FormControl>
                  <Input placeholder="Format: XXXX-XXXX" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>International Standard Serial Number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="conferenceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conference (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value as string || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a conference">
                      {field.value && field.value !== "none"
                        ? conferences.find(c => c.id === field.value)?.name
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {conferences.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Link this issue to a conference
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Input placeholder="Theme or focus of this issue" {...field} value={field.value as string || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this issue"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value as string || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image (Optional)</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value || ""}
                  onFileSelect={async (file) => {
                    const url = await coverUpload.uploadFile(file);
                    if (url) field.onChange(url);
                  }}
                  onRemove={() => field.onChange("")}
                  isUploading={coverUpload.isUploading}
                  progress={coverUpload.progress}
                  variant="image"
                  description="Upload a cover image for this issue"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : issue ? "Update Issue" : "Create Issue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
