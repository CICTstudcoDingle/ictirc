import { prisma } from "@ictirc/database";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Calendar, GitCommit, Tag } from "lucide-react";

const changeTypeColors = {
  FEATURE: "bg-blue-100 text-blue-700",
  ENHANCEMENT: "bg-green-100 text-green-700",
  BUGFIX: "bg-yellow-100 text-yellow-700",
  SECURITY: "bg-red-100 text-red-700",
  BREAKING: "bg-purple-100 text-purple-700",
  DEPRECATED: "bg-gray-100 text-gray-700",
};

const changeTypeLabels = {
  FEATURE: "Feature",
  ENHANCEMENT: "Enhancement",
  BUGFIX: "Bug Fix",
  SECURITY: "Security",
  BREAKING: "Breaking Change",
  DEPRECATED: "Deprecated",
};

export const metadata = {
  title: "Changelog - ICTIRC",
  description: "Version history and changelog for the ICTIRC platform",
};

export default async function ChangelogPage() {
  const releases = await prisma.release.findMany({
    where: {
      isPublished: true,
    },
    include: {
      entries: {
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      },
    },
    orderBy: {
      releaseDate: "desc",
    },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Track the evolution of the ICTIRC platform with our complete
              version history and feature updates.
            </p>
          </div>
        </div>

        {/* Releases */}
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {releases.length === 0 ? (
            <div className="bg-white border rounded-lg p-12 text-center">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Releases Yet</h3>
              <p className="text-gray-600">
                Check back soon for updates and new features
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {releases.map((release, index) => (
                <div
                  key={release.id}
                  id={`v${release.version}`}
                  className="scroll-mt-24"
                >
                  {/* Release Header */}
                  <div className="bg-white border rounded-lg p-8 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-3xl font-bold">
                            {release.title}
                          </h2>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            v{release.version}
                            {release.isBeta && " BETA"}
                          </span>
                          {index === 0 && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Latest
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(release.releaseDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          {release.gitCommitHash && (
                            <div className="flex items-center gap-1.5">
                              <GitCommit className="h-4 w-4" />
                              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {release.gitCommitHash.substring(0, 7)}
                              </code>
                            </div>
                          )}
                        </div>

                        {release.description && (
                          <p className="mt-4 text-gray-700 leading-relaxed">
                            {release.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Changelog Entries */}
                    {release.entries.length > 0 && (
                      <div className="space-y-6">
                        {/* Group by change type */}
                        {Object.entries(
                          release.entries.reduce((acc: any, entry: any) => {
                            if (!acc[entry.changeType]) {
                              acc[entry.changeType] = [];
                            }
                            acc[entry.changeType].push(entry);
                            return acc;
                          }, {})
                        ).map(([type, entries]: [string, any]) => (
                          <div key={type}>
                            <h3 className="font-semibold text-sm text-gray-600 uppercase mb-3 flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  changeTypeColors[type as keyof typeof changeTypeColors]
                                }`}
                              >
                                {changeTypeLabels[type as keyof typeof changeTypeLabels]}
                              </span>
                              <span className="text-gray-400">
                                ({entries.length})
                              </span>
                            </h3>
                            <ul className="space-y-2">
                              {entries.map((entry: any) => (
                                <li key={entry.id} className="flex gap-3">
                                  <span className="text-gray-400 mt-1.5">
                                    •
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {entry.title}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">
                                      {entry.description}
                                    </p>
                                    {(entry.prUrl || entry.issueUrl) && (
                                      <div className="flex gap-3 mt-2 text-xs text-blue-600">
                                        {entry.prUrl && (
                                          <a
                                            href={entry.prUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                          >
                                            PR #{entry.prNumber}
                                          </a>
                                        )}
                                        {entry.issueUrl && (
                                          <a
                                            href={entry.issueUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                          >
                                            Issue #{entry.issueNumber}
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
