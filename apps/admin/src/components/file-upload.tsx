"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@ictirc/ui";

interface FileUploadProps {
  onUploadComplete: (url: string, fileName: string) => void;
  accept?: string;
  maxSizeMB?: number;
  bucket?: string;
  folder?: string;
  className?: string;
}

// File upload limits based on Supabase Storage defaults
// Default: 50MB, can be configured in Supabase Dashboard > Storage > Settings
const DEFAULT_MAX_SIZE_MB = 10;

export function FileUpload({
  onUploadComplete,
  accept = ".pdf",
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_GUIDES || "research guides",
  folder = "guides",
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const mimeType = file.type;

    const isValidType =
      allowedTypes.includes(fileExt) ||
      allowedTypes.includes(mimeType) ||
      allowedTypes.includes("*");

    if (!isValidType) {
      return `Invalid file type. Allowed: ${accept}`;
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${folder}/${timestamp}-${sanitizedName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadedFile(file.name);
      onUploadComplete(urlData.publicUrl, file.name);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File upload input"
      />

      {uploadedFile ? (
        // Uploaded state
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">
              {uploadedFile}
            </p>
            <p className="text-xs text-green-600">Uploaded successfully</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            aria-label="Remove uploaded file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : uploading ? (
        // Uploading state
        <div className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-maroon/30 rounded-lg bg-maroon/5">
          <Loader2 className="w-6 h-6 text-maroon animate-spin" />
          <span className="text-sm text-maroon font-medium">Uploading...</span>
        </div>
      ) : (
        // Drop zone
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver
              ? "border-maroon bg-maroon/5"
              : "border-gray-200 hover:border-gray-300",
            error && "border-red-300 bg-red-50"
          )}
        >
          <Upload
            className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDragOver ? "text-maroon" : "text-gray-400"
            )}
          />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-maroon">Click to upload</span> or
            drag and drop
          </p>
          <p className="text-xs text-gray-400">
            PDF files only, max {maxSizeMB}MB
          </p>

          {error && (
            <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Info about file upload limits for display
export const FILE_UPLOAD_LIMITS = {
  maxSizeMB: DEFAULT_MAX_SIZE_MB,
  allowedTypes: ["application/pdf"],
  allowedExtensions: [".pdf"],
  note: "Supabase Storage default limit is 50MB, configured to 10MB for research guides",
};
