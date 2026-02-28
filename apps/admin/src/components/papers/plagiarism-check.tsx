"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, ShieldOff, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { cn } from "@ictirc/ui";
import type { PlagiarismStatus } from "@ictirc/database";
import { recordPlagiarismCheck, overridePlagiarismRejection } from "@/app/dashboard/papers/[id]/actions";
import { useToast } from "@/lib/toast";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlagiarismCheckProps {
  paperId: string;
  currentScore: number | null;
  currentStatus: PlagiarismStatus;
  checkedAt: string | null;
  checkedByName: string | null;
  notes: string | null;
  overriddenByName: string | null;
  overrideNote: string | null;
  userRole: "AUTHOR" | "REVIEWER" | "EDITOR" | "DEAN";
}

// ── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PlagiarismStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof ShieldCheck;
  description: string;
}> = {
  PENDING: {
    label: "Not Checked",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: ShieldOff,
    description: "Plagiarism check has not been performed yet.",
  },
  PASS: {
    label: "Passed",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: ShieldCheck,
    description: "Score under 15% — automatically passed.",
  },
  FLAGGED: {
    label: "Flagged",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    icon: ShieldAlert,
    description: "Score 15-25% — flagged for editor review.",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: ShieldX,
    description: "Score over 25% — auto-rejected. Dean can override.",
  },
  OVERRIDDEN: {
    label: "Overridden",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: Lock,
    description: "Rejection overridden by the Dean.",
  },
};

// ── Score Bar Color ───────────────────────────────────────────────────────────

