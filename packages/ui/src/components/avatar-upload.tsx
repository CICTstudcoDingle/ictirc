"use client";

import React, { useState, useRef, useCallback } from "react";
import { Camera, Loader2, User, X } from "lucide-react";
import { cn } from "../lib/utils";

export interface AvatarUploadProps {
  /**
   * Current avatar URL
   */
  value?: string | null;
  /**
   * Callback when avatar is selected
   */
  onFileSelect: (file: File) => void;
  /**
   * Callback when avatar is removed
   */
  onRemove?: () => void;
  /**
   * Loading state
   */
  isUploading?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Max file size in MB
   */
  maxSizeMB?: number;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * User name for fallback display
   */
  userName?: string;
}

export function AvatarUpload({
  value,
  onFileSelect,
  onRemove,
  isUploading = false,
  size = "lg",
  maxSizeMB = 50,
  className,
  userName,
}: AvatarUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file";
    }
    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size is ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setError(errorMsg);
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect(file);
    },
    [onFileSelect, maxSizeBytes]
  );

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
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove?.();
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentImage = preview || value;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onInputChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative rounded-full overflow-hidden cursor-pointer group transition-all border-4",
          sizeClasses[size],
          isDragOver
            ? "border-maroon ring-4 ring-maroon/20"
            : "border-gray-200 hover:border-maroon/30",
          isUploading && "pointer-events-none"
        )}
      >
        {/* Avatar Image or Fallback */}
        {currentImage ? (
          <img
            src={currentImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {userName ? (
              <span className="text-xl font-bold text-gray-400">
                {getInitials(userName)}
              </span>
            ) : (
              <User className={cn("text-gray-400", iconSizes[size])} />
            )}
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
            isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Remove Button */}
        {currentImage && !isUploading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Labels */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {isUploading ? "Uploading..." : "Click or drag to upload"}
        </p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
