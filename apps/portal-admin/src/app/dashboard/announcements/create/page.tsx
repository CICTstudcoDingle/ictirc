import { createAnnouncementAction } from "../actions";
import Link from "next/link";
import { ArrowLeft, Pin } from "lucide-react";

export const metadata = {
  title: "New Announcement",
};

export default function CreateAnnouncementPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/announcements"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Announcement</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Published announcements appear on the CICT public website.
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={createAnnouncementAction} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="ann-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="ann-title"
              name="title"
              type="text"
              required
              placeholder="Announcement title..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="ann-slug" className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug <span className="text-gray-400 font-normal">(auto-generated if blank)</span>
            </label>
            <input
              id="ann-slug"
              name="slug"
              type="text"
              placeholder="custom-url-slug"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-mono focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="ann-excerpt" className="block text-sm font-medium text-gray-700 mb-1.5">
              Excerpt <span className="text-gray-400 font-normal">(short preview text)</span>
            </label>
            <textarea
              id="ann-excerpt"
              name="excerpt"
              rows={2}
              placeholder="Brief summary shown in card views..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm resize-none focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="ann-content" className="block text-sm font-medium text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ann-content"
              name="content"
              rows={10}
              required
              placeholder="Full announcement content..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm resize-y focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="ann-cover" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="ann-cover"
              name="coverImage"
              type="url"
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-mono focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>
        </div>

        {/* Options */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Publish Options</h3>

          {/* Status */}
          <div>
            <label htmlFor="ann-status" className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              id="ann-status"
              name="status"
              defaultValue="DRAFT"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="PUBLISHED">Publish Now</option>
            </select>
          </div>

          {/* isPinned */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="hidden"
              name="isPinned"
              value="false"
            />
            <input
              type="checkbox"
              name="isPinned"
              value="true"
              className="w-4 h-4 rounded border-gray-300 text-maroon focus:ring-maroon/20"
            />
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gray-700">Pin this announcement</span>
            </div>
            <span className="text-xs text-gray-400">Appears at the top of all lists</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard/announcements"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-maroon rounded-lg hover:bg-maroon/90 transition-colors shadow-sm"
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  );
}
