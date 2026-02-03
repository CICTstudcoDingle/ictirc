import Link from "next/link";
import { Button } from "@ictirc/ui";
import { Plus, Calendar } from "lucide-react";
import { listIssues } from "@/lib/actions/issue";
import { IssueCard } from "@/components/archives/issue-card";

export const metadata = {
  title: "Manage Issues",
  description: "Manage publication issues",
};

export default async function IssuesPage() {
  const result = await listIssues();
  const issues = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Issues
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage publication issues
          </p>
        </div>
        <Link href="/dashboard/archives/issues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </Link>
      </div>

      {!issues || issues.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No issues yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first issue to start publishing papers.
          </p>
          <Link href="/dashboard/archives/issues/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Issue
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {issues?.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
