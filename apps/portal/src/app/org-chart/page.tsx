import type { Metadata } from "next";
import PublicPageLayout from "@/components/layout/public-page-layout";

export const metadata: Metadata = {
  title: "Organizational Chart",
  description:
    "Meet the CICT Student Council officers and learn about their roles.",
};

const levelLabels: Record<string, string> = {
  "0": "Adviser",
  "1": "Executive Officers",
  "2": "Core Officers",
  "3": "Staff Officers",
  "4": "Representatives",
};

// Static placeholder officers grouped by level
const groupedOfficers: Record<
  string,
  { id: number; name: string; position: string; course: string | null }[]
> = {
  "1": [
    { id: 1, name: "SC President", position: "President", course: "BSIT" },
    {
      id: 2,
      name: "VP Internal",
      position: "Vice President - Internal",
      course: "BSCS",
    },
    {
      id: 3,
      name: "VP External",
      position: "Vice President - External",
      course: "BSIT",
    },
  ],
  "2": [
    { id: 4, name: "Secretary", position: "Secretary", course: "BSIT" },
    { id: 5, name: "Treasurer", position: "Treasurer", course: "BSCS" },
    { id: 6, name: "Auditor", position: "Auditor", course: "BSIT" },
    {
      id: 7,
      name: "P.R.O.",
      position: "Public Relations Officer",
      course: "BSIT",
    },
  ],
};

export default function OrgChartPage() {
  const hasOfficers = Object.keys(groupedOfficers).length > 0;

  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Organizational Chart
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Meet the CICT Student Council Officers
          </p>
        </div>

        {/* Academic Year Selector Placeholder */}
        <div className="mb-12 flex justify-center">
          <div className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-white backdrop-blur-sm text-sm">
            SY 2024-2025 (Current)
          </div>
        </div>

        {/* Org Chart */}
        {!hasOfficers ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl text-white/60">No officers found</h3>
            <p className="text-white/40 mt-2">Check back later</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedOfficers)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([level, officers]) => (
                <div key={level} className="relative">
                  {/* Level Label */}
                  <div className="mb-8 text-center">
                    <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-sm font-semibold text-gold-400">
                      {levelLabels[level] || `Level ${level}`}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {Number(level) > 1 && (
                    <div className="absolute left-1/2 -top-8 h-8 w-px bg-gradient-to-b from-gold-500/50 to-gold-500/20" />
                  )}

                  {/* Officers Grid */}
                  <div
                    className={`grid gap-6 justify-center ${
                      officers.length === 1
                        ? "grid-cols-1 max-w-xs mx-auto"
                        : officers.length === 2
                          ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    }`}
                  >
                    {officers.map((officer) => (
                      <div
                        key={officer.id}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:-translate-y-1 text-center"
                      >
                        {/* Photo placeholder */}
                        <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-gold-500/30 bg-gradient-to-br from-gold-400/20 to-maroon-600/20 flex items-center justify-center transition-all group-hover:border-gold-500/60">
                          <span className="text-3xl text-gold-400/60 font-bold">
                            {officer.name.charAt(0)}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                          {officer.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-gold-500">
                          {officer.position}
                        </p>
                        {officer.course && (
                          <p className="mt-2 text-xs text-white/50">
                            {officer.course}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}
