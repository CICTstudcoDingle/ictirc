import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { ConferenceForm } from "@/components/archives/conference-form";

export const metadata = {
  title: "Create Conference",
  description: "Create a new conference",
};

export default function NewConferencePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/conferences">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Conferences
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Conference</h1>
        <p className="text-muted-foreground mt-1">
          Add conference metadata to link with issues
        </p>
      </div>

      <ConferenceForm />
    </div>
  );
}
