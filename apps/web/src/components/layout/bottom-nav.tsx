"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, BookOpen, User, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@ictirc/ui";

const leftItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/archive", label: "Archive", icon: FileText },
];

const rightItems = [
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export function WebBottomNav() {
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
        {/* Left items */}
        {leftItems.map(renderItem)}

        {/* Center Plus Button */}
        <div className="flex flex-col items-center justify-center px-3">
          <Link
            href="/submit"
            aria-label="Add paper"
            className={cn(
              "flex items-center justify-center",
              "-mt-5 w-16 h-16 rounded-full",
              "bg-red-600 text-white",
              "shadow-[0_4px_14px_rgba(220,38,38,0.5)]",
              "transition-all duration-200 active:scale-95 hover:bg-red-700"
            )}
          >
            <Plus className="w-8 h-8" strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] font-medium text-gray-400 mt-0.5">Add Paper</span>
        </div>

        {/* Right items */}
        {rightItems.map(renderItem)}
      </div>
    </nav>
  );
}
