"use client";

import { useState } from "react";
import { MessageSquare, Send, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@ictirc/ui";
import { submitFeedback } from "@/app/actions/feedback";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const CATEGORIES = [
  "General",
  "Bug Report",
  "Feature Request",
  "Content",
  "Other",
];

export function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General",
    message: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitFeedback({
      name: formData.name || undefined,
      email: formData.email || undefined,
      subject: formData.subject || undefined,
      category: formData.category,
      message: formData.message,
      rating: formData.rating || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "General",
        message: "",
        rating: 0,
      });
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Thank You for Your Feedback!
        </h3>
        <p className="text-gray-600 mb-6">
          Your feedback helps us improve IRJICT. We appreciate your time and input.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ScrollAnimation direction="up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-maroon/10 rounded-full px-6 py-2 mb-4">
            <MessageSquare className="w-5 h-5 text-maroon" />
            <span className="text-sm font-semibold text-maroon uppercase tracking-wide">
              Share Your Thoughts
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Value Your <span className="text-maroon">Feedback</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us improve IRJICT by sharing your experience, reporting issues,
            or suggesting new features. Your feedback is anonymous by default.
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation direction="up" delay={0.2}>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10 space-y-6"
        >
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Subject & Category Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Brief subject"
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Your Experience{" "}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      rating: formData.rating === star ? 0 : star,
                    })
                  }
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || formData.rating)
                        ? "text-gold fill-gold"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-3 text-sm text-gray-500 font-mono">
                  {formData.rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Share your thoughts, suggestions, or report an issue..."
              rows={5}
              className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 text-sm font-mono focus:border-maroon focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right font-mono">
              {formData.message.length}/5000
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">
              Your feedback is anonymous by default
            </p>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="min-w-[160px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </span>
              )}
            </Button>
          </div>
        </form>
      </ScrollAnimation>
    </div>
  );
}
