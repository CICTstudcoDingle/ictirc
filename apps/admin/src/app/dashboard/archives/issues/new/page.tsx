import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { IssueForm } from "@/components/archives/issue-form";

export const metadata = {
  title: "Create Issue",
  description: "Create a new publication issue",
};

export default function NewIssuePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/issues">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Issue</h1>
        <p className="text-muted-foreground mt-1">
          Add a new issue to a volume
        </p>
      </div>

      <IssueForm />
    </div>
  );
}
