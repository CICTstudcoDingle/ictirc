import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ictirc/ui";
import { BookOpen, FileText, Calendar } from "lucide-react";
import { prisma } from "@ictirc/database";

export async function ArchiveVolumesView() {
  const volumes = await prisma.volume.findMany({
    include: {
      issues: {
        include: {
          conference: true,
          _count: {
            select: {
              papers: true,
            },
          },
        },
        orderBy: {
          issueNumber: "asc",
        },
      },
    },
    orderBy: [
      { year: "desc" },
      { volumeNumber: "desc" },
    ],
  });

  if (volumes.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No volumes published yet</h3>
        <p className="text-muted-foreground mt-2">
          Check back later for published conference proceedings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {volumes.map((volume) => (
        <div key={volume.id} className="space-y-4">
          {/* Volume Header */}
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-maroon" />
            <div>
              <h2 className="text-2xl font-bold">
                Volume {volume.volumeNumber} ({volume.year})
              </h2>
              {volume.description && (
                <p className="text-muted-foreground text-sm">{volume.description}</p>
              )}
            </div>
          </div>

          {/* Issues Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {volume.issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/archive/volume/${volume.id}/issue/${issue.id}`}
              >
                <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Issue {issue.issueNumber}
                    </CardTitle>
                    <CardDescription>
                      {issue.month} {volume.year}
                      {issue.issn && ` • ISSN ${issue.issn}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {issue.theme && (
                      <p className="text-sm font-medium line-clamp-2">{issue.theme}</p>
                    )}
                    {issue.conference && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {issue.conference.name}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {issue._count.papers} paper{issue._count.papers !== 1 ? "s" : ""}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {volume.issues.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No issues published for this volume yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
