import { prisma } from "@ictirc/database";
import Link from "next/link";
import {
  Plus, Calendar, Eye, Edit2, Send, Archive, Pin,
} from "lucide-react";
import {
  publishAnnouncementAction,
  archiveAnnouncementAction,
} from "./actions";

export const metadata = {
  title: "Announcements",
};

const statusColorMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-amber-50 text-amber-700",
};

export default async function AnnouncementsManagementPage() {
  let announcements: Awaited<
    ReturnType<typeof prisma.portalAnnouncement.findMany>
  > = [];

  try {
    announcements = await prisma.portalAnnouncement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 100,
    });
  } catch {
    // Tables might not exist yet
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            {announcements.length} announcement{announcements.length !== 1 ? "s" : ""} — published ones appear on the CICT website.
          </p>
        </div>
        <Link
          href="/dashboard/announcements/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-maroon text-white rounded-lg text-sm font-medium hover:bg-maroon/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-base font-medium">No announcements yet.</p>
            <p className="text-xs mt-2">
              Click &quot;New Announcement&quot; to create your first post.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    {announcement.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-gold shrink-0" />
                    )}
                    <h3 className="font-medium text-gray-900 truncate">
                      {announcement.title}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium shrink-0 ${
                        statusColorMap[announcement.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {announcement.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-mono truncate">/{announcement.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Publish quick action */}
                  {announcement.status === "DRAFT" && (
                    <form
                      action={async () => {
                        "use server";
                        await publishAnnouncementAction(announcement.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="Publish"
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Archive quick action */}
                  {announcement.status === "PUBLISHED" && (
                    <form
                      action={async () => {
                        "use server";
                        await archiveAnnouncementAction(announcement.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="Archive"
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Preview (opens CICT web) */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_CICT_URL || "https://isufstcict.com"}/announcements`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview on CICT site"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </a>

                  {/* Edit */}
                  <Link
                    href={`/dashboard/announcements/${announcement.id}/edit`}
                    title="Edit"
                    className="p-2 rounded-lg text-gray-400 hover:text-maroon hover:bg-maroon/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
