"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Archive, Trash2, Star, Mail, Clock } from "lucide-react";
import { markFeedbackAsRead, markFeedbackAsUnread, archiveFeedback, deleteFeedback } from "@/app/actions/feedback";

interface FeedbackItem {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  category: string;
  message: string;
  rating: number | null;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

interface FeedbackTableProps {
  initialFeedback: FeedbackItem[];
  totalPages: number;
  currentPage: number;
}

const categoryColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800",
  "Bug Report": "bg-red-100 text-red-800",
  "Feature Request": "bg-purple-100 text-purple-800",
  Content: "bg-green-100 text-green-800",
  Other: "bg-gray-100 text-gray-800",
};

export function FeedbackTable({ initialFeedback, totalPages, currentPage }: FeedbackTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markFeedbackAsRead(id);
    });
  };

  const handleMarkUnread = (id: string) => {
    startTransition(async () => {
      await markFeedbackAsUnread(id);
    });
  };

  const handleArchive = (id: string) => {
    startTransition(async () => {
      await archiveFeedback(id);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this feedback?")) {
      startTransition(async () => {
        await deleteFeedback(id);
      });
    }
  };

  if (initialFeedback.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Feedback Yet</h3>
        <p className="text-sm text-gray-500">Feedback submissions will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {initialFeedback.map((item) => (
          <div
            key={item.id}
            className={`transition-colors ${
              !item.isRead ? "bg-maroon/[0.02]" : ""
            } ${isPending ? "opacity-50" : ""}`}
          >
            {/* Row Summary */}
            <div
              className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              {/* Unread indicator */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!item.isRead ? "bg-maroon" : "bg-transparent"}`} />

              {/* Category badge */}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${categoryColors[item.category] || categoryColors.Other}`}>
                {item.category}
              </span>

              {/* Subject / Message preview */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${!item.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                  {item.subject || item.message.substring(0, 80)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <span>{item.name || "Anonymous"}</span>
                  {item.rating && (
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      {item.rating}/5
                    </span>
                  )}
                </p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span className="font-mono">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === item.id && (
              <div className="px-6 pb-5 pl-12 border-t border-gray-50">
                <div className="grid md:grid-cols-3 gap-4 mt-4 mb-4">
                  {item.name && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Name</p>
                      <p className="text-sm text-gray-900">{item.name}</p>
                    </div>
                  )}
                  {item.email && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <a href={`mailto:${item.email}`} className="text-sm text-maroon hover:underline">
                        {item.email}
                      </a>
                    </div>
                  )}
                  {item.rating && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Rating</p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating!
                                ? "text-gold fill-gold"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.isRead ? (
                    <button
                      onClick={() => handleMarkUnread(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      Mark Unread
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
