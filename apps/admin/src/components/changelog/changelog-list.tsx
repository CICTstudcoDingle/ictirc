"use client";

import { Button } from "@ictirc/ui";
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  GitCommit,
  Tag as TagIcon,
} from "lucide-react";
import Link from "next/link";
import { toggleReleasePublish, deleteRelease } from "@/lib/actions/changelog";
import { useState } from "react";
import { useToastActions } from "@/lib/toast";

interface ChangelogListProps {
  releases: any[];
  userId: string;
}

const changeTypeColors = {
  FEATURE: "bg-blue-100 text-blue-700",
  ENHANCEMENT: "bg-green-100 text-green-700",
  BUGFIX: "bg-yellow-100 text-yellow-700",
  SECURITY: "bg-red-100 text-red-700",
  BREAKING: "bg-purple-100 text-purple-700",
  DEPRECATED: "bg-gray-100 text-gray-700",
};

const changeTypeLabels = {
  FEATURE: "Feature",
  ENHANCEMENT: "Enhancement",
  BUGFIX: "Bug Fix",
  SECURITY: "Security",
  BREAKING: "Breaking",
  DEPRECATED: "Deprecated",
};

export function ChangelogList({ releases, userId }: ChangelogListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const toast = useToastActions();

  const handleTogglePublish = async (releaseId: string) => {
    setLoading(releaseId);
    const result = await toggleReleasePublish(releaseId);
    setLoading(null);

    if (result.success) {
      toast.success("Release publish status updated", "The release has been updated successfully");
    } else {
      toast.error("Update failed", result.error || "Failed to update release");
    }
  };

  const handleDelete = async (releaseId: string, version: string) => {
    if (!confirm(`Are you sure you want to delete release ${version}?`)) {
      return;
    }

    setLoading(releaseId);
    const result = await deleteRelease(releaseId);
    setLoading(null);

    if (result.success) {
      toast.success("Release deleted", "The release has been deleted successfully");
    } else {
      toast.error("Delete failed", result.error || "Failed to delete release");
    }
  };

  if (releases.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-12 text-center">
        <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Releases Yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first release to start tracking changelog entries
        </p>
        <Link href="/dashboard/changelog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Release
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {releases.map((release) => (
        <div key={release.id} className="bg-white border rounded-lg p-6">
          {/* Release Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{release.title}</h2>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    release.isBeta
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {release.version} {release.isBeta ? "BETA" : ""}
                </span>
                {release.isPublished ? (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    Published
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    Draft
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(release.releaseDate).toLocaleDateString()}
                </div>
                {release.gitCommitHash && (
                  <div className="flex items-center gap-1">
                    <GitCommit className="h-4 w-4" />
                    {release.gitCommitHash.substring(0, 7)}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  By {release.creator.name || release.creator.email}
                </div>
              </div>

              {release.description && (
                <p className="mt-3 text-gray-700">{release.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTogglePublish(release.id)}
                disabled={loading === release.id}
              >
                {release.isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Publish
                  </>
                )}
              </Button>
              <Link href={`/dashboard/changelog/${release.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(release.id, release.version)}
                disabled={loading === release.id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {/* Changelog Entries */}
          {release.entries.length > 0 ? (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-sm text-gray-600 uppercase">
                Changes ({release.entries.length})
              </h3>
              <div className="space-y-2">
                {release.entries.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        changeTypeColors[entry.changeType as keyof typeof changeTypeColors]
                      }`}
                    >
                      {changeTypeLabels[entry.changeType as keyof typeof changeTypeLabels]}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {entry.description}
                      </p>
                      {(entry.prUrl || entry.issueUrl) && (
                        <div className="flex gap-3 mt-2 text-xs text-blue-600">
                          {entry.prUrl && (
                            <a
                              href={entry.prUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              PR #{entry.prNumber}
                            </a>
                          )}
                          {entry.issueUrl && (
                            <a
                              href={entry.issueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              Issue #{entry.issueNumber}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center">
              <p className="text-gray-600 mb-3">No changelog entries yet</p>
              <Link href={`/dashboard/changelog/${release.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
