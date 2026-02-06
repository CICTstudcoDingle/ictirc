import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect } from "next/navigation";
import { ProfileClient } from "./client";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      position: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <ProfileClient
      user={{
        id: dbUser.id,
        name: dbUser.name || "",
        email: dbUser.email,
        role: String(dbUser.role),
        position: dbUser.position || "",
        avatarUrl: dbUser.avatarUrl,
        createdAt: dbUser.createdAt.toISOString(),
      }}
    />
  );
}
