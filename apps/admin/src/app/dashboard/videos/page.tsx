"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Video, Film, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@ictirc/ui";

interface VideoRecord {
  id: string;
  title: string;
  description: string | null;
  type: "PROMOTIONAL" | "TEASER";
  r2Key: string;
  thumbnailUrl: string | null;
  editorName: string;
  isPublished: boolean;
  uploadDate: string;
  streamUrl: string | null;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoType, setVideoType] = useState<"promotional" | "teaser">("promotional");
  const [editorName, setEditorName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload MP4, WebM, or MOV.");
      return;
    }

    const maxSize = 1 * 1024 * 1024 * 1024; // 1GB
    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 1GB.");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title || !editorName) {
      setError("Please fill in all required fields and select a video file.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Get presigned upload URL
      const urlRes = await fetch("/api/videos/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          fileSize: selectedFile.size,
          type: videoType,
        }),
      });

      if (!urlRes.ok) {
        const urlError = await urlRes.json();
        throw new Error(urlError.error || "Failed to get upload URL");
      }

      const { uploadUrl, r2Key } = await urlRes.json();

      // Step 2: Upload directly to R2 via presigned URL with progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(selectedFile);
      });

      // Step 3: Save video record to database
      const createRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          type: videoType.toUpperCase(),
          r2Key,
          editorName,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to save video record");
      }

      setSuccess("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setEditorName("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuccess("Video deleted successfully");
      fetchVideos();
    } catch {
      setError("Failed to delete video");
    }
  };

  const handleTogglePublish = async (video: VideoRecord) => {
    try {
      const res = await fetch("/api/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: video.id,
          isPublished: !video.isPublished,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchVideos();
    } catch {
      setError("Failed to update video");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promotional Videos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage promotional videos for CICT and IT Week event teasers.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
          <button onClick={() => setSuccess(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-maroon" />
          Upload Video
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CICT Department Promo 2026"
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-3 py-2.5 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Editor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                placeholder="e.g., Juan Dela Cruz"
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-3 py-2.5 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the video..."
              rows={3}
              className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-3 py-2.5 text-sm font-mono focus:border-maroon focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVideoType("promotional")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                    videoType === "promotional"
                      ? "border-maroon bg-maroon/5 text-maroon"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  <Film className="w-4 h-4" />
                  CICT Promo
                </button>
                <button
                  type="button"
                  onClick={() => setVideoType("teaser")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                    videoType === "teaser"
                      ? "border-maroon bg-maroon/5 text-maroon"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  <Video className="w-4 h-4" />
                  IT Week Teaser
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video File <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                aria-label="Select video file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20 cursor-pointer"
              />
              {selectedFile && (
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-maroon h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className={cn(
              "w-full md:w-auto px-6 py-2.5 rounded-md text-sm font-semibold text-white transition-all",
              uploading || !selectedFile
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-maroon hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]"
            )}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Video
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Video List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Videos</h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-maroon" />
          </div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No videos uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {videos.map((video) => (
              <div key={video.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                {/* Video Preview */}
                <div className="w-full md:w-48 flex-shrink-0">
                  {video.streamUrl ? (
                    <video
                      src={video.streamUrl}
                      className="w-full h-28 object-cover rounded-lg bg-gray-900"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{video.title}</h3>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        video.type === "PROMOTIONAL"
                          ? "bg-maroon/10 text-maroon"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {video.type === "PROMOTIONAL" ? "CICT Promo" : "IT Week Teaser"}
                    </span>
                    {!video.isPublished && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Draft
                      </span>
                    )}
                  </div>
                  {video.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mb-1">{video.description}</p>
                  )}
                  <p className="text-xs text-gray-400 font-mono">
                    Edited by {video.editorName} &middot;{" "}
                    {new Date(video.uploadDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePublish(video)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-maroon transition-colors"
                    title={video.isPublished ? "Unpublish" : "Publish"}
                  >
                    {video.isPublished ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete video"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
