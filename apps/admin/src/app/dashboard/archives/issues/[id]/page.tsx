import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { IssueForm } from "@/components/archives/issue-form";
import { getIssue } from "@/lib/actions/issue";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await getIssue(id);

  if (!result.success) {
    return { title: "Issue Not Found" };
  }

  return {
    title: `Edit Issue ${result.data?.issueNumber || ''}`,

    description: `Edit issue details`,
  };
}

export default async function EditIssuePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getIssue(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/issues">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Edit Issue {result.data?.issueNumber}
        </h1>
        <p className="text-muted-foreground mt-1">
          Update issue details
        </p>
      </div>

      <IssueForm issue={result.data} />
    </div>
  );
}
