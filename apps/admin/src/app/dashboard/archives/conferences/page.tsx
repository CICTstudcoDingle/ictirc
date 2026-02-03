import Link from "next/link";
import { Button } from "@ictirc/ui";
import { Plus, FileText } from "lucide-react";
import { listConferences } from "@/lib/actions/conference";
import { ConferenceCard } from "@/components/archives/conference-card";

export const metadata = {
  title: "Manage Conferences",
  description: "Manage conference metadata",
};

export default async function ConferencesPage() {
  const result = await listConferences();
  const conferences = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Conferences
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all conference metadata (upcoming and past)
          </p>
        </div>
        <Link href="/dashboard/archives/conferences/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Conference
          </Button>
        </Link>
      </div>

      {!conferences || conferences.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No conferences yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first conference to get started.
          </p>
          <Link href="/dashboard/archives/conferences/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Conference
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conferences?.map((conference) => (
            <ConferenceCard key={conference.id} conference={conference} />
          ))}
        </div>
      )}
    </div>
  );
}
