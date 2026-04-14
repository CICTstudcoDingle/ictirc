import { prisma } from "@ictirc/database";
import { Megaphone, Calendar, Pin, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Announcements | CICT",
  description:
    "Official announcements from the College of Information and Communication Technology at ISUFST Dingle Campus.",
};

export const dynamic = "force-dynamic";

type Announcement = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  publishedAt: Date | null;
  createdAt: Date;
  isPinned: boolean;
  status: string;
};

function groupByMonth(items: Announcement[]) {
  const groups: Record<string, Announcement[]> = {};
  items.forEach((item) => {
    const date = item.publishedAt ?? item.createdAt;
    const key = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

export default async function AnnouncementsPage() {
  let pinned: Awaited<ReturnType<typeof prisma.portalAnnouncement.findMany>> = [];
  let regular: Awaited<ReturnType<typeof prisma.portalAnnouncement.findMany>> = [];

  try {
    const all = await prisma.portalAnnouncement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    pinned = all.filter((a) => a.isPinned);
    regular = all.filter((a) => !a.isPinned);
  } catch {
    // DB not yet set up
  }

  const grouped = groupByMonth(regular);

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Megaphone className="w-4 h-4 text-gold" />
            <span className="text-sm text-gray-200 font-medium">Official Updates</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            CICT <span className="text-gold">Announcements</span>
          </h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Stay informed with the latest news and updates from the College of Information and Communication Technology.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Pinned */}
        {pinned.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-gold" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pinned</h2>
            </div>
            <div className="space-y-3">
              {pinned.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} pinned />
              ))}
            </div>
          </div>
        )}

        {/* Regular grouped by month */}
        {Object.keys(grouped).length === 0 && pinned.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Megaphone className="w-10 h-10 mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">No announcements yet.</p>
            <p className="text-sm mt-1">Check back soon for updates from CICT.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {month}
                </h2>
                <div className="flex-1 border-t border-gray-200" />
              </div>
              <div className="space-y-3">
                {items.map((a) => (
                  <AnnouncementCard key={a.id} announcement={a} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  pinned = false,
}: {
  announcement: {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    publishedAt: Date | null;
    createdAt: Date;
    isPinned: boolean;
  };
  pinned?: boolean;
}) {
  const date = announcement.publishedAt ?? announcement.createdAt;

  return (
    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden open:border-maroon/30 transition-colors">
      <summary className="flex items-start gap-4 px-5 py-4 cursor-pointer select-none list-none hover:bg-gray-50/50 transition-colors">
        {/* Left accent */}
        <div className={`w-1 self-stretch rounded-full shrink-0 ${pinned ? "bg-gold" : "bg-maroon"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            {pinned && <Pin className="w-3.5 h-3.5 text-gold shrink-0" />}
            <h3 className="font-semibold text-gray-900 text-base leading-snug">{announcement.title}</h3>
          </div>
          {announcement.excerpt && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{announcement.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400 font-mono">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 group-open:rotate-90 transition-transform" />
      </summary>
      <div className="px-5 pb-5 pl-10 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-4">
        {announcement.content}
      </div>
    </details>
  );
}
