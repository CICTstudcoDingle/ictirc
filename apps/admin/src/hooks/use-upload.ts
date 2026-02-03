"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

interface UseUploadOptions {
  bucket?: string;
  folder?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const bucket = options.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET_EVENTS || "event-images";
  const folder = options.folder || "";

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Small delay for UX and to show start of progress
      setProgress(10);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(90);

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      setProgress(100);
      options.onSuccess?.(publicUrl);
      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      options.onError?.(message);
      toast({
        title: "Upload Error",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    progress,
    error,
    setError,
  };
}