function getScoreBarColor(score: number): string {
  if (score < 15) return "bg-green-500";
  if (score <= 25) return "bg-amber-500";
  return "bg-red-500";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PlagiarismCheck({
  paperId,
  currentScore,
  currentStatus,
  checkedAt,
  checkedByName,
  notes,
  overriddenByName,
  overrideNote,
  userRole,
}: PlagiarismCheckProps) {
  const { addToast } = useToast();

  // Form state
  const [score, setScore] = useState<string>(currentScore?.toString() ?? "");
  const [checkNotes, setCheckNotes] = useState(notes ?? "");
  const [isRecording, setIsRecording] = useState(false);

  // Override state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [isOverriding, setIsOverriding] = useState(false);

  const canRecord = userRole === "EDITOR" || userRole === "DEAN";
  const canOverride = userRole === "DEAN" && currentStatus === "REJECTED";

  const config = STATUS_CONFIG[currentStatus];
  const StatusIcon = config.icon;

  // ── Record Plagiarism Score ──────────────────────────────────────────────

  const handleRecord = async () => {
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      addToast("error", "Invalid Score", "Please enter a number between 0 and 100.");
      return;
    }

    setIsRecording(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        addToast("error", "Unauthorized", "You must be logged in.");
        return;
      }

      const result = await recordPlagiarismCheck({
        paperId,
        score: numScore,
        notes: checkNotes.trim() || undefined,
        checkedByUserId: user.id,
      });

      if (result.success) {
        addToast("success", "Plagiarism Check Recorded", result.message || "Score saved.");
        // Reload to reflect new status
        window.location.reload();
      } else {
        addToast("error", "Failed", result.error || "Could not record plagiarism check.");
      }
    } catch (error) {
      addToast("error", "Error", "Unexpected error recording plagiarism check.");
    } finally {
      setIsRecording(false);
    }
  };

  // ── Dean Override ────────────────────────────────────────────────────────

  const handleOverride = async () => {
    if (!overrideReason.trim()) {
      addToast("error", "Reason Required", "You must provide a reason for the override.");
      return;
    }

    setIsOverriding(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        addToast("error", "Unauthorized", "You must be logged in.");
        return;
      }

      const result = await overridePlagiarismRejection({
        paperId,
        overriddenByUserId: user.id,
        overrideNote: overrideReason.trim(),
      });

      if (result.success) {
        addToast("success", "Override Applied", result.message || "Rejection overridden.");
        setShowOverrideModal(false);
        window.location.reload();
      } else {
        addToast("error", "Failed", result.error || "Could not override.");
      }
    } catch (error) {
      addToast("error", "Error", "Unexpected error during override.");
    } finally {
      setIsOverriding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-maroon" />
        Plagiarism Check
      </h3>

      {/* Current Status Badge */}
      <div className={cn("flex items-center gap-3 p-3 rounded-lg mb-4", config.bgColor)}>
        <StatusIcon className={cn("w-6 h-6 shrink-0", config.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold", config.color)}>{config.label}</p>
          <p className="text-xs text-gray-600 mt-0.5">{config.description}</p>
        </div>
      </div>

      {/* Score Display (if checked) */}
      {currentScore !== null && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Similarity Score</span>
            <span className={cn(
              "text-lg font-bold",
              currentScore < 15 ? "text-green-700" :
              currentScore <= 25 ? "text-amber-700" : "text-red-700"
            )}>
              {currentScore.toFixed(1)}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            {/* eslint-disable-next-line react/forbid-dom-props -- dynamic width requires inline style */}
            <div
              className={cn("h-2.5 rounded-full transition-all", getScoreBarColor(currentScore))}
              style={{ width: `${Math.min(currentScore, 100)}%` }}
            />
          </div>
          {/* Threshold markers */}
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>0%</span>
            <span className="text-green-500">15%</span>
            <span className="text-amber-500">25%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Check metadata */}
      {checkedAt && (
        <div className="text-xs text-gray-500 space-y-1 mb-4 border-t pt-3">
          <p>Checked: {new Date(checkedAt).toLocaleString()}</p>
          {checkedByName && <p>By: {checkedByName}</p>}
          {notes && <p className="italic">Notes: {notes}</p>}
        </div>
      )}

      {/* Override info */}
      {currentStatus === "OVERRIDDEN" && overriddenByName && (
        <div className="text-xs text-purple-700 bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
          <p className="font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Dean Override
          </p>
          <p className="mt-1">Overridden by: {overriddenByName}</p>
          {overrideNote && <p className="italic mt-1">Reason: {overrideNote}</p>}
        </div>
      )}

      {/* ── Record Form (Editor / Dean) ─────────────────────────────────── */}
      {canRecord && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {currentScore !== null ? "Re-check Plagiarism Score" : "Record Plagiarism Score"}
          </h4>

          {/* Score input */}
          <div className="mb-3">
            <label htmlFor="plagiarism-score" className="block text-xs text-gray-500 mb-1">
              Similarity Percentage (0–100)
            </label>
            <input
              id="plagiarism-score"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g., 12.5"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
            />
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label htmlFor="plagiarism-notes" className="block text-xs text-gray-500 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="plagiarism-notes"
              rows={2}
              value={checkNotes}
              onChange={(e) => setCheckNotes(e.target.value)}
              placeholder="e.g., Checked via Turnitin, flagged sections in intro..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none resize-none"
            />
          </div>

          {/* Threshold guide */}
          <div className="text-[11px] text-gray-400 mb-3 space-y-0.5">
            <p className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> &lt;15% → Auto-pass</p>
            <p className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> 15–25% → Flagged for review</p>
            <p className="flex items-center gap-1"><ShieldX className="w-3 h-3 text-red-500" /> &gt;25% → Auto-rejected</p>
          </div>

          <button
            onClick={handleRecord}
            disabled={isRecording || !score}
            className={cn(
              "w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isRecording || !score
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-maroon hover:bg-maroon/90 text-white"
            )}
          >
            {isRecording ? "Recording..." : "Record Plagiarism Score"}
          </button>
        </div>
      )}

      {/* ── Dean Override Button ─────────────────────────────────────────── */}
      {canOverride && (
        <div className="border-t pt-4 mt-4">
          <button
            onClick={() => setShowOverrideModal(true)}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Dean Override — Clear Rejection
          </button>
        </div>
      )}

      {/* ── Override Modal ───────────────────────────────────────────────── */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Override Plagiarism Rejection</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Current score: <span className="font-bold text-red-600">{currentScore?.toFixed(1)}%</span>.
                  This action will allow the paper to proceed despite exceeding the 25% threshold.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="override-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Override <span className="text-red-500">*</span>
              </label>
              <textarea
                id="override-reason"
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Provide a detailed reason for overriding this rejection..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none resize-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-700 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                This action is logged in the audit trail and cannot be undone without re-running the plagiarism check.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowOverrideModal(false); setOverrideReason(""); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                disabled={isOverriding || !overrideReason.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isOverriding || !overrideReason.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                )}
              >
                {isOverriding ? "Overriding..." : "Confirm Override"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
