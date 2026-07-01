"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@ictirc/ui";
import { updateRole, getRole } from "../actions";

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

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

export default function EditRolePage({ params }: EditRolePageProps) {
  const router = useRouter();
  const [roleId, setRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { id } = await params;
      setRoleId(id);
      const result = await getRole(id);
      if (cancelled) return;

      if (!result.success || !result.role) {
        setError(result.error || "Role not found");
        setLoading(false);
        return;
      }

      setDisplayName(result.role.displayName);
      setDescription(result.role.description || "");
      setSelectedPermissions(result.role.permissions || []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roleId) return;

    setSaving(true);
    setError(null);

    try {
      const result = await updateRole(roleId, {
        displayName,
        description: description || undefined,
        permissions: selectedPermissions,
      });

      if (result.success) {
        router.push("/dashboard/settings/roles");
        router.refresh();
      } else {
        setError(result.error || "Failed to update role");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update role display name, description, and permissions
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-maroon" />
        </div>
      )}

      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Role Information
            </h2>

            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Moderator"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Role
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
