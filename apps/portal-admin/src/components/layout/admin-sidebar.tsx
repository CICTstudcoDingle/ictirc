"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Calendar,
  MessageSquare,
  Shield,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const sidebarLinks = [
  {
    section: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Content",
    items: [
      { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
      { href: "/dashboard/events", label: "Events", icon: Calendar },
    ],
  },
  {
    section: "Management",
    items: [
      { href: "/dashboard/users", label: "Users", icon: Users },
      { href: "/dashboard/officers", label: "Officers", icon: Shield },
      { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-maroon flex items-center justify-center">
            <span className="text-white text-sm font-bold">CP</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Portal Admin</div>
            <div className="text-[10px] text-gray-400 font-mono">CICT</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6">
        {sidebarLinks.map((section) => (
          <div key={section.section}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
              {section.section}
            </div>
            <div className="space-y-1">
              {section.items.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <a
          href={process.env.NEXT_PUBLIC_PORTAL_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link text-xs"
        >
          <ExternalLink className="w-4 h-4" />
          View Portal
        </a>
        <button onClick={handleLogout} className="sidebar-link text-xs w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
