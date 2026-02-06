"use client";

import { useState, useEffect } from "react";
import { Database, Cloud, Download, Loader2, HardDrive, RefreshCw } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@ictirc/ui";
import { toast } from "sonner";

interface BackupFile {
  fileName: string;
  fileSize: number;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function BackupSettingsPage() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploadToGdrive, setUploadToGdrive] = useState(false);

  async function loadBackups() {
    try {
      const res = await fetch("/api/backup/database");
      const data = await res.json();
      if (data.backups) {
        setBackups(data.backups);
      }
    } catch (error) {
      console.error("Failed to load backups:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBackups();
  }, []);

  async function handleCreateBackup() {
    setCreating(true);
    try {
      const res = await fetch("/api/backup/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadToGdrive }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Backup failed");
      }

      toast.success("Database backup created successfully");
      
      if (data.driveUpload?.success) {
        toast.success("Uploaded to Google Drive");
      } else if (uploadToGdrive && data.driveUpload?.error) {
        toast.error(`Drive upload failed: ${data.driveUpload.error}`);
      }

      loadBackups();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Backup failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Backup</h1>
          <p className="text-gray-600 mt-1">
            Create and manage database backups for disaster recovery
          </p>
        </div>

        {/* Create Backup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-maroon" />
              Create New Backup
            </CardTitle>
            <CardDescription>
              Export database to JSON format. Only accessible to Dean.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadToGdrive}
                onChange={(e) => setUploadToGdrive(e.target.checked)}
                className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
              />
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">
                  Also upload to Google Drive
                </span>
              </div>
            </label>

            <Button
              onClick={handleCreateBackup}
              disabled={creating}
              className="w-full sm:w-auto"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Backups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-gray-600" />
                  Local Backups
                </CardTitle>
                <CardDescription>
                  Backup files stored on the server
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={loadBackups}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No backups found. Create your first backup above.
              </div>
            ) : (
              <div className="divide-y">
                {backups.map((backup) => (
                  <div
                    key={backup.fileName}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {backup.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(backup.fileSize)} •{" "}
                        {new Date(backup.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`/backups/${backup.fileName}`}
                        download
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-amber-800 mb-2">
              📋 Backup Recommendations
            </h3>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Create backups weekly or before major changes</li>
              <li>Keep at least 6 months of backup history</li>
              <li>Store copies in Google Drive for off-site redundancy</li>
              <li>Test restores periodically to ensure data integrity</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
