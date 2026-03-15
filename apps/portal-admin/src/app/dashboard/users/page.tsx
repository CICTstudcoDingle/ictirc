import { prisma } from "@ictirc/database";
import { Search, Filter, UserPlus } from "lucide-react";

export const metadata = {
  title: "User Management",
};

export default async function UsersPage() {
  let users: Awaited<ReturnType<typeof prisma.portalProfile.findMany>> = [];
  let totalCount = 0;

  try {
    [users, totalCount] = await Promise.all([
      prisma.portalProfile.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.portalProfile.count(),
    ]);
  } catch {
    // Tables might not exist yet
  }

  const roleColorMap: Record<string, string> = {
    STUDENT: "bg-blue-50 text-blue-700",
    SC_OFFICER: "bg-purple-50 text-purple-700",
    SC_SECRETARY: "bg-indigo-50 text-indigo-700",
    SC_TREASURER: "bg-cyan-50 text-cyan-700",
    SC_PRESIDENT: "bg-amber-50 text-amber-700",
    SC_ADVISER: "bg-green-50 text-green-700",
    PORTAL_ADMIN: "bg-red-50 text-red-700",
  };

  const typeColorMap: Record<string, string> = {
    STUDENT: "bg-blue-100 text-blue-800",
    FACULTY: "bg-green-100 text-green-800",
    ALUMNI: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} registered portal user{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-maroon text-white rounded-lg text-sm font-medium hover:bg-maroon-600 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  University ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course / Year
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No users registered yet. Click &quot;Add User&quot; to get
                    started.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name || "—"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {user.universityId || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          typeColorMap[user.userType] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          roleColorMap[user.portalRole] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.portalRole.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.course
                        ? `${user.course} — Year ${user.yearLevel || "?"}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
