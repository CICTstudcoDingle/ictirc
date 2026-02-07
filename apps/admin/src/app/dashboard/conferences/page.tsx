import Link from "next/link";
import { Plus, Calendar, Users, Star, Pencil, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@ictirc/ui";
import { prisma } from "@ictirc/database";
import { getConferences, setActiveConference, deleteConference } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function ConferencesPage() {
  const result = await getConferences();
  const conferences = result.success ? result.conferences : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conferences</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage conferences and their organizing committees
          </p>
        </div>
        <Link href="/dashboard/conferences/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Conference
          </Button>
        </Link>
      </div>

      {/* Conferences List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {conferences && conferences.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {conferences.map((conference: any) => (
              <div
                key={conference.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {conference.name}
                      </h3>
                      {conference.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Star className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {!conference.isPublished && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Draft
                        </span>
                      )}
                    </div>
                    {conference.fullName && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {conference.fullName}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(conference.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {conference._count?.committee || 0} committee members
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!conference.isActive && (
                      <form
                        action={async () => {
                          "use server";
                          await setActiveConference(conference.id);
                        }}
                      >
                        <Button variant="outline" size="sm" type="submit">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Set Active
                        </Button>
                      </form>
                    )}
                    <Link href={`/dashboard/conferences/${conference.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/dashboard/conferences/${conference.id}/committee`}>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Committee
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conferences yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first conference to get started
            </p>
            <Link href="/dashboard/conferences/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Conference
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
