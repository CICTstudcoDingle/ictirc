"use client";

import { useState } from "react";
import { CloudOff, Cloud, Loader2 } from "lucide-react";
import { Button } from "@ictirc/ui";
import { toast } from "sonner";

interface BackupButtonProps {
  paperId: string;
  hasBackup: boolean;
  lastBackupAt?: Date | string | null;
}

export function BackupButton({ paperId, hasBackup, lastBackupAt }: BackupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [backed, setBacked] = useState(hasBackup);
  const [backupDate, setBackupDate] = useState(lastBackupAt);

  async function handleBackup() {
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/${paperId}/backup`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Backup failed");
      }

      toast.success("Paper backed up to R2 cold storage");
      setBacked(true);
      setBackupDate(data.backupAt);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Backup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {backed ? (
          <Cloud className="w-4 h-4 text-green-600" />
        ) : (
          <CloudOff className="w-4 h-4 text-gray-400" />
        )}
        Cold Storage Backup
      </h3>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Backup Status</p>
          <p className={`text-sm font-medium ${backed ? "text-green-600" : "text-gray-500"}`}>
            {backed ? "Backed up to R2" : "Not backed up"}
          </p>
        </div>

        {backupDate && (
          <div>
            <p className="text-xs text-gray-500">Last Backup</p>
            <p className="text-sm text-gray-900">
              {new Date(backupDate).toLocaleString()}
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleBackup}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Backing up...
            </>
          ) : backed ? (
            <>
              <Cloud className="w-4 h-4 mr-2" />
              Refresh Backup
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4 mr-2" />
              Backup to R2
            </>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Only Editors and Dean can trigger backups
        </p>
      </div>
    </div>
  );
}
