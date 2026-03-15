import { prisma } from "@ictirc/database";
import { Plus, Calendar, Eye, Edit2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Announcements",
};

export default async function AnnouncementsManagementPage() {
  let announcements: Awaited<
    ReturnType<typeof prisma.portalAnnouncement.findMany>
  > = [];

  try {
    announcements = await prisma.portalAnnouncement.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    // Tables might not exist yet
  }

  const statusColorMap: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600",
    PUBLISHED: "bg-green-50 text-green-700",
    ARCHIVED: "bg-amber-50 text-amber-700",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage portal announcements.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-maroon text-white rounded-lg text-sm font-medium hover:bg-maroon-600 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>No announcements created yet.</p>
            <p className="text-xs mt-2">
              Click &quot;New Announcement&quot; to publish your first one.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {announcement.title}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        statusColorMap[announcement.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {announcement.status}
                    </span>
                    {announcement.isPinned && (
                      <span className="text-xs text-amber-500">📌</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                    <span className="font-mono">/{announcement.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-maroon hover:bg-maroon/5 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
