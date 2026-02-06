"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, AvatarUpload } from "@ictirc/ui";
import { User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    avatarUrl?: string | null;
  };
  author: {
    affiliation: string | null;
  } | null;
}

export function ProfileClient({ user, author }: ProfileClientProps) {
  const [name, setName] = useState(user.name);
  const [affiliation, setAffiliation] = useState(author?.affiliation || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl || null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, affiliation }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setAvatarUrl(data.avatarUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    setUploadingAvatar(true);
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove avatar");
      }

      setAvatarUrl(null);
      toast.success("Avatar removed");
    } catch (error) {
      toast.error("Failed to remove avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Avatar Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            value={avatarUrl}
            onFileSelect={handleAvatarSelect}
            onRemove={handleAvatarRemove}
            isUploading={uploadingAvatar}
            size="lg"
            maxSizeMB={50}
            userName={user.name}
          />
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Input
              label="Email Address"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <Input
              label="Affiliation"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="e.g., ISUFST - College of ICT"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-900 capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
