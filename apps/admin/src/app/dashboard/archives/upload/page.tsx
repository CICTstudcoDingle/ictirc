import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@ictirc/ui";
import { listIssues } from "@/lib/actions/issue";
import { SingleUploadForm } from "@/components/archives/single-upload-form";
import { BatchUploadForm } from "@/components/archives/batch-upload-form";

export const metadata = {
  title: "Upload Archived Papers",
  description: "Upload papers to the archive",
};

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Ensure user exists in local DB to satisfy foreign key constraints
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser && user.email) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        role: "EDITOR", // Default role for uploaded users in dev
      },
    });
  }

  const issuesResult = await listIssues();
  const issues = issuesResult.success ? issuesResult.data : [];

  if (!issues || issues.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Link href="/dashboard/archives">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archives
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Upload Archived Papers</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900">No Issues Available</h3>
          <p className="text-yellow-800 mt-2">
            You need to create at least one issue before you can upload papers.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/archives/volumes/new">
              <Button variant="outline">Create Volume First</Button>
            </Link>
            <Link href="/dashboard/archives/issues/new">
              <Button>Create Issue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Archives
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Upload Archived Papers</h1>
        <p className="text-muted-foreground mt-1">
          Upload individual papers or batch upload multiple papers to an issue
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single Upload</TabsTrigger>
          <TabsTrigger value="batch">Batch Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-6">
          <SingleUploadForm issues={issues || []} userId={user.id} />
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <BatchUploadForm issues={issues || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
