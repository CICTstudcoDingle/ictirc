"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { AdminBottomNav } from "../../components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check initial collapsed state from localStorage
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }

    // Listen for sidebar toggle events
    const handleToggle = (e: CustomEvent<{ collapsed: boolean }>) => {
      setIsCollapsed(e.detail.collapsed);
    };

    window.addEventListener("sidebar-toggle", handleToggle as EventListener);
    return () => {
      window.removeEventListener("sidebar-toggle", handleToggle as EventListener);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop & Mobile Drawer */}
      <Sidebar />

      {/* Main Content - offset for sidebar on desktop */}
      <main
        className={`flex-1 overflow-y-auto relative transition-all duration-200 ${isCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
      >
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
