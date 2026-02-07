import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@ictirc/ui";
import { getConference } from "../actions";
import { ConferenceEditForm } from "./conference-edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditConferencePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getConference(id);

  if (!result.success || !result.conference) {
    notFound();
  }

  const conference = result.conference;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/conferences">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Conference</h1>
            <p className="text-sm text-gray-500 mt-1">{conference.name}</p>
          </div>
        </div>
        <Link href={`/dashboard/conferences/${id}/committee`}>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Manage Committee ({conference.committee?.length || 0})
          </Button>
        </Link>
      </div>

      {/* Form */}
      <ConferenceEditForm conference={conference} />
    </div>
  );
}
