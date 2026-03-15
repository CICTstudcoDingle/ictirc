import type { Metadata } from "next";
import PublicPageLayout from "@/components/layout/public-page-layout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Latest news, policies, and directives from the CICT Student Council.",
};

// Static placeholder data
const announcements = [
  {
    id: 1,
    title: "IO Week 2025 — Save the Date!",
    type: "event",
    priority: "high",
    body: "Information and Outreach Week 2025 is coming this April! Prepare for coding competitions, hackathons, tech talks, and more. Registration opens soon.",
    date: "March 12, 2025",
    isPinned: true,
  },
  {
    id: 2,
    title: "General Assembly: Mandatory Attendance",
    type: "directive",
    priority: "high",
    body: "All CICT students are required to attend the General Assembly on March 21, 2025 at the Multipurpose Hall. Attendance will be strictly monitored.",
    date: "March 10, 2025",
    isPinned: true,
  },
  {
    id: 3,
    title: "Lab Access Hours Extended",
    type: "policy",
    priority: "medium",
    body: "Computer laboratory hours are now extended until 8:00 PM on weekdays. Weekend access requires a faculty-approved request form submitted 24 hours in advance.",
    date: "March 5, 2025",
    isPinned: false,
  },
  {
    id: 4,
    title: "CICT Tech Portal is Now Live",
    type: "announcement",
    priority: "medium",
    body: "The official CICT Tech Portal is now live! Access your student dashboard, register for events, view announcements, and stay connected with the Student Council.",
    date: "February 28, 2025",
    isPinned: false,
  },
  {
    id: 5,
    title: "Scholarship Application: 2nd Semester",
    type: "opportunity",
    priority: "medium",
    body: "Academic scholarships for 2nd semester are now open. Students with a GWA of 1.75 or better may submit their application through the portal by March 30.",
    date: "February 20, 2025",
    isPinned: false,
  },
  {
    id: 6,
    title: "CBL Ratification Complete",
    type: "announcement",
    priority: "low",
    body: "The revised Constitution and By-Laws has been officially ratified and is now in effect. The full document is available for download in the portal.",
    date: "February 15, 2025",
    isPinned: false,
  },
];

const priorityStyles: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/5",
  medium: "border-white/10 bg-white/[0.03]",
  low: "border-white/5 bg-white/[0.02]",
};

const typeIcons: Record<string, string> = {
  event: "📅",
  directive: "⚠️",
  policy: "🔒",
  announcement: "📢",
  opportunity: "🎓",
};

const pinned = announcements.filter((a) => a.isPinned);
const regular = announcements.filter((a) => !a.isPinned);

export default function AnnouncementsPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Announcements
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Latest news, policies, and directives from the CICT Student Council
          </p>
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xs font-semibold text-gold-400 uppercase tracking-widest flex items-center gap-2">
              <span>📌</span> Pinned Announcements
            </h2>
            {pinned.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">
                    {typeIcons[item.type] || "📢"}
                  </span>
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
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        )}

        {/* Regular */}
        <div className="space-y-4">
          {regular.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border p-6 backdrop-blur-sm hover:bg-white/[0.06] transition-all ${priorityStyles[item.priority] || priorityStyles.medium}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">
                  {typeIcons[item.type] || "📢"}
                </span>
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
                {item.body}
              </p>
            </article>
          ))}
        </div>

        {/* Footer Link */}
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
