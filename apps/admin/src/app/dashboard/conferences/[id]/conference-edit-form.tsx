"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, Trash2, Plus, X } from "lucide-react";
import { Button, Input, Label, FileUpload } from "@ictirc/ui";
import { updateConference, deleteConference } from "../actions";
import { useUpload } from "@/hooks/use-upload";

interface ConferenceEditFormProps {
  conference: {
    id: string;
    name: string;
    fullName?: string | null;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    venue?: string | null;
    theme?: string | null;
    organizers: string[];
    partners: string[];
    logoUrl?: string | null;
    imageUrl?: string | null;
    websiteUrl?: string | null;
    isPublished: boolean;
    isActive: boolean;
  };
}

export function ConferenceEditForm({ conference }: ConferenceEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(conference.imageUrl || "");
  const [logoUrl, setLogoUrl] = useState(conference.logoUrl || "");
  const [organizers, setOrganizers] = useState<string[]>(conference.organizers || []);
  const [partners, setPartners] = useState<string[]>(conference.partners || []);

  const bannerUpload = useUpload({ folder: "conferences/banners" });
  const logoUpload = useUpload({ folder: "conferences/logos" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateConference(conference.id, {
        name: formData.get("name") as string,
        fullName: formData.get("fullName") as string || undefined,
        description: formData.get("description") as string || undefined,
        startDate: new Date(formData.get("startDate") as string),
        endDate: formData.get("endDate") 
          ? new Date(formData.get("endDate") as string) 
          : undefined,
        location: formData.get("location") as string || undefined,
        venue: formData.get("venue") as string || undefined,
        theme: formData.get("theme") as string || undefined,
        websiteUrl: formData.get("websiteUrl") as string || undefined,
        imageUrl: imageUrl || undefined,
        logoUrl: logoUrl || undefined,
        organizers: organizers.filter(Boolean),
        partners: partners.filter(Boolean),
        isPublished: formData.get("isPublished") === "on",
      });

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to update conference");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this conference? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteConference(conference.id);
      if (result.success) {
        router.push("/dashboard/conferences");
        router.refresh();
      } else {
        setError(result.error || "Failed to delete conference");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Status badges */}
      <div className="flex items-center gap-2">
        {conference.isActive && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Active on Landing Page
          </span>
        )}
        {conference.isPublished ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Published
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Draft
          </span>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Short Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={conference.name}
              required
            />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={conference.fullName || ""}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief description of the conference..."
            defaultValue={conference.description || ""}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon"
          />
        </div>

        <div>
          <Label htmlFor="theme">Theme</Label>
          <Input
            id="theme"
            name="theme"
            defaultValue={conference.theme || ""}
          />
        </div>
      </div>

      {/* Dates & Location */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Dates & Location</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={formatDate(conference.startDate)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={conference.endDate ? formatDate(conference.endDate) : ""}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={conference.location || ""}
            />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={conference.venue || ""}
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Media</h2>

        <div>
          <Label>Conference Banner</Label>
          <FileUpload
            value={imageUrl}
            onFileSelect={async (file) => {
              const url = await bannerUpload.uploadFile(file);
              if (url) setImageUrl(url);
            }}
            onRemove={() => setImageUrl("")}
            isUploading={bannerUpload.isUploading}
            progress={bannerUpload.progress}
            variant="image"
            description="Upload a high-resolution banner or poster (event-images bucket)"
          />
        </div>

        <div>
          <Label>Conference Logo (Optional)</Label>
          <FileUpload
            value={logoUrl}
            onFileSelect={async (file) => {
              const url = await logoUpload.uploadFile(file);
              if (url) setLogoUrl(url);
            }}
            onRemove={() => setLogoUrl("")}
            isUploading={logoUpload.isUploading}
            progress={logoUpload.progress}
            variant="image"
            description="Upload the official conference or organizer logo"
          />
        </div>
      </div>

      {/* Organizers & Partners */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Organizers &amp; Partners</h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Organizers</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOrganizers([...organizers, ""])}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Organizer
            </Button>
          </div>
          {organizers.map((org, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={org}
                onChange={(e) => {
                  const updated = [...organizers];
                  updated[index] = e.target.value;
                  setOrganizers(updated);
                }}
                placeholder="Organization name"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOrganizers(organizers.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Partners</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPartners([...partners, ""])}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Partner
            </Button>
          </div>
          {partners.map((partner, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={partner}
                onChange={(e) => {
                  const updated = [...partners];
                  updated[index] = e.target.value;
                  setPartners(updated);
                }}
                placeholder="Partner organization"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPartners(partners.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Links</h2>
        
        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={conference.websiteUrl || ""}
          />
        </div>
      </div>

      {/* Publishing */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Publishing</h2>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={conference.isPublished}
            className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
          />
          <span className="text-sm text-gray-700">Published (visible on public site)</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          disabled={deleting || conference.isActive}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          Delete
        </Button>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/conferences">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
