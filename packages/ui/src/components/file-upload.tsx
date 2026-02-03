"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, FileText, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";

export interface FileUploadProps {
  /**
   * The current file URL (if already uploaded)
   */
  value?: string | null;
  /**
   * Callback when a file is selected or dropped
   */
  onFileSelect: (file: File) => void;
  /**
   * Callback when the file is removed
   */
  onRemove: () => void;
  /**
   * Loading state from the parent
   */
  isUploading?: boolean;
  /**
   * Upload progress (0-100)
   */
  progress?: number;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Accepted file types (e.g. "image/*", ".pdf")
   */
  accept?: string;
  /**
   * Maximum file size in MB
   */
  maxSizeMB?: number;
  /**
   * Display variant
   */
  variant?: "image" | "file";
  /**
   * Custom label
   */
  label?: string;
  /**
   * Custom description
   */
  description?: string;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Display name of the file (for already uploaded files or local selection)
   */
  fileName?: string;
}

export function FileUpload({
  value,
  onFileSelect,
  onRemove,
  isUploading = false,
  progress = 0,
  error: externalError,
  accept = "image/*",
  maxSizeMB = 10,
  variant = "image",
  label,
  description,
  className,
  fileName,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const error = externalError || internalError;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Sync preview with value prop
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const validateFile = (file: File): string | null => {
    // Basic type validation (if not wildcard)
    if (accept !== "*") {
      const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const mimeType = file.type.toLowerCase();

      const isValidType = allowedTypes.some((type) => {
        if (type.startsWith(".")) return type === fileExt;
        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0];
          return mimeType.startsWith(`${baseType}/`);
        }
        return type === mimeType;
      });

      if (!isValidType) {
        return `Invalid file type. Expected: ${accept}`;
      }
    }

    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size is ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setInternalError(errorMsg);
      return;
    }

    setInternalError(null);
    
    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setInternalError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove();
  };

  const hasFile = value || fileName;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onInputChange}
        accept={accept}
        className="hidden"
      />

      {preview && variant === "image" ? (
        <div className="relative group aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-900 rounded-md text-xs font-semibold hover:bg-gray-100 mr-2"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-maroon animate-spin mb-2" />
              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-maroon transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all cursor-pointer",
            isDragOver 
              ? "border-maroon bg-maroon/5 ring-4 ring-maroon/5" 
              : "border-gray-200 hover:border-maroon/30 hover:bg-gray-50/50",
            error ? "border-red-300 bg-red-50" : "",
            isUploading ? "pointer-events-none opacity-50" : ""
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-maroon animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-600">Uploading {progress}%</p>
            </div>
            ) : hasFile ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg w-full max-w-sm">
                <FileText className="w-6 h-6 text-green-600" />
                <div className="flex-1 truncate">
                      <p className="text-sm font-medium text-green-900 truncate">
                        {fileName || "File Attached"}
                      </p>
                  <p className="text-xs text-green-700">Click to replace</p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-green-100 rounded-full text-green-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-full bg-maroon/5 p-4 text-maroon">
                {variant === "image" ? (
                  <ImageIcon className="h-8 w-8" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-900">
                  {label || `Upload ${variant === "image" ? "Image" : "File"}`}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {description || `Drag and drop or click to browse`}
                </p>
                <p className="mt-2 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  {accept.replace(/\//g, "").replace(/\./g, "").toUpperCase()} • MAX {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
