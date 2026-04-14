import { prisma } from "@ictirc/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pin } from "lucide-react";
import { updateAnnouncementAction } from "../../actions";

export const metadata = {
  title: "Edit Announcement",
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const announcement = await prisma.portalAnnouncement.findUnique({
    where: { id },
  });

  if (!announcement) notFound();

  const action = updateAnnouncementAction.bind(null);

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Announcement</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">/{announcement.slug}</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={announcement.id} />

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              required
              defaultValue={announcement.title}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-1.5">
              Excerpt
            </label>
            <textarea
              id="edit-excerpt"
              name="excerpt"
              rows={2}
              defaultValue={announcement.excerpt ?? ""}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm resize-none focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="edit-content"
              name="content"
              rows={10}
              required
              defaultValue={announcement.content}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm resize-y focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="edit-cover" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image URL
            </label>
            <input
              id="edit-cover"
              name="coverImage"
              type="url"
              defaultValue={announcement.coverImage ?? ""}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-mono focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            />
          </div>
        </div>

        {/* Options */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Publish Options</h3>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              defaultValue={announcement.status}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 transition-colors"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPinned"
              value="true"
              defaultChecked={announcement.isPinned}
              className="w-4 h-4 rounded border-gray-300 text-maroon focus:ring-maroon/20"
            />
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gray-700">Pin this announcement</span>
            </div>
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
