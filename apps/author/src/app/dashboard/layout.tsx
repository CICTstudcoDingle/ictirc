import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { AuthorSidebar } from "@/components/layout/author-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user info from database (role check moved here from middleware
  // because Prisma cannot run in Edge Runtime)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, role: true, isActive: true },
  });

  // User not in database — needs to complete registration
  if (!dbUser) {
    redirect("/register?step=complete");
  }

  // User is deactivated
  if (!dbUser.isActive) {
    redirect("/login?error=deactivated");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AuthorSidebar
        userName={dbUser?.name || user.email?.split("@")[0]}
        userEmail={user.email}
        className="hidden md:flex"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
