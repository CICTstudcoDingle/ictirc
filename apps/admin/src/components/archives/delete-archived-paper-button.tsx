"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@ictirc/ui";

interface Props {
  paperId: string;
  paperTitle: string;
  /** When true, renders as a small icon button (for use in tables). Defaults to full button */
  compact?: boolean;
  /** Where to redirect after delete. Defaults to /dashboard/papers */
  redirectTo?: string;
}

export function DeleteArchivedPaperButton({
  paperId,
  paperTitle,
  compact = false,
  redirectTo = "/dashboard/papers",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to permanently delete this archived paper?\n\n"${paperTitle}"\n\nThis action cannot be undone.`
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(`/api/papers?id=${paperId}&source=archived`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors disabled:opacity-50"
        title="Delete archived paper"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
    >
      <Trash2 className="w-4 h-4 mr-1.5" />
      {loading ? "Deleting..." : "Delete Paper"}
    </Button>
  );
}

