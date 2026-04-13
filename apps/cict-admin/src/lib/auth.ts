import { prisma, CictAdminRole } from "@ictirc/database";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ALL_ROLES: CictAdminRole[] = ["ADMIN", "FACULTY", "OFFICER"];

export async function requireCictAccess(allowedRoles: CictAdminRole[] = ALL_ROLES) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile = await prisma.cictAdminProfile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    profile = await prisma.cictAdminProfile.create({
      data: {
        id: user.id,
        email: user.email || `${user.id}@unknown.local`,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        role: "OFFICER",
      },
    });
  }

  if (!profile.isActive) {
    redirect("/unauthorized");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/unauthorized");
  }

  return { user, profile };
}
