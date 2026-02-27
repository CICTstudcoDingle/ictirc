import Link from "next/link";
import { prisma } from "@ictirc/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ictirc/ui";
import { BookOpen, FileText, Calendar, Upload } from "lucide-react";

export const metadata = {
  title: "Archive Management",
  description: "Manage conference volumes, issues, and archived papers",
};

async function getArchiveStats() {
  const [volumeCount, issueCount, paperCount, recentUploads] = await Promise.all([
    prisma.volume.count(),
    prisma.issue.count(),
    prisma.archivedPaper.count(),
    prisma.archivedPaper.findMany({
      take: 5,
      orderBy: { uploadedAt: "desc" },
      include: {
        authors: {
          orderBy: { order: "asc" },
          take: 1,
        },
        issue: {
          include: {
            volume: true,
          },
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    volumeCount,
    issueCount,
    paperCount,
    recentUploads,
  };
}

export default async function ArchiveDashboardPage() {
  const stats = await getArchiveStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Archive Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage conference proceedings, volumes, and issues
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volumes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.volumeCount}</div>
            <p className="text-xs text-muted-foreground">
              Publication volumes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issueCount}</div>
            <p className="text-xs text-muted-foreground">
              Published issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paperCount}</div>
            <Link
              href="/dashboard/archives/papers"
              className="text-xs text-blue-600 hover:underline"
            >
              View all archived papers →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Issue</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.issueCount > 0 ? "Active" : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              Archive status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing the archive
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/archives/volumes/new">
            <Button className="w-full" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              New Volume
            </Button>
          </Link>
          <Link href="/dashboard/archives/issues/new">
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              New Issue
            </Button>
          </Link>
          <Link href="/dashboard/archives/upload">
            <Button className="w-full" variant="primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload Papers
            </Button>
          </Link>
          <Link href="/dashboard/archives/conferences/new">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Conference
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>
            Recently uploaded archived papers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUploads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No papers uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentUploads.map((paper) => (
                <div key={paper.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <Link
                      href={`/dashboard/archives/papers/${paper.id}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {paper.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {paper.authors[0]?.name}
                      {paper.authors.length > 1 && ` + ${paper.authors.length - 1} more`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Volume {paper.issue.volume.volumeNumber}, Issue {paper.issue.issueNumber} •
                      Uploaded by {paper.uploader.name} •
                      {new Date(paper.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Links */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/dashboard/archives/volumes">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Volumes
              </CardTitle>
              <CardDescription>
                Manage publication volumes
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/archives/issues">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Issues
              </CardTitle>
              <CardDescription>
                Manage journal issues
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/archives/papers">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Papers
              </CardTitle>
              <CardDescription>
                Browse and manage archived papers
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/archives/conferences">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Conferences
              </CardTitle>
              <CardDescription>
                Manage conference metadata
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
