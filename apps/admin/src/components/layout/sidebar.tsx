"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  BookOpenCheck,
  CalendarDays,
  Building2,
  Upload,
  User,
} from "lucide-react";
import { cn } from "@ictirc/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/papers", label: "Papers", icon: FileText },
  {
    href: "/dashboard/archives",
    label: "Archives",
    icon: BookOpen,
    submenu: [
      { href: "/dashboard/archives/volumes", label: "Volumes", icon: BookOpenCheck },
      { href: "/dashboard/archives/issues", label: "Issues", icon: CalendarDays },
      { href: "/dashboard/archives/conferences", label: "Conferences", icon: Building2 },
      { href: "/dashboard/archives/upload", label: "Upload Papers", icon: Upload },
    ]
  },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: ScrollText },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Persist collapsed state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }

    // Auto-expand Archives if on archive page
    if (pathname.startsWith("/dashboard/archives")) {
      setExpandedMenus(prev => ({ ...prev, "/dashboard/archives": true }));
    }
  }, [pathname]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
    // Dispatch event for layout to respond
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { collapsed: newState } }));
  };

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-4 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <img
            src="/images/CICT_LOGO.png"
            alt="CICT Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-bold text-maroon">Admin</span>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-200 md:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center gap-3 border-b border-gray-100",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <img
              src="/images/CICT_LOGO.png"
              alt="CICT Logo"
              width={36}
              height={36}
              className="rounded-lg flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-maroon text-sm whitespace-nowrap">ICTIRC</h1>
                <p className="text-xs text-gray-400 whitespace-nowrap">Admin Panel</p>
              </div>
            )}
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-400 md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus[item.href];

            return (
              <div key={item.href}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-maroon/5 text-maroon"
                          : "text-gray-600 hover:bg-gray-100",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <ChevronRightSmall className="w-4 h-4 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </button>
                    {isExpanded && !isCollapsed && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                        {item.submenu?.map((subitem) => {
                          const isSubActive = pathname === subitem.href;
                          return (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                isSubActive
                                  ? "bg-maroon/10 text-maroon font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <subitem.icon className="w-4 h-4 flex-shrink-0" />
                              <span>{subitem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-maroon/5 text-maroon"
                        : "text-gray-600 hover:bg-gray-100",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        <div className="hidden md:block p-2 border-t border-gray-100">
          <button
            onClick={toggleCollapse}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            title={isCollapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
