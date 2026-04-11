"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, GraduationCap, Users, type LucideIcon } from "lucide-react";
import { cn } from "@ictirc/ui";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/programs", label: "Programs", icon: BookOpen },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/alumni", label: "Alumni", icon: Users },
];

export function CICTBottomNav() {
  const pathname = usePathname();

  const renderItem = (item: { href: string; label: string; icon: LucideIcon }) => {
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
          isActive ? "text-maroon" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <item.icon
          className={cn("w-6 h-6 transition-all", isActive && "scale-110")}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
      <div className="flex items-center h-16">
        {navItems.map(renderItem)}
      </div>
    </nav>
  );
}
