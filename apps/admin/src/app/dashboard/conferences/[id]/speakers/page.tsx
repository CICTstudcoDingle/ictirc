import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mic2, Trash2 } from "lucide-react";
import { Button } from "@ictirc/ui";
import { getConference, deleteKeynoteSpeaker } from "../../actions";
import { AddSpeakerForm } from "./add-speaker-form";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakersManagementPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getConference(id);

  if (!result.success || !result.conference) {
    notFound();
  }

  const conference = result.conference;
  const speakers = conference.speakers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/conferences/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Conference
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Keynote Speakers</h1>
            <p className="text-sm text-gray-500 mt-1">{conference.name}</p>
          </div>
        </div>
      </div>

      {/* Add Speaker Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Keynote Speaker</h2>
        <AddSpeakerForm conferenceId={id} />
      </div>

      {/* Speakers List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-maroon" />
            <h2 className="text-lg font-semibold text-gray-900">
              Current Speakers ({speakers.length})
            </h2>
          </div>
        </div>

        {speakers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {speakers.map((speaker) => (
              <div
                key={speaker.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {speaker.photoUrl ? (
                    <img
                      src={speaker.photoUrl}
                      alt={speaker.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-maroon/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center">
                      <span className="text-maroon font-bold text-lg">
                        {speaker.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{speaker.name}</p>
                    <p className="text-sm text-gray-600">{speaker.position}</p>
                    {speaker.affiliation && (
                      <p className="text-sm text-gray-500">{speaker.affiliation}</p>
                    )}
                    {speaker.location && (
                      <p className="text-xs text-gray-400">{speaker.location}</p>
                    )}
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteKeynoteSpeaker(speaker.id);
                    revalidatePath(`/dashboard/conferences/${id}/speakers`);
                  }}
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Mic2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No keynote speakers yet
            </h3>
            <p className="text-gray-500">
              Add speakers using the form above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
