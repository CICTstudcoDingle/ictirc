import { prisma } from "@ictirc/database";
import { Metadata } from "next";
import Link from "next/link";
import { User, FileText, Building } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";

export const metadata: Metadata = {
  title: "Authors | ISUFST CICT Research Repository",
  description: "Browse authors and researchers who have published in the ISUFST CICT Research Repository.",
};

async function getAuthors() {
  const authors = await prisma.author.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      affiliation: true,
      avatarUrl: true,
      papers: {
        where: {
          paper: {
            status: "PUBLISHED",
          },
        },
        select: {
          paperId: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Filter to only authors with published papers
  return authors.filter((a) => a.papers.length > 0);
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-12 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gold">Authors</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse researchers and contributors to the ISUFST CICT Research Repository
          </p>
        </div>
      </section>

      {/* Authors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {authors.length === 0 ? (
          <div className="text-center py-16">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No authors yet</h3>
            <p className="mt-2 text-gray-500">
              Authors will appear here once papers are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.id}`}
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-maroon/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {author.avatarUrl ? (
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-maroon">
                          {author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-maroon transition-colors truncate">
                      {author.name}
                    </h3>
                    {author.affiliation && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building className="w-3.5 h-3.5" />
                        <span className="truncate">{author.affiliation}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        {author.papers.length} published paper{author.papers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
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
