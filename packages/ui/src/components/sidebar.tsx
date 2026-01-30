"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  onLogout?: () => void;
}

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Papers",
    href: "/dashboard/papers",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ className, onLogout, ...props }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg text-maroon">
            <div className="w-8 h-8 rounded-lg bg-maroon text-white flex items-center justify-center text-sm">
              IC
            </div>
            <span>ICTIRC</span>
          </div>
        )}
        {collapsed && (
           <div className="w-8 h-8 mx-auto rounded-lg bg-maroon text-white flex items-center justify-center text-sm font-bold">
              IC
            </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-gray-400 hover:text-gray-600", collapsed && "hidden group-hover:block")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
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
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-maroon")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
