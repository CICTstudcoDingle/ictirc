"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  maxSize?: number; // in bytes, default 50MB
}

export function ImageUpload({
  value,
  onUpload,
  onRemove,
  maxSize = 50 * 1024 * 1024, // 50MB
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_EVENTS || "event-images";

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file size
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      try {
        setUploading(true);
        setProgress(10);

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        setProgress(30);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        setProgress(70);

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        setProgress(90);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setProgress(100);
          onUpload(publicUrl);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        setProgress(0);
      }
    },
    [bucket, maxSize, onUpload, supabase.storage]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleUpload(e.target.files[0]);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setProgress(0);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);

  return (
    <div className="w-full">
      <label htmlFor="image-upload-input" className="sr-only">Upload event image</label>
      <input
        id="image-upload-input"
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        aria-label="Upload event image"
      />

      {preview ? (
        <div className="relative group">
          {/* Image Preview */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Uploading... {progress}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full bg-maroon transition-all duration-300`}
                style={{ width: `${progress}%` } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative w-full aspect-video rounded-lg border-2 border-dashed
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-colors
            ${
              dragActive
                ? "border-maroon bg-maroon/10"
                : "border-gray-300 dark:border-gray-600 hover:border-maroon dark:hover:border-maroon"
            }
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-maroon animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading... {progress}%
              </p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-maroon/10">
                {dragActive ? (
                  <Upload className="w-8 h-8 text-maroon" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-maroon" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dragActive ? "Drop image here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All image formats supported (Max {maxSize / 1024 / 1024}MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
