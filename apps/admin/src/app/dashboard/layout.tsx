import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessRoute } from "@/lib/rbac";
import { DashboardLayoutClient } from "./layout-client";

/**
 * Server-side dashboard layout guard.
 * Verifies the user is authenticated and authorized for the current route
 * before rendering the client shell.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUser();

  if (!auth.success) {
    redirect("/login");
  }

  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") || "/dashboard";

  if (!canAccessRoute(auth.user.role, pathname)) {
    redirect("/dashboard");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
