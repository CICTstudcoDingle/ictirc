"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@ictirc/ui";
import {
  LayoutDashboard,
  FileText,
  Send,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@ictirc/ui";
import { createClient } from "@/lib/supabase/client";

interface AuthorSidebarProps extends React.HTMLAttributes<HTMLElement> {
  userName?: string;
  userEmail?: string;
}

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Papers",
    href: "/dashboard/papers",
    icon: FileText,
  },
  {
    title: "Search Papers",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Submit New",
    href: "/dashboard/submit",
    icon: Send,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AuthorSidebar({
  className,
  userName,
  userEmail,
  ...props
}: AuthorSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside
      className={cn(
        "group relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-gray-100",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg text-maroon">
            <img
              src="/images/CICT_LOGO.png"
              alt="CICT Logo"
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm">Author Portal</span>
              <span className="text-xs text-gray-500 font-normal">ICTIRC</span>
            </div>
          </div>
        )}
        {collapsed && (
          <img
            src="/images/CICT_LOGO.png"
            alt="CICT Logo"
            className="w-8 h-8 object-contain"
          />
        )}

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && userName && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-maroon/5 text-maroon"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon
                className={cn("w-5 h-5 flex-shrink-0", isActive && "text-maroon")}
              />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
