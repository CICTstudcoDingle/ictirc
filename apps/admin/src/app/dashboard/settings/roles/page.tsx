import Link from "next/link";
import { Plus, Shield, Trash2, Pencil } from "lucide-react";
import { Button } from "@ictirc/ui";
import { getRoles, deleteRole, initializeSystemRoles } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const result = await getRoles();
  const roles = result.success ? result.roles : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and permissions (DEAN only)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form
            action={async () => {
              "use server";
              await initializeSystemRoles();
              revalidatePath("/dashboard/settings/roles");
            }}
          >
            <Button variant="outline" type="submit">
              Initialize System Roles
            </Button>
          </form>
          <Link href="/dashboard/settings/roles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Role
            </Button>
          </Link>
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {roles && roles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {roles.map((role: any) => (
              <div
                key={role.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-maroon/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-maroon" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {role.displayName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600">
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            System
                          </span>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {role.description}
                        </p>
                      )}
                      {role.permissions && role.permissions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {role.permissions.slice(0, 5).map((perm: string) => (
                            <span
                              key={perm}
                              className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                            >
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                              +{role.permissions.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!role.isSystem && (
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/settings/roles/${role.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteRole(role.id);
                          revalidatePath("/dashboard/settings/roles");
                        }}
                      >
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No roles defined
            </h3>
            <p className="text-gray-500 mb-4">
              Initialize system roles or create custom ones
            </p>
            <form
              action={async () => {
                "use server";
                await initializeSystemRoles();
                revalidatePath("/dashboard/settings/roles");
              }}
            >
              <Button type="submit">Initialize System Roles</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
