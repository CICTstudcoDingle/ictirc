import type { Metadata } from "next";
import PublicPageLayout from "@/components/layout/public-page-layout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Bulletin Board",
  description:
    "Stay updated with the latest news, policies, and announcements from the CICT Student Council.",
};

// Static placeholder data
const bulletinItems = [
  {
    id: 1,
    title: "IO Week 2025 Schedule Released",
    type: "announcement",
    typeIcon: "📢",
    description:
      "The complete schedule for IO Week 2025 has been released. Mark your calendars and prepare for a week of innovation, competition, and collaboration.",
    date: "March 10, 2025",
    isPinned: true,
  },
  {
    id: 2,
    title: "Student Council General Assembly",
    type: "event",
    typeIcon: "📅",
    description:
      "All CICT students are required to attend the General Assembly this Friday at the Multipurpose Hall. Attendance will be checked.",
    date: "March 8, 2025",
    isPinned: true,
  },
  {
    id: 3,
    title: "Lab Access Hours Update",
    type: "policy",
    typeIcon: "🔒",
    description:
      "Computer laboratory access hours have been extended to 8:00 PM on weekdays. Weekend access requires faculty request form.",
    date: "March 5, 2025",
    isPinned: false,
  },
  {
    id: 4,
    title: "Scholarship Applications Open",
    type: "opportunity",
    typeIcon: "🎓",
    description:
      "Academic scholarships for the next semester are now open for application. Maintain a GWA of 1.75 or better to qualify.",
    date: "March 1, 2025",
    isPinned: false,
  },
  {
    id: 5,
    title: "Revised CBL Now Available",
    type: "announcement",
    typeIcon: "📜",
    description:
      "The revised Constitution and By-Laws of the CICT Student Council is now available for download on the portal.",
    date: "February 25, 2025",
    isPinned: false,
  },
  {
    id: 6,
    title: "CICT Shop Open for Pre-Orders",
    type: "announcement",
    typeIcon: "🛍️",
    description:
      "New CICT merchandise is available for pre-order! Visit the CICT Shop to browse apparel, stickers, and accessories.",
    date: "February 20, 2025",
    isPinned: false,
  },
];

const pinnedItems = bulletinItems.filter((item) => item.isPinned);
const regularItems = bulletinItems.filter((item) => !item.isPinned);

export default function BulletinPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Digital Bulletin Board
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Stay updated with the latest from CICT
          </p>
        </div>

        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
              📌 Pinned
            </h2>
            {pinnedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-6 backdrop-blur-sm hover:border-gold-500/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{item.typeIcon}</span>
                  <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    {item.type}
                  </span>
                  <span className="ml-auto text-xs text-white/40">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* Regular Items */}
        <div className="space-y-4">
          {regularItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{item.typeIcon}</span>
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="ml-auto text-xs text-white/40">
                  {item.date}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {bulletinItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl text-white/60">No announcements yet</h3>
            <p className="text-white/40 mt-2">Check back later for updates</p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-gold-400 hover:text-gold-300 font-semibold transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
