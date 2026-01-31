"use client";

import { Sidebar } from "../../components/layout/sidebar";
import { AdminBottomNav } from "../../components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop & Mobile Drawer */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile spacing for fixed header */}
        <div className="p-4 md:p-8 min-h-full pt-16 md:pt-4 pb-20 md:pb-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <AdminBottomNav />
    </div>
  );
}
