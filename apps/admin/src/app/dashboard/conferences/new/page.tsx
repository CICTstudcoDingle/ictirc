"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@ictirc/ui";
import { createConference } from "../actions";

export default function NewConferencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createConference({
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
      });

      if (result.success) {
        router.push("/dashboard/conferences");
        router.refresh();
      } else {
        setError(result.error || "Failed to create conference");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/conferences">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Conference</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a new conference to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Short Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., 2026 IRCICT"
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="e.g., 2nd International Research Conference..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon"
              placeholder="Brief description of the conference..."
            />
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              name="theme"
              placeholder="Conference theme"
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
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Dingle, Iloilo, Philippines"
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                placeholder="e.g., Knowledge Hub Center"
              />
            </div>
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
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Link href="/dashboard/conferences">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Conference
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
