"use client";

import { useState } from "react";
import { Check, ChevronRight, Clock, FileText, Settings, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePublicationStep } from "@/app/dashboard/papers/[id]/actions";
import { useToast } from "@/lib/toast";

interface PublicationTrackerProps {
  paperId: string;
  currentStep: number;
  currentNote?: string | null;
}

const STEPS = [
  { id: 1, label: "Submitted", icon: FileText, description: "Article received by the system." },
  { id: 2, label: "Initial Screening", icon: ShieldCheck, description: "Technical and Plagiarism checks." },
  { id: 3, label: "ID Assigned", icon: Settings, description: "Official Manuscript ID generated." },
  { id: 4, label: "Editorial Review", icon: UserCheck, description: "Peer review and assessment." },
  { id: 5, label: "Status Notification", icon: AlertCircle, description: "Decision communicated to authors." },
  { id: 6, label: "Author Formalities", icon: FileText, description: "Copyright and final checks." },
  { id: 7, label: "Final Publication", icon: Check, description: "Live on IRJICT." },
];

export function PublicationTracker({ paperId, currentStep = 1, currentNote }: PublicationTrackerProps) {
  const [step, setStep] = useState(currentStep);
  const [note, setNote] = useState(currentNote || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  const handleUpdate = async (newStep: number) => {
    setIsUpdating(true);
    // Optimistic update
    setStep(newStep);
    
    // @ts-ignore
    const result = await updatePublicationStep(paperId, newStep, note);
    
    if (result.success) {
      addToast("success", "Status Updated", `Paper moved to step ${newStep}`);
    } else {
      setStep(currentStep); // Revert
      addToast("error", "Update Failed", result.error || "Could not update status");
    }
    setIsUpdating(false);
  };

  const handleNoteSave = async () => {
    setIsUpdating(true);
    // @ts-ignore
    const result = await updatePublicationStep(paperId, step, note);
    setIsUpdating(false);
    
    if (result.success) {
      addToast("success", "Note Saved", "Publication note updated");
    } else {
      addToast("error", "Save Failed", "Could not save note");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Publication Workflow</h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

        <div className="space-y-6 relative">
          {STEPS.map((s, idx) => {
            const isCompleted = s.id < step;
            const isCurrent = s.id === step;
            
            return (
              <div key={s.id} className="flex gap-4 group">
                {/* Step Indicator */}
                <button
                  onClick={() => handleUpdate(s.id)}
                  disabled={isUpdating}
                  className={cn(
                    "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                    isCompleted ? "bg-maroon border-maroon text-white" : 
                    isCurrent ? "bg-white border-maroon text-maroon ring-4 ring-maroon/10" : 
                    "bg-white border-gray-200 text-gray-400 hover:border-maroon/50"
                  )}
                >
                  <s.icon className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="pt-2 pb-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "text-sm font-medium transition-colors",
                      (isCompleted || isCurrent) ? "text-gray-900" : "text-gray-500"
                    )}>
                      {s.label}
                    </h4>
                    {isCurrent && (
                        <span className="text-xs bg-maroon/10 text-maroon px-2 py-0.5 rounded font-medium">
                            Current
                        </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                  
                  {isCurrent && (
                    <div className="mt-4 animate-in slide-in-from-top-2 fade-in">
                      <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add an internal note for this step..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-maroon focus:border-maroon min-h-[80px]"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                            onClick={handleNoteSave}
                            disabled={isUpdating}
                            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isUpdating ? "Saving..." : "Save Note"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
