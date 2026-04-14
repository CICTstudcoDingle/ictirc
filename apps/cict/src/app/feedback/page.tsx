"use client";

import { useState, useRef } from "react";
import { submitFeedbackAction, type FeedbackActionResult } from "./actions";
import {
  MessageSquare, Send, Star, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";

const CATEGORIES = ["General", "Suggestion", "Bug Report", "Concern"] as const;

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-gold text-gold"
                : "fill-gray-200 text-gray-300"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-500 font-medium">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<FeedbackActionResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setFieldErrors({});
    setResult(null);

    const formData = new FormData(e.currentTarget);
    if (rating > 0) formData.set("rating", String(rating));

    const res = await submitFeedbackAction(formData);
    setIsPending(false);

    if (res.success) {
      setResult(res);
      formRef.current?.reset();
      setRating(0);
    } else if (res.fieldErrors) {
      setFieldErrors(res.fieldErrors);
    } else {
      setResult(res);
    }
  }

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-maroon rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <MessageSquare className="w-4 h-4 text-gold" />
            <span className="text-sm text-gray-200 font-medium">Public Feedback</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Share Your <span className="text-gold">Feedback</span>
          </h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Help us improve CICT. Your feedback is anonymous unless you choose to share your details.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {result?.success ? (
          /* Success State */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your response has been recorded. We read every submission and use them to make CICT better.
            </p>
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon/90 transition-colors shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="border-l-4 border-maroon px-6 py-4 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Feedback Form</h2>
              <p className="text-sm text-gray-500 mt-0.5">All fields marked optional are truly optional — anonymous responses welcome.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Global error */}
              {result && !result.success && result.error && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {result.error}
                </div>
              )}

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="feedback-name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="feedback-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-gray-50 text-sm font-mono focus:outline-none focus:ring-1 transition-colors ${
                      fieldErrors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-maroon focus:ring-maroon/20"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
                  )}
                </div>
              </div>

              {/* Category + Subject */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    id="feedback-category"
                    name="category"
                    defaultValue="General"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback-subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="feedback-subject"
                    name="subject"
                    type="text"
                    placeholder="Brief subject line"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={5}
                  placeholder="Share your thoughts, suggestions, or concerns about CICT..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-gray-50 text-sm font-mono resize-none focus:outline-none focus:ring-1 transition-colors ${
                    fieldErrors.message ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-maroon focus:ring-maroon/20"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.message[0]}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <p className="text-xs text-gray-400">
                  Your response is anonymous by default. We may use feedback to improve our services.
                </p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon/90 transition-all shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] hover:shadow-[2px_2px_0px_0px_rgba(212,175,55,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Feedback</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export const dynamic = "force-dynamic";
