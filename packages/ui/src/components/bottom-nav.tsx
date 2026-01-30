"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, BookOpen, Calendar } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/archive", label: "Archive", icon: FileText },
  { href: "/conferences", label: "Events", icon: Calendar },
  { href: "/guides", label: "Guides", icon: BookOpen },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive
                  ? "text-maroon"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
