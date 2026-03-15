import { prisma } from "@ictirc/database";
import Link from "next/link";
import { Calendar } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Announcements",
  description: "Latest announcements from the CICT Student Council.",
};

export default async function AnnouncementsPage() {
  const announcements = await prisma.portalAnnouncement.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    take: 20,
  });

  return (
    <div className="bg-page-core min-h-screen">
      {/* Navbar spacer */}
      <div className="pt-24" />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="mb-12">
          <span className="badge-gold mb-4 inline-block">Latest News</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mt-2">
            Announcements
          </h1>
          <p className="text-white/50 mt-3">
            Stay updated with the latest directives and news from the CICT
            Student Council.
          </p>
        </div>

        {/* List */}
        {announcements.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-white/50">No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/announcements/${announcement.slug}`}
                className="glass-card p-6 block group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.isPinned && (
                        <span className="badge-gold text-[10px]">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {announcement.title}
                    </h2>
                    {announcement.excerpt && (
                      <p className="text-white/50 text-sm mt-2 line-clamp-2">
                        {announcement.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono">
                      {announcement.publishedAt
                        ? new Date(
                            announcement.publishedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Draft"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
