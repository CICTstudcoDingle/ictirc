import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { ConferenceForm } from "@/components/archives/conference-form";

export default function NewConferencePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/conferences">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Conference</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a new conference to the system
          </p>
        </div>
      </div>

      {/* Full form with banner, logo, organizers, partners, etc. */}
      <ConferenceForm redirectTo="/dashboard/conferences" />
    </div>
  );
}
