"use client";

import { Button } from "@ictirc/ui";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRelease } from "@/lib/actions/changelog";
import { useToastActions } from "@/lib/toast";

interface ReleaseFormProps {
  userId: string;
  release?: any;
}

export function ReleaseForm({ userId, release }: ReleaseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToastActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createRelease(formData, userId);

    setLoading(false);

    if (result.success) {
      toast.success("Release created", "The release has been created successfully");
      router.push("/dashboard/changelog");
    } else {
      toast.error("Creation failed", result.error || "Failed to create release");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="version" className="block text-sm font-medium mb-2">
              Version <span className="text-red-500">*</span>
            </label>
            <input
              id="version"
              type="text"
              name="version"
              placeholder="1.1.0"
              defaultValue={release?.version}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Semantic version (e.g., 1.0.0, 2.1.3-beta)
            </p>
          </div>

          <div>
            <label htmlFor="versionType" className="block text-sm font-medium mb-2">
              Version Type <span className="text-red-500">*</span>
            </label>
            <select
              id="versionType"
              name="versionType"
              defaultValue={release?.versionType || "MINOR"}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MAJOR">Major (Breaking Changes)</option>
              <option value="MINOR">Minor (New Features)</option>
              <option value="PATCH">Patch (Bug Fixes)</option>
              <option value="BETA">Beta</option>
              <option value="ALPHA">Alpha</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Release Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="New Features and Improvements"
            defaultValue={release?.title}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional description of this release..."
            defaultValue={release?.description}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium mb-2">
            Release Date <span className="text-red-500">*</span>
          </label>
          <input
            id="releaseDate"
            type="date"
            name="releaseDate"
            defaultValue={release?.releaseDate ? new Date(release.releaseDate).toISOString().split('T')[0] : today}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Git Info */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Git Information (Optional)</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="gitCommitHash" className="block text-sm font-medium mb-2">
                Git Commit Hash
              </label>
              <input
                id="gitCommitHash"
                type="text"
                name="gitCommitHash"
                placeholder="abc1234"
                defaultValue={release?.gitCommitHash}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="gitTag" className="block text-sm font-medium mb-2">
                Git Tag
              </label>
              <input
                id="gitTag"
                type="text"
                name="gitTag"
                placeholder="v1.1.0"
                defaultValue={release?.gitTag}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold mb-4">Release Options</h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isBeta"
              id="isBeta"
              defaultChecked={release?.isBeta}
              value="true"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isBeta" className="text-sm font-medium">
              Mark as Beta Release
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              id="isPublished"
              defaultChecked={release?.isPublished}
              value="true"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="text-sm font-medium">
              Publish immediately
            </label>
            <p className="text-xs text-gray-500">
              (You can publish later from the changelog list)
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/changelog">
          <Button type="button" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>

        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Create Release"}
        </Button>
      </div>
    </form>
  );
}
