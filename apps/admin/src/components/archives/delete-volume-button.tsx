"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@ictirc/ui";
import { deleteVolume } from "@/lib/actions/volume";

interface Props {
  volumeId: string;
  volumeNumber: number;
  year: number;
  variant?: "icon" | "button";
  onDeleted?: () => void;
}

export function DeleteVolumeButton({
  volumeId,
  volumeNumber,
  year,
  variant = "icon",
  onDeleted,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        `Are you sure you want to delete Volume ${volumeNumber} (${year})?\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteVolume(volumeId);
      if (result.success) {
        onDeleted?.();
        router.refresh();
      } else {
        alert(`Failed to delete volume: ${result.error ?? "Unknown error"}`);
      }
    } catch {
      alert("An unexpected error occurred while deleting the volume.");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 mr-1.5" />
        )}
        {loading ? "Deleting..." : "Delete"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors disabled:opacity-50"
      title="Delete volume"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
