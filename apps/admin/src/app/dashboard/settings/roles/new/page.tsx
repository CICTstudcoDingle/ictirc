"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@ictirc/ui";
import { createRole } from "../actions";

const availablePermissions = [
  "paper:read",
  "paper:create",
  "paper:update",
  "paper:delete",
  "paper:review",
  "paper:publish",
  "user:read",
  "user:invite",
  "user:update",
  "user:delete",
  "conference:read",
  "conference:create",
  "conference:update",
  "conference:delete",
  "role:read",
  "role:create",
  "role:update",
  "role:delete",
  "settings:read",
  "settings:update",
  "audit:read",
];

export default function NewRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createRole({
        name: formData.get("name") as string,
        displayName: formData.get("displayName") as string,
        description: formData.get("description") as string || undefined,
        permissions: selectedPermissions,
      });

      if (result.success) {
        router.push("/dashboard/settings/roles");
        router.refresh();
      } else {
        setError(result.error || "Failed to create role");
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
        <Link href="/dashboard/settings/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define a new custom role with specific permissions
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
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Role Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">System Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., MODERATOR"
                pattern="[A-Z_]+"
                title="Use uppercase letters and underscores only"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Uppercase letters and underscores only</p>
            </div>
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="e.g., Moderator"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon"
              placeholder="Brief description of what this role can do..."
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Permissions ({selectedPermissions.length} selected)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availablePermissions.map((permission) => (
              <label
                key={permission}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedPermissions.includes(permission)
                    ? "bg-maroon/5 border-maroon text-maroon"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
                />
                <span className="text-xs font-mono">{permission}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Link href="/dashboard/settings/roles">
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
                Create Role
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
