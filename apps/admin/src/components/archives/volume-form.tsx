"use client";

import { useState } from "react";
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
  FileUpload,
} from "@ictirc/ui";
import { volumeSchema } from "@/lib/validations/archive";
import { createVolume, updateVolume } from "@/lib/actions/volume";
import { toast } from "@/lib/toast";
import { useUpload } from "@/hooks/use-upload";

const formSchema = volumeSchema.extend({
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface VolumeFormProps {
  volume?: {
    id: string;
    volumeNumber: number;
    year: number;
    description?: string | null;
    coverImageUrl?: string | null;
  };
}

export function VolumeForm({ volume }: VolumeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverUpload = useUpload({ folder: "volumes/covers" });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumeNumber: volume?.volumeNumber || new Date().getFullYear() - 2021,
      year: volume?.year || new Date().getFullYear(),
      description: volume?.description || "",
      coverImageUrl: volume?.coverImageUrl || "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      const result = volume
        ? await updateVolume(volume.id, data)
        : await createVolume(data);

      if (result.success) {
        toast({
          title: volume ? "Volume updated" : "Volume created",
          description: `Volume ${data.volumeNumber} has been ${volume ? "updated" : "created"} successfully.`,
        });
        router.push("/dashboard/archives/volumes");
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
            name="volumeNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Number *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  The sequential volume number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Publication year</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this volume"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
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
                  description="Upload a cover image for this volume"
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
            {isSubmitting ? "Creating..." : volume ? "Update Volume" : "Create Volume"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
