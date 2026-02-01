"use client";

import { motion } from "framer-motion";
import { Check, Clock, FileText, Settings, ShieldCheck, UserCheck, AlertCircle, FileSearch, Send, Sparkles } from "lucide-react";
import { cn } from "@ictirc/ui";

interface PublicTrackerProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Submission Received", icon: Send, description: "Your manuscript has been successfully uploaded to our secure vault." },
  { id: 2, label: "Initial Screening", icon: ShieldCheck, description: "Our team is performing technical and plagiarism checks." },
  { id: 3, label: "Manuscript ID Assigned", icon: FileText, description: "A unique identifier has been generated for tracking." },
  { id: 4, label: "Editorial Review", icon: FileSearch, description: "Your paper is under peer review by subject matter experts." },
  { id: 5, label: "Decision Notification", icon: AlertCircle, description: "The editorial board is preparing the final decision." },
  { id: 6, label: "Author Formalities", icon: Settings, description: "Processing copyright and final publishing agreements." },
  { id: 7, label: "Published", icon: Sparkles, description: "Your research is now live and indexed on IRJICT." },
];

export function PublicTracker({ currentStep }: PublicTrackerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-maroon/20 via-maroon/50 to-maroon/20 rounded-full" />

        <div className="space-y-12 relative">
          {STEPS.map((s, idx) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            const isFuture = s.id > currentStep;

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={cn(
                  "flex gap-6 group relative",
                  isFuture && "opacity-50 grayscale"
                )}
              >
                {/* Step Indicator */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm relative z-10",
                      isCompleted ? "bg-maroon border-maroon text-white" :
                      isCurrent ? "bg-white border-maroon text-maroon shadow-[0_0_20px_rgba(128,0,0,0.2)]" :
                      "bg-white border-gray-200 text-gray-300"
                    )}
                  >
                    <s.icon className={cn("w-7 h-7", isCurrent && "animate-pulse")} />
                    
                    {/* Current Step Ping Effect */}
                    {isCurrent && (
                        <span className="absolute -inset-1 rounded-2xl bg-maroon opacity-20 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={cn(
                      "text-lg font-bold transition-colors",
                      (isCompleted || isCurrent) ? "text-gray-900" : "text-gray-400"
                    )}>
                      {s.label}
                    </h3>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-yellow-700 text-xs font-bold uppercase tracking-wider border border-gold/30">
                        In Progress
                      </span>
                    )}
                     {isCompleted && (
                      <span className="text-maroon">
                        <Check className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-md">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
