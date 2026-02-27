"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Button, Input, Label } from "@ictirc/ui";
import { addKeynoteSpeaker, updateSpeakerPhoto } from "../../actions";
import { useUpload } from "@/hooks/use-upload";

interface AddSpeakerFormProps {
  conferenceId: string;
}

export function AddSpeakerForm({ conferenceId }: AddSpeakerFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Photo drag-and-drop state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useUpload({
    bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_EVENTS || "event-images",
    folder: "keynote-speakers",
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }
    setPhotoFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      // 1. Create the speaker record
      const result = await addKeynoteSpeaker({
        conferenceId,
        name: formData.get("name") as string,
        position: formData.get("position") as string,
        title: (formData.get("title") as string) || undefined,
        affiliation: (formData.get("affiliation") as string) || undefined,
        location: (formData.get("location") as string) || undefined,
        bio: (formData.get("bio") as string) || undefined,
        displayOrder:
          parseInt(formData.get("displayOrder") as string) || 0,
      });

      if (!result.success) {
        setError(result.error || "Failed to add speaker");
        return;
      }

      // 2. Upload photo if provided
      if (photoFile && result.speaker) {
        const publicUrl = await uploadFile(photoFile);
        if (publicUrl) {
          await updateSpeakerPhoto(result.speaker.id, publicUrl);
        }
      }

      setSuccess(true);
      clearPhoto();
      formRef.current?.reset();
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Speaker added successfully!
        </div>
      )}

      {/* Photo Drag-and-Drop Area */}
      <div>
        <Label>Profile Photo</Label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative mt-1.5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed
            p-6 cursor-pointer transition-all duration-200
            ${isDragging
              ? "border-maroon bg-maroon/5 scale-[1.01]"
              : "border-gray-300 hover:border-maroon/50 hover:bg-gray-50"
            }
          `}
        >
          {photoPreview ? (
            <div className="relative group">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-maroon/20 shadow-md"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearPhoto(); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">Click or drag to replace</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop a photo here
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse · JPG, PNG up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
        {isUploading && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-maroon rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading... {progress}%</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder='e.g., Dr. Indriati, S.T., M.Kom.'
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position / Role *</Label>
          <Input
            id="position"
            name="position"
            placeholder="e.g., Lecturer – Faculty of Computer Science"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="affiliation">Affiliation / Institution</Label>
          <Input
            id="affiliation"
            name="affiliation"
            placeholder="e.g., Universitas Brawijaya"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Malang, Indonesia"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Academic Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Ph.D., S.T., M.Kom."
          />
        </div>
        <div className="w-32">
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue="0"
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Short Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          placeholder="A brief summary of the speaker's expertise..."
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono placeholder:text-gray-400 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon/20"
        />
      </div>

      <Button type="submit" disabled={loading || isUploading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding Speaker...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Keynote Speaker
          </>
        )}
      </Button>
    </form>
  );
}
