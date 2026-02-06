"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Rocket } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Getting Started",
    href: "/getting-started",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    title: "Admin Guide",
    href: "/admin",
    icon: <Shield className="h-4 w-4" />,
    items: [
      { title: "Dashboard", href: "/admin/dashboard" },
      { title: "Paper Management", href: "/admin/papers" },
      { title: "Archive System", href: "/admin/archives" },
      { title: "User Management", href: "/admin/users" },
      { title: "God Mode Settings", href: "/admin/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50/50 min-h-screen pt-20 pb-10 flex flex-col shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.02)] fixed left-0 top-0 bottom-0 z-40 overflow-y-auto hidden lg:flex">
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.href} className="mb-2">
            <Link
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                pathname === item.href
                  ? "bg-maroon/10 text-maroon border-l-4 border-l-maroon shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-maroon border-l-4 border-l-transparent"
              }`}
            >
              <span className={`transition-colors ${pathname === item.href ? "text-maroon" : "text-gray-400 group-hover:text-maroon"}`}>
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
            
            {item.items && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      pathname === subItem.href
                        ? "text-maroon bg-maroon/5 font-semibold"
                        : "text-gray-500 hover:text-maroon hover:bg-gray-100"
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer Info */}
      <div className="px-6 mt-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
            Documentation
          </p>
          <p className="text-xs font-mono text-gray-600">
            v1.2.0-stable
          </p>
        </div>
      </div>
    </aside>
  );
}
