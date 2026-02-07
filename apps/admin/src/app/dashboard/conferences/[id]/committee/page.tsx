import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Users, Trash2 } from "lucide-react";
import { Button } from "@ictirc/ui";
import { getConference, deleteCommitteeMember } from "../../actions";
import { AddMemberForm } from "./add-member-form";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommitteeManagementPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getConference(id);

  if (!result.success || !result.conference) {
    notFound();
  }

  const conference = result.conference;
  const committee = conference.committee || [];

  // Group by position
  const groupedMembers = committee.reduce((acc: Record<string, typeof committee>, member) => {
    const position = member.position || "Other";
    if (!acc[position]) acc[position] = [];
    acc[position].push(member);
    return acc;
  }, {});

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
            <h1 className="text-2xl font-bold text-gray-900">Committee Members</h1>
            <p className="text-sm text-gray-500 mt-1">{conference.name}</p>
          </div>
        </div>
      </div>

      {/* Add Member Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Member</h2>
        <AddMemberForm conferenceId={id} />
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-maroon" />
            <h2 className="text-lg font-semibold text-gray-900">
              Current Members ({committee.length})
            </h2>
          </div>
        </div>

        {committee.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedMembers).map(([position, members]) => (
              <div key={position} className="p-4">
                <h3 className="text-sm font-semibold text-maroon uppercase tracking-wide mb-3">
                  {position}
                </h3>
                <div className="space-y-2">
                  {(members as typeof committee).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center">
                            <span className="text-maroon font-semibold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          {member.affiliation && (
                            <p className="text-sm text-gray-500">{member.affiliation}</p>
                          )}
                        </div>
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCommitteeMember(member.id);
                          revalidatePath(`/dashboard/conferences/${id}/committee`);
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
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No committee members yet
            </h3>
            <p className="text-gray-500">
              Add members using the form above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
