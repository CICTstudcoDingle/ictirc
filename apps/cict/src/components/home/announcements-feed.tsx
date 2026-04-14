import { prisma } from "@ictirc/database";
import Link from "next/link";
import { Megaphone, Pin, ArrowRight } from "lucide-react";

export async function AnnouncementsFeed() {
  let announcements: Awaited<
    ReturnType<typeof prisma.portalAnnouncement.findMany>
  > = [];

  try {
    announcements = await prisma.portalAnnouncement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 5,
    });
  } catch {
    // DB not yet set up
  }

  return (
    <section className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-maroon rounded-full" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Latest Updates
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Announcements
            </h2>
          </div>
          <Link
            href="/announcements"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-maroon hover:underline shrink-0 mt-auto"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No announcements yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((a) => {
              const date = a.publishedAt ?? a.createdAt;
              return (
                <div
                  key={a.id}
                  className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:border-maroon/30 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div className={`h-1 w-full ${a.isPinned ? "bg-gold" : "bg-maroon"}`} />
                  <div className="p-5">
                    {a.isPinned && (
                      <div className="flex items-center gap-1 mb-2">
                        <Pin className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">Pinned</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-maroon transition-colors">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{a.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        href="/announcements"
                        className="text-[11px] font-medium text-maroon hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile view all link */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-maroon"
          >
            View all announcements <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
