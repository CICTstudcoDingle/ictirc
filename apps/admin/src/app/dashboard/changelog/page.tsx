import { prisma } from "@ictirc/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@ictirc/ui";
import { Plus, GitBranch, Calendar, Tag, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ChangelogList } from "@/components/changelog/changelog-list";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "DEAN") {
    redirect("/unauthorized");
  }

  // Fetch all releases with their entries
  const releases = await prisma.release.findMany({
    include: {
      entries: {
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      },
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      releaseDate: "desc",
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Changelog Management</h1>
          <Link href="/dashboard/changelog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Release
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage version releases and changelog entries for the ICTIRC platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Total Releases</span>
          </div>
          <p className="text-2xl font-bold">{releases.length}</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Published</span>
          </div>
          <p className="text-2xl font-bold">
            {releases.filter((r) => r.isPublished).length}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <EyeOff className="h-4 w-4" />
            <span className="text-sm font-medium">Drafts</span>
          </div>
          <p className="text-2xl font-bold">
            {releases.filter((r) => !r.isPublished).length}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <GitBranch className="h-4 w-4" />
            <span className="text-sm font-medium">Latest Version</span>
          </div>
          <p className="text-2xl font-bold">
            {releases[0]?.version || "N/A"}
          </p>
        </div>
      </div>

      {/* Releases List */}
      <ChangelogList releases={releases} userId={user.id} />
    </div>
  );
}
