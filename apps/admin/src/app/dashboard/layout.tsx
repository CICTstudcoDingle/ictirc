"use client";

import { Sidebar } from "@ictirc/ui";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block h-full shadow-lg z-10">
        <Sidebar className="h-full border-r border-gray-200" onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header / Toggle would go here or be part of a mobile sidebar implementation 
             For now, relying on Sidebar's desktop nature as per request "sidebar on left"
         */}
        <div className="p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
